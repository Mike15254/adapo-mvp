import type { PageLoad } from './$types';
import type { Project, ProjectUpdate } from '$lib/types/project';
import { pb } from '$lib/pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
    try {
        // Get parent data
        const parentData = await parent();
        const startupId = parentData?.startup?.id;

        if (!startupId) {
            throw error(400, 'Startup ID not found');
        }

        // Fetch project with expanded relations
        const project = await pb.collection('projects').getOne<Project>(params.id, {
            expand: 'startup,investments,investments.investor'
        });

        // Verify project belongs to current startup
        if (project.startup !== startupId) {
            throw error(403, 'Not authorized to view this project');
        }

        // Fetch project updates
        const updates = await pb.collection('projectUpdates').getList<ProjectUpdate>(1, 10, {
            filter: `project = "${params.id}"`,
            sort: '-created'
        });

        return {
            project,
            updates: updates.items
        };
    } catch (err) {
        console.error('Error loading project:', err);
        throw error(404, {
            message: err instanceof Error ? err.message : 'Project not found'
        });
    }
};