import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get('project') || 'default';
    let project = null;
    try {
      project = await prisma.project.findFirst({ where: { slug: projectSlug } });
    } catch {}
    if (!project) return NextResponse.json({ tasks: [] });

    const status = searchParams.get('status');
    const where = { projectId: project.id };
    if (status) where.status = status;

    let tasks = [];
    try {
      tasks = await prisma.task.findMany({ where, orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }], take: 50 });
    } catch {}
    return NextResponse.json({ tasks });
  } catch (e) {
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectSlug = 'default', title, description, priority = 'MEDIUM', status = 'OPEN', assignedTo, dueDate, tags } = body || {};

    let project = null;
    try {
      project = await prisma.project.findFirst({ where: { slug: projectSlug } });
    } catch {}
    if (!project) {
      try {
        project = await prisma.project.create({ data: { slug: projectSlug, name: 'Travel Website' } });
      } catch {}
    }

    let task = null;
    try {
      task = await prisma.task.create({
        data: {
          projectId: project.id,
          title,
          description: description || null,
          status,
          priority,
          assignedTo: assignedTo || null,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags ? JSON.stringify(tags) : null,
        },
      });
    } catch {}

    return NextResponse.json({ task });
  } catch (e) {
    return NextResponse.json({ task: null }, { status: 200 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const data = { ...updates };
    if (data.tags) data.tags = JSON.stringify(data.tags);
    if (data.dueDate) data.dueDate = new Date(data.dueDate);

    let task = null;
    try {
      task = await prisma.task.update({ where: { id }, data });
    } catch {}

    return NextResponse.json({ task });
  } catch (e) {
    return NextResponse.json({ task: null }, { status: 200 });
  }
}
