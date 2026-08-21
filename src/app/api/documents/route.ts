import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const documents = await prisma.documentArtifact.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const now = new Date();

    const processed = documents.map((doc) => {
      let expirationStatus = doc.status;
      let daysUntilExpiration: number | null = null;

      if (doc.expirationDate) {
        const expDate = new Date(doc.expirationDate);
        const diffTime = expDate.getTime() - now.getTime();
        daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration < 0) {
          expirationStatus = 'EXPIRED';
        } else if (daysUntilExpiration <= 60) {
          expirationStatus = 'EXPIRING_SOON';
        } else {
          expirationStatus = 'VALID';
        }
      }

      return {
        ...doc,
        expirationStatus,
        daysUntilExpiration
      };
    });

    return NextResponse.json({ success: true, documents: processed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newDoc = await prisma.documentArtifact.create({
      data: {
        title: body.title,
        fileType: body.fileType || 'pdf',
        fileSize: body.fileSize || 150000,
        filePath: body.filePath || `/artifacts/${Date.now()}_${body.title.replace(/\s+/g, '_').toLowerCase()}.pdf`,
        issuingAgency: body.issuingAgency,
        referenceNumber: body.referenceNumber,
        issuedDate: body.issuedDate ? new Date(body.issuedDate) : null,
        expirationDate: body.expirationDate ? new Date(body.expirationDate) : null,
        notes: body.notes
      }
    });

    await prisma.auditTrail.create({
      data: {
        action: 'DOCUMENT_UPLOADED',
        entityType: 'DocumentArtifact',
        entityId: newDoc.id,
        description: `Document uploaded: "${newDoc.title}" issued by ${newDoc.issuingAgency}.`
      }
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
