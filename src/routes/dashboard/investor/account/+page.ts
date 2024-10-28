import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';

interface AccountTransaction {
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    date: string;
    reference: string;
}

export const load: PageLoad = async ({ parent }) => {
    const { profile } = await parent();

    // Load transactions history if needed
    const transactions = await pb.collection('transactions').getList(1, 10, {
        filter: `user="${profile.user}"`,
        sort: '-created'
    });

    return {
        transactions: transactions.items
    };
};