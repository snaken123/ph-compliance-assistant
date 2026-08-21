import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const requirements = await prisma.requirementItem.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json({ success: true, requirements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
