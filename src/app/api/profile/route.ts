import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { evaluateBusinessCompliance } from '@/lib/compliance/engine';
import { BusinessProfileData } from '@/lib/compliance/types';

export async function GET() {
  try {
    let profile = await prisma.businessProfile.findUnique({
      where: { id: 'flowforce-main' }
    });

    if (!profile) {
      profile = await prisma.businessProfile.create({
        data: {
          id: 'flowforce-main',
          businessName: 'FlowForceRM',
          tradeName: 'FlowForceRM',
          businessActivity: 'SaaS / Software Development',
          isOnline: true,
          isHomeBased: true,
          propertyType: 'owned_residence',
          province: 'Metro Manila',
          cityMunicipality: 'Quezon City',
          barangay: 'Barangay Holy Spirit',
          addressDetail: '123 Innovation St., Quezon City',
          tinNumber: '',
          birRdoNumber: 'RDO 039 - Quezon City South',
          sssNumber: '',
          philHealthPin: '',
          pagIbigMid: '',
          dtiCertificateNo: '',
          lguBinNumber: '',
          hasEmployees: false,
          employeeCount: 0,
          hasContractors: true,
          hasForeignClients: true,
          hasLocalClients: true,
          monthlyGrossReceipts: 10000,
          annualGrossReceipts: 120000,
          taxRegime: 'EIGHT_PERCENT',
          mode: 'REGISTRATION'
        }
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const annualGross = (body.monthlyGrossReceipts || 10000) * 12;

    const profileData: any = {
      businessName: body.businessName || 'FlowForceRM',
      tradeName: body.tradeName || body.businessName || 'FlowForceRM',
      businessActivity: body.businessActivity || 'SaaS / Software Development',
      isOnline: body.isOnline ?? true,
      isHomeBased: body.isHomeBased ?? true,
      propertyType: body.propertyType || 'owned_residence',
      province: body.province || 'Metro Manila',
      cityMunicipality: body.cityMunicipality || 'Quezon City',
      barangay: body.barangay || 'Barangay Holy Spirit',
      addressDetail: body.addressDetail || 'Quezon City',
      
      // Compliance Government Identifiers
      tinNumber: body.tinNumber || '',
      birRdoNumber: body.birRdoNumber || '',
      sssNumber: body.sssNumber || '',
      philHealthPin: body.philHealthPin || '',
      pagIbigMid: body.pagIbigMid || '',
      dtiCertificateNo: body.dtiCertificateNo || '',
      lguBinNumber: body.lguBinNumber || '',

      hasEmployees: body.hasEmployees ?? false,
      employeeCount: body.employeeCount ?? 0,
      hasContractors: body.hasContractors ?? true,
      hasForeignClients: body.hasForeignClients ?? true,
      hasLocalClients: body.hasLocalClients ?? true,
      monthlyGrossReceipts: body.monthlyGrossReceipts || 10000,
      annualGrossReceipts: annualGross,
      taxRegime: body.taxRegime || 'EIGHT_PERCENT',
      mode: body.mode || 'REGISTRATION'
    };

    const updatedProfile = await prisma.businessProfile.upsert({
      where: { id: 'flowforce-main' },
      update: profileData,
      create: { id: 'flowforce-main', ...profileData }
    });

    // Recalculate compliance requirements dynamically
    const evalResult = evaluateBusinessCompliance(profileData as BusinessProfileData);
    
    for (const reqItem of evalResult.requirements) {
      await prisma.requirementItem.upsert({
        where: { code: reqItem.code },
        update: {
          applicabilityStatus: reqItem.applicabilityStatus,
          whyItApplies: reqItem.whyItApplies,
          whyItMightNotApply: reqItem.whyItMightNotApply,
          notes: reqItem.reasoning
        },
        create: {
          code: reqItem.code,
          agency: reqItem.agency,
          title: reqItem.title,
          description: reqItem.description,
          whyItApplies: reqItem.whyItApplies,
          whyItMightNotApply: reqItem.whyItMightNotApply,
          consequencesAndPenalties: reqItem.consequencesAndPenalties,
          priority: reqItem.priority,
          applicabilityStatus: reqItem.applicabilityStatus,
          completionState: reqItem.completionState,
          estimatedFee: reqItem.estimatedFee,
          legalBasis: reqItem.legalBasis,
          officialSource: reqItem.officialSource,
          officialSourceUrl: reqItem.officialSourceUrl,
          dateVerified: reqItem.dateVerified,
          frequency: reqItem.frequency,
          notes: reqItem.reasoning
        }
      });
    }

    await prisma.auditTrail.create({
      data: {
        action: 'PROFILE_AND_GOVT_IDS_UPDATED',
        entityType: 'BusinessProfile',
        entityId: 'flowforce-main',
        description: `Profile & LGU location updated for ${updatedProfile.businessName} (${updatedProfile.barangay}, ${updatedProfile.cityMunicipality}, ${updatedProfile.province}). BIR TIN: ${updatedProfile.tinNumber || 'Unspecified'}, SSS: ${updatedProfile.sssNumber || 'Unspecified'}.`
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
