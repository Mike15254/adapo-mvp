<!-- <script lang="ts">
    import { onMount } from 'svelte';
    import { startupStore } from '$lib/stores/startup.store';
    import type { StartupProfile } from '$lib/types/startup.types';
    
    let profile: StartupProfile | null = null;
    let loading = true;
    let completionSteps: { step: string; completed: boolean; }[] = [];
    
    $: status = profile?.verification_status || 'unverified';

    onMount(async () => {
        try {
            profile = $startupStore.profile;
            calculateCompletionSteps();
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            loading = false;
        }
    });

    function calculateCompletionSteps() {
        if (!profile) return;

        completionSteps = [
            {
                step: 'Basic Information',
                completed: Boolean(profile.company_name && profile.business_registration_number && profile.description)
            },
            {
                step: 'Team Details',
                completed: Boolean(profile.team_members && profile.team_members.length > 0)
            },
            {
                step: 'Business Documents',
                completed: Boolean(profile.verification_documents)
            },
            {
                step: 'Company Profile',
                completed: Boolean(profile.industry && profile.founded_Date)
            },
            {
                step: 'Pitch Materials',
                completed: Boolean(profile.pitch_deck)
            }
        ];
    }

    function getStatusInfo(status: string) {
        switch(status) {
            case 'unverified':
                return {
                    title: 'Start Verification',
                    description: 'Begin your startup verification process',
                    icon: '🔒',
                    color: 'gray',
                    action: 'Complete Profile',
                    actionLink: '/dashboard/startup/onboarding'
                };
            case 'documents_pending':
                return {
                    title: 'Documents Under Review',
                    description: 'Our team is reviewing your submitted documents',
                    icon: '📋',
                    color: 'yellow',
                    progress: 'Estimated review time: 2-3 business days'
                };
            case 'under_review':
                return {
                    title: 'Verification in Progress',
                    description: 'Your startup is being verified by our team',
                    icon: '🔍',
                    color: 'blue',
                    progress: 'Final review in progress'
                };
            case 'changes_requested':
                return {
                    title: 'Updates Needed',
                    description: 'Please review and address the requested changes',
                    icon: '✏️',
                    color: 'orange',
                    action: 'View Requirements',
                    actionLink: '/dashboard/startup/onboarding'
                };
            case 'verified':
                return {
                    title: 'Verification Complete',
                    description: 'Your startup is verified and ready for fundraising',
                    icon: '✅',
                    color: 'green',
                    action: 'Start Campaign',
                    actionLink: '/dashboard/startup/campaign/new'
                };
            case 'rejected':
                return {
                    title: 'Verification Unsuccessful',
                    description: 'Contact our support team for assistance',
                    icon: '❌',
                    color: 'red',
                    action: 'Contact Support',
                    actionLink: '/support'
                };
            default:
                return {
                    title: 'Unknown Status',
                    description: 'Please contact support',
                    icon: '❓',
                    color: 'gray'
                };
        }
    }

    $: statusInfo = getStatusInfo(status);
    $: completionPercentage = completionSteps.filter(step => step.completed).length / completionSteps.length * 100;
</script> -->

<!-- <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    {#if loading}
        <div class="animate-pulse space-y-8">
            <div class="h-32 bg-gray-200 rounded-lg"></div>
            <div class="space-y-4">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
    {:else}
       
        <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                    <span class="text-3xl">{statusInfo.icon}</span>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">{statusInfo.title}</h2>
                        <p class="text-gray-600">{statusInfo.description}</p>
                    </div>
                </div>
                {#if statusInfo.action}
                    <a
                        href={statusInfo.actionLink}
                        class={`inline-flex items-center px-4 py-2 border border-transparent 
                               text-sm font-medium rounded-md text-white 
                               bg-${statusInfo.color}-600 hover:bg-${statusInfo.color}-700`}
                    >
                        {statusInfo.action}
                    </a>
                {/if}
            </div>

            {#if statusInfo.progress}
                <div class="mt-4 text-sm text-gray-600">
                    {statusInfo.progress}
                </div>
            {/if}
        </div>

     
        <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Verification Progress</h3>
            <div class="mb-4">
                <div class="relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                        <div>
                            <span class="text-xs font-semibold inline-block text-blue-600">
                                {completionPercentage.toFixed(0)}% Complete
                            </span>
                        </div>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                        <div
                            style="width: {completionPercentage}%"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                        ></div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                {#each completionSteps as step}
                    <div class="flex items-center space-x-3">
                        <div class={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center
                                   ${step.completed ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                            {#if step.completed}
                                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                            {/if}
                        </div>
                        <span class={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.step}
                        </span>
                    </div>
                {/each}
            </div>
        </div>

        {#if profile}
        
            <div class="bg-white shadow-sm rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Summary</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Company</dt>
                        <dd class="mt-1 text-sm text-gray-900">{profile.company_name}</dd>
                    </div>
                    
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Industry</dt>
                        <dd class="mt-1 text-sm text-gray-900">{profile.industry || 'Not specified'}</dd>
                    </div>
                    
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Team Size</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            {profile.team_members?.length || 0} members
                        </dd>
                    </div>
                    
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Founded</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            {profile.founded_Date ? new Date(profile.founded_Date).toLocaleDateString() : 'Not specified'}
                        </dd>
                    </div>

                    {#if profile.funding_goal}
                        <div class="md:col-span-2">
                            <dt class="text-sm font-medium text-gray-500">Target Funding</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                ${profile.funding_goal.toLocaleString()}
                            </dd>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    {/if}
</div> -->