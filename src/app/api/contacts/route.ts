import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const contacts = await prisma.governmentContactLog.findMany({
      orderBy: { dateContacted: 'desc' }
    });
    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const log = await prisma.governmentContactLog.create({
      data: {
        agency: body.agency,
        officeName: body.officeName,
        personContacted: body.personContacted,
        contactMethod: body.contactMethod || 'PHONE',
        dateContacted: body.dateContacted ? new Date(body.dateContacted) : new Date(),
        questionAsked: body.questionAsked,
        answerReceived: body.answerReceived,
        referenceNumber: body.referenceNumber,
        notes: body.notes
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'GOVT_CONTACT_LOGGED',
        entityType: 'GovernmentContactLog',
        entityId: log.id,
        description: `Government inquiry logged with ${log.agency} (${log.officeName}). Question: "${log.questionAsked.slice(0, 50)}..."`
      }
    });

    return NextResponse.json({ success: true, contact: log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
