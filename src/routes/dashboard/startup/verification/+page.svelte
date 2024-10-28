<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import {
        Building,
        FileText,
        Users,
        CheckCircle,
        AlertTriangle,
        Upload,
        ArrowRight
    } from 'lucide-svelte';
    import type { PageData } from './$types';
import { pb } from '$lib/pocketbase';


    export let data: PageData;
    
    $: ({ startup } = data);

    const steps = [
        {
            id: 'company',
            title: 'Company Details',
            icon: Building,
            complete: !!startup?.company_name && !!startup?.business_registration_number
        },
        {
            id: 'documents',
            title: 'Documents',
            icon: FileText,
            complete: !!startup?.verification_documents
        },
        {
            id: 'team',
            title: 'Team',
            icon: Users,
            complete: !!startup?.team_members && Array.isArray(startup.team_members) && startup.team_members.length > 0
        },
        {
            id: 'review',
            title: 'Submit',
            icon: CheckCircle,
            complete: startup?.verification_status === 'pending' || startup?.verification_status === 'verified'
        }
    ];

    $: currentStep = (() => {
    const index = steps.findIndex(step => !step.complete);
    return index === -1 ? steps.length - 1 : index;
})();

    let loading = false;
    let error = '';
    let success = '';

    // Company Information Form
    let companyForm = {
        company_name: startup?.company_name || '',
        business_registration_number: startup?.business_registration_number || '',
        description: startup?.description || '',
        industry: startup?.industry || 'technology',
        founded_Date: startup?.founded_Date || '',
        funding_goal: startup?.funding_goal || 0
    };

    // Document Upload
    let documentFile: File | null = null;
    let pitchDeckFile: File | null = null;

    // Team Members Form
    let teamMembers = startup?.team_members || [];
    let newMember = { name: '', role: '', bio: '' };

    async function handleCompanySubmit() {
        loading = true;
        error = '';
        try {
            await pb.collection('startup_profiles').update(startup.id, companyForm);
            success = 'Company information updated successfully';
            currentStep = 1;
        } catch (err) {
            error = 'Failed to update company information';
        } finally {
            loading = false;
        }
    }

    function handleFileChange(event: Event, type: 'document' | 'pitch_deck') {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files) return;
    
    const file = target.files[0];
    if (!file) return;

    if (type === 'document') {
        documentFile = file;
    } else {
        pitchDeckFile = file;
    }
}

    async function handleDocumentUpload() {
        if (!documentFile && !pitchDeckFile) {
            error = 'Please select files to upload';
            return;
        }

        loading = true;
        error = '';
        
        try {
            const formData = new FormData();
            if (documentFile) {
                formData.append('verification_documents', documentFile);
            }
            if (pitchDeckFile) {
                formData.append('pitch_deck', pitchDeckFile);
            }

            await pb.collection('startup_profiles').update(startup.id, formData);
            success = 'Documents uploaded successfully';
            currentStep = 2;
        } catch (err) {
            error = 'Failed to upload documents';
        } finally {
            loading = false;
        }
    }

    async function handleTeamSubmit() {
        if (!teamMembers.length) {
            error = 'Please add at least one team member';
            return;
        }

        loading = true;
        error = '';
        
        try {
            await pb.collection('startup_profiles').update(startup.id, {
                team_members: teamMembers
            });
            success = 'Team information updated successfully';
            currentStep = 3;
        } catch (err) {
            error = 'Failed to update team information';
        } finally {
            loading = false;
        }
    }

    function addTeamMember() {
        if (newMember.name && newMember.role) {
            teamMembers = [...teamMembers, { ...newMember }];
            newMember = { name: '', role: '', bio: '' };
        }
    }

    async function submitVerification() {
        loading = true;
        error = '';
        
        try {
            await pb.collection('startup_profiles').update(startup.id, {
                verification_status: 'pending'
            });
            success = 'Verification request submitted successfully';
        } catch (err) {
            error = 'Failed to submit verification request';
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header -->
    <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900">Startup Verification</h1>
        <p class="mt-2 text-sm text-gray-600">Complete all steps to verify your startup</p>
    </div>

    <!-- Horizontal Stepper -->
    <div class="mb-8">
        <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-between">
                {#each steps as step, index}
                    <div class="flex items-center" class:text-indigo-600={currentStep >= index}>
                        <span class="relative flex h-12 w-12 items-center justify-center rounded-full 
                            {step.complete ? 'bg-indigo-600' : 
                            currentStep === index ? 'bg-white border-2 border-indigo-600' : 
                            'bg-white border-2 border-gray-300'}
                            {index === steps.length - 1 ? '' : 'mr-8 sm:mr-16'}">
                            <svelte:component
                                this={step.icon}
                                class="h-6 w-6 
                                {step.complete ? 'text-white' : 
                                currentStep === index ? 'text-indigo-600' : 
                                'text-gray-500'}"
                            />
                            {#if step.complete}
                                <span class="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                                    <CheckCircle class="h-3 w-3 text-white" />
                                </span>
                            {/if}
                        </span>
                        <span class="absolute -bottom-6 w-max text-sm font-medium
                            {step.complete ? 'text-indigo-600' : 
                            currentStep === index ? 'text-gray-900' : 
                            'text-gray-500'}">
                            {step.title}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Error/Success Messages -->
    {#if error}
        <div class="rounded-md bg-red-50 p-4 mb-6" transition:fade>
            <div class="flex">
                <AlertTriangle class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                    <p class="text-sm font-medium text-red-800">{error}</p>
                </div>
            </div>
        </div>
    {/if}

    {#if success}
        <div class="rounded-md bg-green-50 p-4 mb-6" transition:fade>
            <div class="flex">
                <CheckCircle class="h-5 w-5 text-green-400" />
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">{success}</p>
                </div>
            </div>
        </div>
    {/if}

    <!-- Step Content -->
    <div class="bg-white shadow rounded-lg p-6 mt-8">
        {#if currentStep === 0}
            <!-- Company Details Form -->
            <form class="space-y-6" on:submit|preventDefault={handleCompanySubmit}>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label for="company_name" class="block text-sm font-medium text-gray-700">Company Name*</label>
                        <input
                            type="text"
                            id="company_name"
                            bind:value={companyForm.company_name}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label for="business_registration_number" class="block text-sm font-medium text-gray-700">
                            Business Registration Number*
                        </label>
                        <input
                            type="text"
                            id="business_registration_number"
                            bind:value={companyForm.business_registration_number}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div class="sm:col-span-2">
                        <label for="description" class="block text-sm font-medium text-gray-700">
                            Company Description*
                        </label>
                        <textarea
                            id="description"
                            bind:value={companyForm.description}
                            rows="4"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label for="industry" class="block text-sm font-medium text-gray-700">Industry*</label>
                        <select
                            id="industry"
                            bind:value={companyForm.industry}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label for="founded_date" class="block text-sm font-medium text-gray-700">Founded Date*</label>
                        <input
                            type="date"
                            id="founded_date"
                            bind:value={companyForm.founded_Date}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label for="funding_goal" class="block text-sm font-medium text-gray-700">Funding Goal (KES)*</label>
                        <input
                            type="number"
                            id="funding_goal"
                            bind:value={companyForm.funding_goal}
                            required
                            min="0"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Saving...
                        {:else}
                            <span>Continue</span>
                            <ArrowRight class="ml-2 h-4 w-4" />
                        {/if}
                    </button>
                </div>
            </form>

        {:else if currentStep === 1}
            <!-- Document Upload -->
            <div class="space-y-6">
                <div>
                    <label for="member-bio" class="block text-sm font-medium text-gray-700">Verification Documents*</label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                            <Upload class="mx-auto h-12 w-12 text-gray-400" />
                            <div class="flex text-sm text-gray-600">
                                <label for="verification_documents" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input
                                        id="verification_documents"
                                        type="file"
                                        class="sr-only"
                                        on:change={e => documentFile = e.target.files[0]}
                                    />
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="text-xs text-gray-500">PDF up to 5MB</p>
                        </div>
                    </div>
                    {#if documentFile}
                        <p class="mt-2 text-sm text-gray-500">
                            Selected: {documentFile.name}
                            <button
                                type="button"
                                class="ml-2 text-red-600 hover:text-red-800"
                                on:click={() => documentFile = null}
                            >
                                Remove
                            </button>
                        </p>
                    {/if}
                </div>

                <div>
                    <label for="pitch-deck" class="block text-sm font-medium text-gray-700">Pitch Deck*</label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                            <Upload class="mx-auto h-12 w-12 text-gray-400" />
                            <div class="flex text-sm text-gray-600">
                                <label for="pitch_deck" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload pitch deck</span>
                                    <input
                                        id="pitch_deck"
                                        type="file"
                                        class="sr-only"
                                        accept=".pdf,.ppt,.pptx"
                                        on:change={e => pitchDeckFile = e.target.files[0]}
                                    />
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p class="text-xs text-gray-500">PDF or PowerPoint up to 5MB</p>
                        </div>
                    </div>
                    {#if pitchDeckFile}
                        <p class="mt-2 text-sm text-gray-500">
                            Selected: {pitchDeckFile.name}
                            <button
                                type="button"
                                class="ml-2 text-red-600 hover:text-red-800"
                                on:click={() => pitchDeckFile = null}
                            >
                                Remove
                            </button>
                        </p>
                    {/if}
                </div>

                <div class="flex justify-end">
                    <button
                        type="button"
                        on:click={handleDocumentUpload}
                        disabled={loading || (!documentFile && !pitchDeckFile)}
                        class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Uploading...
                        {:else}
                            <span>Continue</span>
                            <ArrowRight class="ml-2 h-4 w-4" />
                        {/if}
                    </button>
                </div>
            </div>

        {:else if currentStep === 2}
            <!-- Team Members Form -->
            <div class="space-y-6">
                <div class="space-y-4">
                    {#each teamMembers as member, index}
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="text-sm font-medium text-gray-900">{member.name}</h4>
                                    <p class="text-sm text-gray-500">{member.role}</p>
                                    {#if member.bio}
                                        <p class="mt-1 text-sm text-gray-500">{member.bio}</p>
                                    {/if}
                                </div>
                                <button
                                    type="button"
                                    class="text-red-600 hover:text-red-800"
                                    on:click={() => teamMembers = teamMembers.filter((_, i) => i !== index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900 mb-4">Add Team Member</h4>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label for="team-member-name"  class="block text-sm font-medium text-gray-700">Name*</label>
                            <input
                                type="text"
                                bind:value={newMember.name}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label for="team-member-role" class="block text-sm font-medium text-gray-700">Role*</label>
                            <input
                                type="text"
                                bind:value={newMember.role}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label for="team-member-bio" class="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                bind:value={newMember.bio}
                                rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button
                            type="button"
                            on:click={addTeamMember}
                            disabled={!newMember.name || !newMember.role}
                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Add Member
                        </button>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="button"
                        on:click={handleTeamSubmit}
                        disabled={loading || teamMembers.length === 0}
                        class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Saving...
                        {:else}
                            <span>Continue</span>
                            <ArrowRight class="ml-2 h-4 w-4" />
                        {/if}
                    </button>
                </div>
            </div>

        {:else}
            <!-- Final Review -->
            <div class="space-y-6">
                <div class="bg-white px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Review Your Information</h3>
                    <div class="mt-5 border-t border-gray-200">
                        <dl class="divide-y divide-gray-200">
                            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt class="text-sm font-medium text-gray-500">Company Name</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{startup?.company_name}</dd>
                            </div>
                            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt class="text-sm font-medium text-gray-500">Industry</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">{startup?.industry}</dd>
                            </div>
                            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt class="text-sm font-medium text-gray-500">Team Size</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{teamMembers.length} members</dd>
                            </div>
                            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt class="text-sm font-medium text-gray-500">Documents</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Uploaded</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="button"
                        on:click={submitVerification}
                        disabled={loading}
                        class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {#if loading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Submitting...
                        {:else}
                            Submit for Verification
                        {/if}
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Add any custom styles here */
    :global(.animate-spin) {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>