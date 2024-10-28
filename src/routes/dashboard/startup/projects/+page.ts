import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, parent }) => {
    try {
        // Get parent data to ensure we have startup ID
        const parentData = await parent();
        const startupId = parentData?.startup?.id;

        if (!startupId) {
            throw error(400, 'Startup ID not found');
        }

        const projectsResponse = await pb.collection('projects').getList<Project>(1, 50, {
            sort: '-created',
            expand: 'investments,startup',
            filter: `startup = "${startupId}"`
        });

        return {
            projects: projectsResponse.items,
            total: projectsResponse.totalItems
        };
    } catch (err) {
        console.error('Error loading projects:', err);
        // Instead of throwing error, return empty data for better UX
        return {
            projects: [],
            total: 0,
            error: err instanceof Error ? err.message : 'Failed to load projects'
        };
    }
};