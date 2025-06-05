
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { trunkId: string } }
) {
  try {
    const trunkId = parseInt(params.trunkId);
    
    const trunk = await prisma.trunk.findUnique({
      where: { trunkId },
      include: {
        nodes: {
          include: {
            childNodes: true,
            parentNode: true,
            references: {
              include: {
                referencedNode: true
              }
            },
            referencedBy: {
              include: {
                referencingNode: true
              }
            }
          },
          orderBy: {
            nodeId: 'asc'
          }
        }
      }
    });
    
    if (!trunk) {
      return NextResponse.json({ error: 'Trunk not found' }, { status: 404 });
    }
    
    return NextResponse.json(trunk);
  } catch (error) {
    console.error('Error fetching trunk:', error);
    return NextResponse.json({ error: 'Failed to fetch trunk' }, { status: 500 });
  }
}
