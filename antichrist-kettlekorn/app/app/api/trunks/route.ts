
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TRUNK_DATA } from '@/lib/seed-data';

export async function GET() {
  try {
    // Check if trunks exist, if not seed them
    const existingTrunks = await prisma.trunk.count();
    
    if (existingTrunks === 0) {
      // Seed the database with trunk data
      await prisma.trunk.createMany({
        data: TRUNK_DATA
      });
    }
    
    const trunks = await prisma.trunk.findMany({
      include: {
        _count: {
          select: {
            nodes: true
          }
        }
      },
      orderBy: {
        trunkId: 'asc'
      }
    });
    
    return NextResponse.json(trunks);
  } catch (error) {
    console.error('Error fetching trunks:', error);
    return NextResponse.json({ error: 'Failed to fetch trunks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trunkId, title, description, zodiacSign, planet, theme, color } = body;
    
    const trunk = await prisma.trunk.create({
      data: {
        trunkId,
        title,
        description,
        zodiacSign,
        planet,
        theme,
        color
      }
    });
    
    return NextResponse.json(trunk);
  } catch (error) {
    console.error('Error creating trunk:', error);
    return NextResponse.json({ error: 'Failed to create trunk' }, { status: 500 });
  }
}
