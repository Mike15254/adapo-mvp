import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageLoad = async ({ parent }) => {
    const { startup } = await parent();
    
    if (!startup) {
        return {
            updates: []
        };
    }

    try {
        const updates = await pb.collection('startup_updates')
            .getList(1, 10, {
                filter: `startup="${startup.id}"`,
                sort: '-created'
            });

        return {
            updates: updates.items
        };
    } catch (error) {
        console.error('Error fetching updates:', error);
        return {
            updates: []
        };
    }
};