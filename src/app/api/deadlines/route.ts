import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deadlines = await prisma.complianceDeadline.findMany({
      orderBy: { dueDate: 'asc' }
    });

    const now = new Date();

    // Dynamically calculate escalation levels
    const processed = deadlines.map((d) => {
      const due = new Date(d.dueDate);
      const diffTime = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let escalationLevel = d.escalationLevel;
      let isOverdue = false;

      if (d.status !== 'COMPLETED' && d.status !== 'WAIVED') {
        if (diffDays < 0) {
          escalationLevel = 'OVERDUE_ACTIVE';
          isOverdue = true;
        } else if (diffDays === 0) {
          escalationLevel = 'DUE_TODAY';
        } else if (diffDays <= 1) {
          escalationLevel = 'URGENT_1D';
        } else if (diffDays <= 3) {
          escalationLevel = 'URGENT_3D';
        } else if (diffDays <= 7) {
          escalationLevel = 'WARNING_7D';
        } else if (diffDays <= 14) {
          escalationLevel = 'WARNING_14D';
        } else if (diffDays <= 30) {
          escalationLevel = 'WARNING_30D';
        } else {
          escalationLevel = 'NORMAL';
        }
      }

      return {
        ...d,
        diffDays,
        escalationLevel,
        isOverdue
      };
    });

    return NextResponse.json({ success: true, deadlines: processed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newDeadline = await prisma.complianceDeadline.create({
      data: {
        agency: body.agency,
        title: body.title,
        period: body.period || 'ONE_TIME',
        dueDate: new Date(body.dueDate),
        amount: body.amount || 0,
        notes: body.notes
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'DEADLINE_CREATED',
        entityType: 'ComplianceDeadline',
        entityId: newDeadline.id,
        description: `New deadline created: "${newDeadline.title}" due ${newDeadline.dueDate.toISOString().split('T')[0]}.`
      }
    });

    return NextResponse.json({ success: true, deadline: newDeadline });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
