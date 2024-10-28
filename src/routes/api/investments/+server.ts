import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { Investment } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Partial<Investment>;
    const investment = await pb.collection('investments').create(body);
    return json({ investment });
  } catch (error) {
    console.error('Investment creation error:', error);
    return json({ error: 'Failed to create investment' }, { status: 400 });
  }
};