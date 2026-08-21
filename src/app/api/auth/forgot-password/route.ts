import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      // Don't reveal user existence for privacy security
      return NextResponse.json({
        success: true,
        message: 'If the email exists in our system, a password reset link has been dispatched.'
      });
    }

    const resetToken = generateToken();
    const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: resetExpiry
      }
    });

    const resetUrl = `https://compliance.salazar-group.net/reset-password?token=${resetToken}`;
    const activationUrl = `https://compliance.salazar-group.net/activate?token=${user.activationToken || resetToken}`;

    await prisma.auditTrail.create({
      data: {
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: user.id,
        description: `Password reset link dispatched for ${user.email}. Link: ${resetUrl}`
      }
    });

    return NextResponse.json({
      success: true,
      message: `Activation & Password Reset link dispatched to ${user.email}!`,
      simulatedEmail: {
        to: user.email,
        subject: 'Action Required: Activate Your FlowForceRM Compliance Account & Reset Password',
        activationLink: activationUrl,
        resetLink: resetUrl
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
