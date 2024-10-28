import { pb } from '$lib/pocketbase';

interface ProjectData {
    title: string;
    description: string;
    funding_goal: number;
    end_date: string;
    project_images?: File[];
}

export async function createProject(startupId: string, data: ProjectData) {
    try {
        // Check if startup already has an active project
        const existingProjects = await pb.collection('projects').getList(1, 1, {
            filter: `startup="${startupId}" && status="active"`
        });

        if (existingProjects.totalItems > 0) {
            throw new Error('You already have an active project');
        }

        const formData = new FormData();
        formData.append('startup', startupId);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('funding_goal', data.funding_goal.toString());
        formData.append('current_funding', '0');
        formData.append('status', 'draft');
        formData.append('end_date', data.end_date);
        formData.append('investor_count', '0');

        if (data.project_images) {
            data.project_images.forEach(image => {
                formData.append('project_images', image);
            });
        }

        const project = await pb.collection('projects').create(formData);
        return project;
    } catch (err) {
        console.error('Project creation error:', err);
        throw err;
    }
}

export async function updateProject(projectId: string, data: Partial<ProjectData>) {
    try {
        const formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'project_images' && value instanceof FileList) {
                    Array.from(value).forEach(file => {
                        formData.append('project_images', file);
                    });
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        const project = await pb.collection('projects').update(projectId, formData);
        return project;
    } catch (err) {
        console.error('Project update error:', err);
        throw err;
    }
}

export async function getProjectStats(projectId: string) {
    try {
        const project = await pb.collection('projects').getOne(projectId, {
            expand: 'startup'
        });

        return {
            current_funding: project.current_funding,
            funding_goal: project.funding_goal,
            progress: (project.current_funding / project.funding_goal) * 100,
            investor_count: project.investor_count,
            days_remaining: Math.max(0, Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        };
    } catch (err) {
        console.error('Error fetching project stats:', err);
        throw err;
    }
}