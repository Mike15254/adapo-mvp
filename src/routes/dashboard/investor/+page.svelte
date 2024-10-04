<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { currentUser } from '$lib/stores/userStore';
    import ProjectList from '$lib/components/ProjectList.svelte';
    import InvestorProfile from '$lib/components/InvestorProfile.svelte';
    import VerificationForm from '$lib/components/VerificationForm.svelte';
    
    let investor: any = null;
    let projects: any[] = [];
    let loading = true;
    let error = '';
    
    onMount(async () => {
        if ($currentUser) {
            try {
                // Fetch investor data
                const record = await pb.collection('investors').getFirstListItem(`user="${$currentUser.id}"`);
                investor = record;
    
                // Fetch available projects
                const projectRecords = await pb.collection('projects').getList(1, 50, {
                    filter: 'status="active"',
                    sort: '-created'
                });
                projects = projectRecords.items;
    
                loading = false;
            } catch (err) {
                console.error('Error fetching data:', err);
                error = 'An error occurred while loading your dashboard. Please try again later.';
                loading = false;
            }
        }
    });
    </script>
    
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Welcome, {$currentUser?.name}!</h1>
    
        {#if loading}
            <p>Loading...</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if investor}
            {#if investor.verificationStatus === 'pending'}
                <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p>Your account is pending verification. We'll notify you once it's approved.</p>
                </div>
            {:else if investor.verificationStatus === 'verified'}
                <InvestorProfile {investor} />
                <h2 class="text-xl font-semibold mt-8 mb-4">Available Projects for Investment</h2>
                <ProjectList {projects} />
            {:else}
                <p class="mb-4">To start investing, please complete the verification process:</p>
                <VerificationForm investorId={investor.id} />
            {/if}
        {:else}
            <p>No investor profile found. Please contact support.</p>
        {/if}
    </div>