import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.complianceDeadline.update({
      where: { id },
      data: {
        status: body.status,
        submittedAt: body.status === 'COMPLETED' || body.status === 'PAID' ? new Date() : undefined,
        paymentReference: body.paymentReference,
        notes: body.notes
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'DEADLINE_UPDATED',
        entityType: 'ComplianceDeadline',
        entityId: id,
        description: `Deadline "${updated.title}" status marked as ${updated.status}.`
      }
    });

    return NextResponse.json({ success: true, deadline: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
