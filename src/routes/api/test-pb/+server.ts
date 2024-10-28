// src/routes/api/test-pb/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async () => {
  try {
    const health = await pb.health.check();
    return json({ status: 'PocketBase connection successful', health });
  } catch (error) {
    console.error('PocketBase connection error:', error);
    return json({ error: 'Failed to connect to PocketBase' }, { status: 500 });
  }
};