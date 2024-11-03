import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export async function POST(event: RequestEvent) {
    try {
        if (!event.locals.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await event.request.json();
        const { amount, payment_method } = body;

        // Create transaction record
        const transaction = await pb.collection('wallet_transactions').create({
            user: event.locals.user.id,
            type: 'deposit',
            amount,
            status: 'pending',
            reference: `DEP-${Date.now()}`,
            payment_method,
            description: `Deposit via ${payment_method}`
        });

        // TODO: Integrate with payment provider
        // For now, we'll simulate a successful deposit
        const wallet = await pb.collection('wallets').getFirstListItem(`user="${event.locals.user.id}"`);
        await pb.collection('wallets').update(wallet.id, {
            balance: wallet.balance + amount
        });

        await pb.collection('wallet_transactions').update(transaction.id, {
            status: 'completed'
        });

        return json({ success: true, transaction });
    } catch (error: any) {
        return json({ error: error.message }, { status: 500 });
    }}