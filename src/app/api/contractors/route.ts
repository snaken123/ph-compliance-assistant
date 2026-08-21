import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const contractors = await prisma.contractorRecord.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, contractors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Evaluate DOLE Control Score (0 to 100)
    // Factors: Fixed working hours (+30), Using company equipment (+25), Exclusive engagement (+25), Direct supervision of process (+20)
    const score = (body.hasFixedHours ? 30 : 0) +
                  (body.usesCompanyEquipment ? 25 : 0) +
                  (body.isExclusive ? 25 : 0) +
                  (body.hasDirectSupervision ? 20 : 0);

    let riskLevel = 'LOW';
    if (score >= 60) {
      riskLevel = 'HIGH_EMPLOYEE_RISK';
    } else if (score >= 35) {
      riskLevel = 'MEDIUM';
    }

    const contractor = await prisma.contractorRecord.create({
      data: {
        contractorName: body.contractorName,
        serviceProvided: body.serviceProvided,
        agreementType: body.agreementType || 'INDEPENDENT_CONTRACTOR',
        monthlyPayment: body.monthlyPayment || 0,
        doleControlScore: score,
        riskLevel,
        hasTaxWithholding: body.hasTaxWithholding ?? false,
        hasSignedAgreement: body.hasSignedAgreement ?? true,
        notes: body.notes
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'CONTRACTOR_ADDED',
        entityType: 'ContractorRecord',
        entityId: contractor.id,
        description: `Contractor added: ${contractor.contractorName} (${contractor.serviceProvided}). Evaluated Control Risk Level: ${riskLevel} (${score}/100).`
      }
    });

    return NextResponse.json({ success: true, contractor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
