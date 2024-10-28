import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import type { StartupUpdate, StartupProfile } from '$lib/types/dashboard.types';

// Define stronger types for the page data
interface PageData {
    updates: StartupUpdate[];
    error?: string;
}

// Define type for parent data
interface ParentData {
    startup: StartupProfile | null;
    user: { id: string; } | null;
}

export const load: PageLoad = async ({ parent }): Promise<PageData> => {
    try {
        // Get parent data with type assertion
        const parentData = await parent() as ParentData;

        // Better null checks with explicit error handling
        if (!parentData || !parentData.startup) {
            console.warn('No startup data available');
            return {
                updates: [],
                error: 'Startup profile not found'
            };
        }

        const { startup } = parentData;

        // Validate startup ID
        if (!startup.id) {
            console.error('Invalid startup ID');
            return {
                updates: [],
                error: 'Invalid startup profile'
            };
        }

        try {
            // Fetch recent updates with better error handling
            const updatesResponse = await pb.collection('startup_updates').getList(1, 5, {
                filter: `startup="${startup.id}"`,
                sort: '-created',
            });

            // Validate response
            if (!updatesResponse?.items) {
                throw new Error('Invalid response format');
            }

            // Transform with type validation
            const updates: StartupUpdate[] = updatesResponse.items.map(record => {
                if (!record.id || !record.startup) {
                    console.warn('Invalid update record:', record);
                }

                return {
                    id: record.id,
                    startup: record.startup,
                    title: record.title?.trim() || 'Untitled Update',
                    content: record.content?.trim() || 'No content provided',
                    update_type: validateUpdateType(record.update_type),
                    attachments: Array.isArray(record.attachments) ? record.attachments : [],
                    created: record.created || new Date().toISOString()
                };
            }).filter(update => update.id && update.startup); // Filter out invalid updates

            return {
                updates
            };

        } catch (fetchError) {
            console.error('Error fetching updates:', fetchError);
            return {
                updates: [],
                error: 'Failed to fetch updates'
            };
        }
    } catch (err) {
        console.error('Error in overview page load:', err);
        return {
            updates: [],
            error: 'An unexpected error occurred'
        };
    }
};

// Helper function to validate update type
function validateUpdateType(type: unknown): StartupUpdate['update_type'] {
    const validTypes = ['milestone', 'financial', 'general', 'team'];
    return validTypes.includes(type as string) ? 
        (type as StartupUpdate['update_type']) : 
        'general';
}