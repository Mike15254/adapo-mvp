<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { currentUser } from '$lib/stores/userStore';
    import ProjectStats from '$lib/components/ProjectStats.svelte';
    import ProjectForm from '$lib/components/ProjectForm.svelte';
    
    let entrepreneur: any = null;
    let project: any = null;
    
    onMount(async () => {
        if ($currentUser) {
            try {
                // Fetch entrepreneur data
                const record = await pb.collection('entrepreneurs').getFirstListItem(`user="${$currentUser.id}"`);
                entrepreneur = record;
    
                // Fetch project data if it exists
                if (entrepreneur.hasProject) {
                    const projectRecord = await pb.collection('projects').getFirstListItem(`entrepreneur="${entrepreneur.id}"`);
                    project = projectRecord;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    });
    </script>
    
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Welcome, {$currentUser?.name}!</h1>
    
        {#if entrepreneur}
            {#if entrepreneur.hasProject}
                {#if entrepreneur.projectStatus === 'approved'}
                    <h2 class="text-xl font-semibold mb-2">Your Project</h2>
                    {#if project}
                        <ProjectStats {project} />
                    {:else}
                        <p>Loading project data...</p>
                    {/if}
                {:else if entrepreneur.projectStatus === 'pending'}
                    <p class="text-lg">Your project is currently under review. We'll notify you once it's approved.</p>
                {:else if entrepreneur.projectStatus === 'rejected'}
                    <p class="text-lg text-red-600">Your project was not approved. Please review the feedback and submit a new project.</p>
                    <ProjectForm />
                {/if}
            {:else}
                <p class="text-lg mb-4">You haven't submitted a project yet. Get started by filling out the form below!</p>
                <ProjectForm />
            {/if}
        {:else}
            <p>Loading...</p>
        {/if}
    </div>