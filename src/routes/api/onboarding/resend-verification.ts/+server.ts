import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();
        await pb.collection('users').requestVerification(email);
        
        return json({ success: true });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }), 
            { status: 400 }
        );
    }
};
