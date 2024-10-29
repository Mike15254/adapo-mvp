import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { StartupUpdate, StartupProfile } from '$lib/types/dashboard.types';

interface PageData {
    updates: StartupUpdate[];
    error?: string;
}

interface ParentData {
    startup: StartupProfile;
    user: { id: string; };
    stats: any; // Add proper type if available
}

const VALID_UPDATE_TYPES = ['milestone', 'financial', 'general', 'team'] as const;
type UpdateType = typeof VALID_UPDATE_TYPES[number];

function isValidUpdateType(type: unknown): type is UpdateType {
    return typeof type === 'string' && VALID_UPDATE_TYPES.includes(type as UpdateType);
}

function transformUpdate(record: any): StartupUpdate {
    return {
        id: record.id,
        startup: record.startup,
        title: record.title?.trim() || 'Untitled Update',
        content: record.content?.trim() || 'No content provided',
        update_type: isValidUpdateType(record.update_type) ? record.update_type : 'general',
        attachments: Array.isArray(record.attachments) ? record.attachments : [],
        created: record.created || new Date().toISOString()
    };
}

export const load = (async ({ parent }) => {
    try {
        // Get parent data with proper type checking
        const parentData = await parent() as ParentData;

        if (!parentData.startup?.id) {
            throw error(404, {
                message: 'Startup profile not found'
            });
        }

        // Fetch recent updates
        const updatesResponse = await pb.collection('startup_updates').getList(1, 5, {
            filter: `startup="${parentData.startup.id}"`,
            sort: '-created',
        });

        // Transform and validate updates
        const updates = updatesResponse.items
            .map(transformUpdate)
            .filter(update => update.id && update.startup);

        return {
            updates,
            startup: parentData.startup
        };

    } catch (err) {
        if (err instanceof Error) {
            throw error(500, {
                message: err.message
            });
        }
        
        throw error(500, {
            message: 'An unexpected error occurred'
        });
    }
}) satisfies PageLoad<PageData>;