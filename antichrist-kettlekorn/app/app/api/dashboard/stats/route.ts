
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [totalTrunks, totalNodes, totalAIEntities, totalProtocols] = await Promise.all([
      prisma.trunk.count(),
      prisma.node.count(),
      prisma.aIEntity.count(),
      prisma.protocol.count()
    ]);
    
    // Calculate recent activity (interactions in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await prisma.aIInteraction.count({
      where: {
        timestamp: {
          gte: sevenDaysAgo
        }
      }
    });
    
    return NextResponse.json({
      totalTrunks,
      totalNodes,
      totalAIEntities,
      totalProtocols,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
