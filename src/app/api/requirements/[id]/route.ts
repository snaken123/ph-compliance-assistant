import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.requirementItem.update({
      where: { id },
      data: {
        completionState: body.completionState,
        applicabilityStatus: body.applicabilityStatus,
        notes: body.notes,
        referenceNo: body.referenceNo,
        dueDate: body.dueDate
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'REQUIREMENT_STATUS_UPDATED',
        entityType: 'RequirementItem',
        entityId: id,
        description: `Requirement "${updated.title}" updated state to ${updated.completionState} (${updated.applicabilityStatus}).`
      }
    });

    return NextResponse.json({ success: true, requirement: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
