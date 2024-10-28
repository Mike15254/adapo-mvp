import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { ProjectUpdate } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Partial<ProjectUpdate>;
    const update = await pb.collection('projectUpdates').create(body);
    return json({ update });
  } catch (error) {
    console.error('Project update error:', error);
    return json({ error: 'Failed to create project update' }, { status: 400 });
  }
};