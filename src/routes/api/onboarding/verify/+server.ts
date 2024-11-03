import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { token } = await request.json();
        await pb.collection('users').confirmVerification(token);
        
        return json({ success: true });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }), 
            { status: 400 }
        );
    }
};