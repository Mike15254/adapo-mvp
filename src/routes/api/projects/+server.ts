import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { Project } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Partial<Project>;
    const project = await pb.collection('projects').create(body);
    return json({ project });
  } catch (error) {
    console.error('Project creation error:', error);
    return json({ error: 'Failed to create project' }, { status: 400 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('perPage')) || 20;
    const projects = await pb.collection('projects').getList(page, perPage, {
      sort: '-created',
    });
    return json(projects);
  } catch (error) {
    console.error('Project retrieval error:', error);
    return json({ error: 'Failed to retrieve projects' }, { status: 400 });
  }
};