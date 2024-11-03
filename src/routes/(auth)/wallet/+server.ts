import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export async function GET(event: RequestEvent) {
    try {
        if (!event.locals.user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wallet = await pb.collection('wallets').getFirstListItem(`user="${event.locals.user.id}"`);
        const transactions = await pb.collection('wallet_transactions').getList(1, 20, {
            filter: `user="${event.locals.user.id}"`,
            sort: '-created'
        });

        return json({ wallet, transactions: transactions.items });
    } catch (error: any) {
        return json({ error: error.message }, { status: 500 });
    }
}