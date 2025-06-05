
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PROTOCOLS_DATA } from '@/lib/seed-data';

export async function GET() {
  try {
    // Check if protocols exist, if not seed them
    const existingProtocols = await prisma.protocol.count();
    
    if (existingProtocols === 0) {
      // Seed the database with protocol data
      await prisma.protocol.createMany({
        data: PROTOCOLS_DATA
      });
    }
    
    const protocols = await prisma.protocol.findMany({
      include: {
        _count: {
          select: {
            executions: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(protocols);
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return NextResponse.json({ error: 'Failed to fetch protocols' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const protocol = await prisma.protocol.create({
      data: body
    });
    
    return NextResponse.json(protocol);
  } catch (error) {
    console.error('Error creating protocol:', error);
    return NextResponse.json({ error: 'Failed to create protocol' }, { status: 500 });
  }
}
