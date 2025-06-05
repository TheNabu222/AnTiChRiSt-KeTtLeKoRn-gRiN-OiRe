
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AI_ENTITIES_DATA } from '@/lib/seed-data';

export async function GET() {
  try {
    // Check if AI entities exist, if not seed them
    const existingEntities = await prisma.aIEntity.count();
    
    if (existingEntities === 0) {
      // Seed the database with AI entity data
      await prisma.aIEntity.createMany({
        data: AI_ENTITIES_DATA
      });
    }
    
    const entities = await prisma.aIEntity.findMany({
      include: {
        _count: {
          select: {
            interactions: true,
            relationships: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(entities);
  } catch (error) {
    console.error('Error fetching AI entities:', error);
    return NextResponse.json({ error: 'Failed to fetch AI entities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const entity = await prisma.aIEntity.create({
      data: body
    });
    
    return NextResponse.json(entity);
  } catch (error) {
    console.error('Error creating AI entity:', error);
    return NextResponse.json({ error: 'Failed to create AI entity' }, { status: 500 });
  }
}
