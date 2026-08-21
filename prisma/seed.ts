import { PrismaClient } from '@prisma/client';
import { hashPassword, generateToken } from '../src/lib/auth';
import { evaluateBusinessCompliance } from '../src/lib/compliance/engine';
import { BusinessProfileData } from '../src/lib/compliance/types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Philippine Sole Proprietorship Assistant database & User authentication...');

  // 1. Seed Initial User: Stephen Rey Salazar
  const defaultEmail = 'stephen.rey@salazar-group.net';
  const initialPassword = 'FlowForce2026!';
  const hashedPassword = hashPassword(initialPassword);
  const activationToken = generateToken();
  const resetToken = generateToken();
  const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await prisma.user.upsert({
    where: { email: defaultEmail },
    update: {
      name: 'Stephen Rey Salazar',
      passwordHash: hashedPassword,
      isActivated: true,
      mustChangePassword: true,
      activationToken,
      resetToken,
      resetTokenExpiry: resetExpiry
    },
    create: {
      email: defaultEmail,
      name: 'Stephen Rey Salazar',
      passwordHash: hashedPassword,
      isActivated: true,
      mustChangePassword: true,
      activationToken,
      resetToken,
      resetTokenExpiry: resetExpiry
    }
  });

  console.log('✅ Seeded User:', user.email);
  console.log('🔑 Initial Password:', initialPassword);
  console.log('🔗 Activation Link:', `https://compliance.salazar-group.net/activate?token=${activationToken}`);
  console.log('🔗 Password Reset Link:', `https://compliance.salazar-group.net/reset-password/confirm?token=${resetToken}`);

  // 2. Create FlowForceRM Initial Profile
  const flowForceProfileData: BusinessProfileData = {
    id: 'flowforce-main',
    businessName: 'FlowForceRM',
    tradeName: 'FlowForceRM',
    businessActivity: 'SaaS / Software Development & Automation',
    isOnline: true,
    isHomeBased: true,
    propertyType: 'owned_residence',
    province: 'Metro Manila',
    cityMunicipality: 'Quezon City',
    barangay: 'Barangay Holy Spirit',
    addressDetail: 'Block 14 Lot 8, Commonwealth Ave, Quezon City',
    hasEmployees: false,
    employeeCount: 0,
    hasContractors: true,
    hasForeignClients: true,
    hasLocalClients: true,
    monthlyGrossReceipts: 10000,
    annualGrossReceipts: 120000,
    taxRegime: 'EIGHT_PERCENT',
    mode: 'REGISTRATION'
  };

  const profile = await prisma.businessProfile.upsert({
    where: { id: 'flowforce-main' },
    update: flowForceProfileData,
    create: flowForceProfileData
  });

  console.log('✅ Business Profile created for:', profile.businessName);

  // 3. Evaluate and seed requirements
  const evalResult = evaluateBusinessCompliance(flowForceProfileData);
  
  await prisma.requirementItem.deleteMany();
  for (const req of evalResult.requirements) {
    await prisma.requirementItem.create({
      data: {
        code: req.code,
        agency: req.agency,
        title: req.title,
        description: req.description,
        whyItApplies: req.whyItApplies,
        whyItMightNotApply: req.whyItMightNotApply,
        consequencesAndPenalties: req.consequencesAndPenalties,
        priority: req.priority,
        applicabilityStatus: req.applicabilityStatus,
        completionState: req.completionState,
        estimatedFee: req.estimatedFee,
        legalBasis: req.legalBasis,
        officialSource: req.officialSource,
        officialSourceUrl: req.officialSourceUrl,
        dateVerified: req.dateVerified,
        frequency: req.frequency,
        notes: req.reasoning,
        referenceNo: req.code === 'DTI_BNR' ? 'DTI-2026-BNR-88391' : null
      }
    });
  }
  console.log(`✅ Seeded ${evalResult.requirements.length} compliance requirement rules.`);

  // 4. Seed Deadlines
  await prisma.complianceDeadline.deleteMany();
  const sampleDeadlines = [
    {
      agency: 'DTI',
      title: 'DTI Business Name Renewal',
      period: 'RENEWAL_5YR',
      dueDate: new Date('2031-08-15'),
      amount: 2030,
      status: 'COMPLETED',
      submittedAt: new Date('2026-08-15'),
      paymentReference: 'DTI-PAY-992014',
      escalationLevel: 'NORMAL',
      notes: 'DEMO DATA — DTI National Scope registered successfully.'
    },
    {
      agency: 'BIR',
      title: 'BIR Form 1701Q (Q3 Income Tax Return - 8% Tax)',
      period: 'QUARTERLY',
      dueDate: new Date('2026-11-15'),
      amount: 0,
      status: 'PENDING',
      escalationLevel: 'NORMAL',
      notes: 'DEMO DATA — Q3 Income Tax Return. ₱0 due under ₱250k TRAIN Act annual exemption.'
    },
    {
      agency: 'BIR',
      title: 'BIR Form 1701A (Annual Income Tax Return - 8% Tax)',
      period: 'ANNUAL',
      dueDate: new Date('2027-04-15'),
      amount: 0,
      status: 'PENDING',
      escalationLevel: 'NORMAL',
      notes: 'DEMO DATA — Annual Income Tax Return due April 15 following the close of taxable year.'
    },
    {
      agency: 'LGU',
      title: 'LGU Mayor’s Permit Annual Renewal',
      period: 'ANNUAL',
      dueDate: new Date('2027-01-20'),
      amount: 2500,
      status: 'PENDING',
      escalationLevel: 'NORMAL',
      notes: 'DEMO DATA — Annual Mayor’s Business Permit Renewal deadline for Quezon City BPLO.'
    }
  ];

  for (const d of sampleDeadlines) {
    await prisma.complianceDeadline.create({ data: d });
  }

  // 5. Seed Document Artifacts
  await prisma.documentArtifact.deleteMany();
  const sampleDocs = [
    {
      title: 'DTI Business Name Registration Certificate (FlowForceRM)',
      fileType: 'pdf',
      fileSize: 245000,
      filePath: '/artifacts/dti_certificate_flowforcerm.pdf',
      issuingAgency: 'Department of Trade and Industry (DTI)',
      referenceNumber: 'BNR-2026-0098124',
      issuedDate: new Date('2026-08-10'),
      expirationDate: new Date('2031-08-10'),
      status: 'VALID',
      notes: 'Official DTI Certificate of Business Name Registration (National Scope).'
    },
    {
      title: 'BIR Certificate of Registration (Form 2303)',
      fileType: 'pdf',
      fileSize: 310000,
      filePath: '/artifacts/bir_2303_flowforcerm.pdf',
      issuingAgency: 'Bureau of Internal Revenue (RDO 039 Quezon City)',
      referenceNumber: 'BIR-2303-99812',
      issuedDate: new Date('2026-08-18'),
      expirationDate: null,
      status: 'VALID',
      notes: 'Registered under 8% Income Tax Rate regime.'
    }
  ];

  for (const doc of sampleDocs) {
    await prisma.documentArtifact.create({ data: doc });
  }

  // 6. Seed Contractor Records
  await prisma.contractorRecord.deleteMany();
  await prisma.contractorRecord.create({
    data: {
      contractorName: 'Alex Rivera (Frontend Developer)',
      serviceProvided: 'React UI component development on project basis',
      agreementType: 'INDEPENDENT_CONTRACTOR',
      monthlyPayment: 15000,
      doleControlScore: 15,
      riskLevel: 'LOW',
      hasTaxWithholding: false,
      hasSignedAgreement: true,
      notes: 'Independent contractor working own hours with own equipment. Low employee misclassification risk.'
    }
  });

  // 7. Seed Government Contact Log
  await prisma.governmentContactLog.deleteMany();
  await prisma.governmentContactLog.create({
    data: {
      agency: 'LGU',
      officeName: 'Quezon City BPLO (Business Permit & Licensing Dept)',
      personContacted: 'Officer Santos',
      contactMethod: 'PHONE',
      dateContacted: new Date('2026-08-12'),
      questionAsked: 'Is a home-based online SaaS sole proprietor required to secure a commercial mayor permit or a home occupation clearance?',
      answerReceived: 'Submitted written inquiry. Quezon City accepts Home Occupation Undertaking for purely digital non-retail operations.',
      referenceNumber: 'QC-BPLO-INQ-2026-881',
      notes: 'Follow up via email if reply is not received within 5 working days.'
    }
  });

  // 8. Seed Audit Trail
  await prisma.auditTrail.deleteMany();
  await prisma.auditTrail.create({
    data: {
      action: 'USER_CREATED_AND_SYSTEM_INITIALIZED',
      entityType: 'User',
      entityId: user.id,
      description: `User ${user.email} created. Activation and password reset tokens generated. Must change password on first login.`
    }
  });
  console.log('✅ Seeded audit trail.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Database & User seeding complete!');
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
