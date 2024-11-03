<script lang="ts">
    import { campaignStore, currentStep, isSubmitting, formError } from '$lib/stores/campaign.store';
    import { goto } from '$app/navigation';
    
    // Components
    import BasicInfo from '../steps/BasicInfo.svelte';
    import TeamMembers from '../steps/TeamMembers.svelte';
    import Documents from '../steps/Documents.svelte';
    import Review from '../steps/Review.svelte';
	import type { PageData } from '../$types';
    
    export let data:PageData

    let loading = false;
    let error: string | null = null;
    
    const steps = [
        { id: 1, title: 'Basic Information', component: BasicInfo },
        { id: 2, title: 'Team Members', component: TeamMembers },
        { id: 3, title: 'Documents', component: Documents },
        { id: 4, title: 'Review', component: Review }
    ];
    
    $: error = $formError;
    $: currentStepValue = $currentStep;
    $: loading = $isSubmitting;
    
    async function handleSubmit() {
        try {
            if (!campaignStore.isStepValid(4)) {
                error = 'Please complete all required information';
                return;
            }

            await campaignStore.submitCampaign(data.user.id);
            await goto('/dashboard/startup');
        } catch (e: any) {
            error = e.message;
        }
    }
    // console.log(data.user.id)
    function nextStep() {
        if (!campaignStore.isStepValid(currentStepValue)) {
            error = 'Please complete all required fields before proceeding';
            return;
        }
        
        if (currentStepValue < steps.length) {
            error = null;
            campaignStore.setStep(currentStepValue + 1);
        }
    }
    
    function previousStep() {
        if (currentStepValue > 1) {
            error = null;
            campaignStore.setStep(currentStepValue - 1);
        }
    }

    function getStepStatus(stepId: number): 'current' | 'completed' | 'upcoming' {
        if (stepId === currentStepValue) return 'current';
        if (stepId < currentStepValue && campaignStore.isStepValid(stepId)) return 'completed';
        return 'upcoming';
    }
</script>


<div class="max-w-4xl mx-auto py-8">
    <div class="bg-white rounded-lg shadow-lg">
        <!-- Progress Bar -->
        <div class="p-4 border-b">
            <div class="flex justify-between mb-2">
                {#each steps as step}
                    <div class="flex items-center">
                        <div class="relative">
                            <div class={`w-8 h-8 rounded-full flex items-center justify-center
                                ${getStepStatus(step.id) === 'completed' ? 'bg-green-600 text-white' :
                                  getStepStatus(step.id) === 'current' ? 'bg-indigo-600 text-white' :
                                  'bg-gray-200'}`}>
                                {#if getStepStatus(step.id) === 'completed'}
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                {:else}
                                    {step.id}
                                {/if}
                            </div>
                        </div>
                        <span class="ml-2 text-sm font-medium">{step.title}</span>
                    </div>
                {/each}
            </div>
            <div class="w-full bg-gray-200 h-2 rounded-full">
                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                     style="width: {(currentStepValue / steps.length) * 100}%">
                </div>
            </div>
        </div>

        <!-- Error Display -->
        {#if error}
            <div class="p-4 bg-red-50 border-l-4 border-red-400">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Step Content -->
        <div class="p-6">
            <svelte:component this={steps[currentStepValue - 1].component} />
        </div>

        <!-- Navigation -->
        <div class="p-4 border-t flex justify-between">
            <button
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={previousStep}
                disabled={currentStepValue === 1 || loading}>
                Previous
            </button>

            {#if currentStepValue === steps.length}
                <button
                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={handleSubmit}
                    disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Campaign'}
                </button>
            {:else}
                <button
                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={nextStep}
                    disabled={loading}>
                    Next
                </button>
            {/if}
        </div>
    </div>
</div>