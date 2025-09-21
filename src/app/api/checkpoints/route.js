import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectSlug = 'default', summary, snapshot, lastRoute, lastSection, name, branch, commitHash, createdBy } = body || {};

    // Find or create project
    let project = null;
    try {
      project = await prisma.project.findFirst({ where: { slug: projectSlug } });
    } catch {}
    if (!project) {
      try {
        project = await prisma.project.create({ data: { slug: projectSlug, name: 'Travel Website' } });
      } catch {}
    }

    let checkpoint = null;
    try {
      checkpoint = await prisma.checkpoint.create({
        data: {
          projectId: project.id,
          name: name || null,
          branch: branch || null,
          commitHash: commitHash || null,
          summary: summary || null,
          snapshot: snapshot ? JSON.stringify(snapshot) : null,
          createdBy: createdBy || null,
        },
      });
    } catch {}

    // Update user progress if lastRoute provided
    try {
      if (createdBy && lastRoute) {
        await prisma.userProgress.upsert({
          where: { userId_projectId: { userId: createdBy, projectId: project.id } },
          update: {
            lastCheckpointId: checkpoint?.id || null,
            lastRoute,
            lastSection: lastSection || null,
            lastSeenAt: new Date(),
          },
          create: {
            userId: createdBy,
            projectId: project.id,
            lastCheckpointId: checkpoint?.id || null,
            lastRoute,
            lastSection: lastSection || null,
          },
        });
      }
    } catch {}

    return NextResponse.json({ checkpoint, project });
  } catch (e) {
    return NextResponse.json({ checkpoint: null, project: null }, { status: 200 });
  }
}
