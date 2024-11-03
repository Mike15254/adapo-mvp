<script lang="ts">
    import { campaignStore } from '$lib/stores/campaign.store';
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    export let data: {
        userId: string;
        campaign: any;
        isVerified: boolean;
    };

    let loading = false;
    let showDetails = false;

    function getStatusColor(status: string): string {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    function getStatusText(campaign: any): string {
        if (!campaign) return 'Not Started';
        if (campaign.verified) return 'Verified';
        if (campaign.rejected) return 'Rejected';
        return 'Pending Review';
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        {#if data.campaign}
            <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">
                            {data.campaign.company_name}
                        </h1>
                        <div class="flex items-center space-x-4">
                            <span 
                                class={`px-3 py-1 rounded-full text-sm font-medium ${
                                    getStatusColor(getStatusText(data.campaign).toLowerCase())
                                }`}
                            >
                                {getStatusText(data.campaign)}
                            </span>
                            <span class="text-gray-500">
                                Last updated: {new Date(data.campaign.updated).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        class="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        on:click={() => showDetails = !showDetails}
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>

                {#if showDetails}
                    <div transition:slide>
                        <!-- Campaign Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <h2 class="text-lg font-semibold">Company Information</h2>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <p><strong>Industry:</strong> {data.campaign.industry}</p>
                                    <p><strong>Stage:</strong> {data.campaign.stage}</p>
                                    <p><strong>Location:</strong> {data.campaign.location}</p>
                                </div>
                                
                                {#if data.campaign.expand?.team_members}
                                    <h2 class="text-lg font-semibold">Team Members</h2>
                                    <div class="bg-gray-50 p-4 rounded-lg">
                                        {#each data.campaign.expand.team_members as member}
                                            <div class="mb-2">
                                                <p class="font-medium">{member.name}</p>
                                                <p class="text-sm text-gray-600">{member.role}</p>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <div class="space-y-4">
                                <h2 class="text-lg font-semibold">Campaign Progress</h2>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="space-y-3">
                                        <div class="flex justify-between items-center">
                                            <span>Basic Information</span>
                                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span>Team Members</span>
                                            {#if data.campaign.expand?.team_members?.length}
                                                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                </svg>
                                            {:else}
                                                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                                </svg>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if data.campaign.rejected}
                    <div class="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">Campaign Rejected</h3>
                                <p class="mt-2 text-sm text-red-700">{data.campaign.rejection_reason || 'No reason provided.'}</p>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="p-6 text-center" in:fade>
                <h2 class="text-xl font-semibold mb-4">Start Your Campaign</h2>
                <p class="text-gray-600 mb-6">You haven't created a campaign yet. Get started by providing some basic information about your startup.</p>
                <a
                    href="/dashboard/startup/campaign/new"
                    class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Create Campaign
                </a>
            </div>
        {/if}
    </div>
</div>