import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export async function POST(event: RequestEvent) {
    try {
        if (!event.locals.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await event.request.json();
        const { amount, bank_details } = body;

        const wallet = await pb.collection('wallets').getFirstListItem(`user="${event.locals.user.id}"`);
        
        if (wallet.balance < amount) {
            return json({ error: 'Insufficient funds' }, { status: 400 });
        }

        const transaction = await pb.collection('wallet_transactions').create({
            user: event.locals.user.id,
            type: 'withdrawal',
            amount,
            status: 'pending',
            reference: `WTH-${Date.now()}`,
            description: 'Withdrawal request',
            metadata: { bank_details }
        });

        // TODO: Integrate with payment provider for actual withdrawal
        
        return json({ success: true, transaction });
    } catch (error: any) {
        return json({ error: error.message }, { status: 500 });
    }
}