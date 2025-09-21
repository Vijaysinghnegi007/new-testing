import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Returns a safe default state if DB models are not present yet
export async function GET() {
  try {
    // Heuristic: choose first project or fallback
    let project = null;
    try {
      project = await prisma.project.findFirst();
    } catch {}

    if (!project) {
      return NextResponse.json({
        project: { slug: 'default', name: 'Travel Website' },
        checkpoint: null,
        pendingTasks: [],
      });
    }

    let checkpoint = null;
    try {
      checkpoint = await prisma.checkpoint.findFirst({
        where: { projectId: project.id },
        orderBy: { createdAt: 'desc' },
      });
    } catch {}

    let pendingTasks = [];
    try {
      pendingTasks = await prisma.task.findMany({
        where: { projectId: project.id, status: { in: ['OPEN', 'IN_PROGRESS', 'BLOCKED'] } },
        orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
        take: 10,
      });
    } catch {}

    return NextResponse.json({ project, checkpoint, pendingTasks });
  } catch (e) {
    return NextResponse.json({ project: null, checkpoint: null, pendingTasks: [] });
  }
}
