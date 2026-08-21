import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const auditLogs = await prisma.auditTrail.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return NextResponse.json({ success: true, auditLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
