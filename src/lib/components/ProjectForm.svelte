<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { currentUser } from '$lib/stores/userStore';
    
    let title = '';
    let description = '';
    let industry = '';
    let goal = 0;
    let valuation = 0;
    let minInvestment = 0;
    
    async function handleSubmit() {
        try {
            // Get the entrepreneur record
            const entrepreneur = await pb.collection('entrepreneurs').getFirstListItem(`user="${$currentUser.id}"`);
    
            // Create the project
            await pb.collection('projects').create({
                entrepreneur: entrepreneur.id,
                title,
                description,
                industry,
                goal,
                valuation,
                minInvestment,
                raised: 0,
                status: 'pending'
            });
    
            // Update the entrepreneur record
            await pb.collection('entrepreneurs').update(entrepreneur.id, {
                hasProject: true,
                projectStatus: 'pending'
            });
    
            // Refresh the page to show the new status
            window.location.reload();
        } catch (error) {
            console.error('Error submitting project:', error);
        }
    }
    </script>
    
    <form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Submit Your Project</h3>
        <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
            <input type="text" id="title" bind:value={title} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" bind:value={description} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>
        <div class="mb-4">
            <label for="industry" class="block text-sm font-medium text-gray-700">Industry</label>
            <select id="industry" bind:value={industry} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="">Select an industry</option>
                <option value="tech">Technology</option>
                <option value="health">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div class="mb-4">
            <label for="goal" class="block text-sm font-medium text-gray-700">Funding Goal ($)</label>
            <input type="number" id="goal" bind:value={goal} required min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="mb-4">
            <label for="valuation" class="block text-sm font-medium text-gray-700">Company Valuation ($)</label>
            <input type="number" id="valuation" bind:value={valuation} required min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="mb-4">
            <label for="minInvestment" class="block text-sm font-medium text-gray-700">Minimum Investment ($)</label>
            <input type="number" id="minInvestment" bind:value={minInvestment} required min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit Project</button>
    </form>