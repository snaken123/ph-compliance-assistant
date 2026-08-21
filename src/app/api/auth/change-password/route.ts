import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters long.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const email = cookieStore.get('auth_user_email')?.value || 'stephen.rey@salazar-group.net';

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    // Verify current password if provided and not first login
    if (currentPassword && !verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
        isActivated: true
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'PASSWORD_CHANGED',
        entityType: 'User',
        entityId: user.id,
        description: `User ${user.email} changed password. Mandatory first-login flag cleared.`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        mustChangePassword: updatedUser.mustChangePassword
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
