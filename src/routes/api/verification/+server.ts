import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { VerificationRequest } from '$lib/types/';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Partial<VerificationRequest>;
    const verificationRequest = await pb.collection('verificationRequests').create(body);
    return json({ verificationRequest });
  } catch (error) {
    console.error('Verification request error:', error);
    return json({ error: 'Failed to submit verification request' }, { status: 400 });
  }
};