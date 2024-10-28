import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { UpdatesPageData, StartupUpdate } from '$lib/types/startup.types';
import type { RecordModel } from 'pocketbase';

function transformUpdate(record: RecordModel): StartupUpdate {
    return {
        id: record.id,
        startup: record.startup,
        title: record.title || '',
        content: record.content || '',
        update_type: record.update_type || 'general',
        attachments: record.attachments || [],
        created: record.created,
        updated: record.updated
    };
}

export const load = (async ({ parent }): Promise<UpdatesPageData> => {
    try {
        const { startup } = await parent();

        if (!startup) {
            throw error(404, {
                message: 'Startup profile not found'
            });
        }

        try {
            const result = await pb.collection('startup_updates').getList(1, 50, {
                filter: `startup="${startup.id}"`,
                sort: '-created'
            });

            return {
                startup,
                updates: result.items.map(transformUpdate)
            };
        } catch (err) {
            console.error('Error fetching updates:', err);
            return {
                startup,
                updates: []
            };
        }
    } catch (err) {
        console.error('Page load error:', err);
        throw error(500, {
            message: 'Failed to load updates page'
        });
    }
}) satisfies PageLoad;