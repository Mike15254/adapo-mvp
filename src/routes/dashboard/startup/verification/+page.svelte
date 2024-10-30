<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Building, FileText, Users, DollarSign, Check, Upload, ArrowRight } from 'lucide-svelte';
	import type { StartupVerification, VerificationDocument, TeamMember } from '$lib/types/verification.types';
	import { VerificationService } from '$lib/services/verification.service';

	export let data;

	let currentStep = data.currentStep;
	let isLoading = false;
	let error: string | null = null;
	let success: string | null = null;

	// Form data
	let companyDetails = {
		founded_Date: '',
		funding_goal: 0
	};

	let teamMembers: TeamMember[] = [{ name: '', role: '', bio: '' }];
	
	let files = {
		business_registration: null as File | null,
		pitch_deck: null as File | null
	};

	const steps = [
		{
			id: 'company',
			title: 'Company Details',
			icon: Building,
			description: 'Founding date and funding goals'
		},
		{
			id: 'documents',
			title: 'Legal Documents',
			icon: FileText,
			description: 'Upload required documents'
		},
		{
			id: 'team',
			title: 'Team Members',
			icon: Users,
			description: 'Add key team members'
		}
	];

	function addTeamMember() {
		teamMembers = [...teamMembers, { name: '', role: '', bio: '' }];
	}

	function removeTeamMember(index: number) {
		teamMembers = teamMembers.filter((_, i) => i !== index);
	}
    function handleFileChange(event: Event, type: 'business_registration' | 'pitch_deck') {
        const input = event.target as HTMLInputElement;
        if (input?.files && input.files[0]) {
            files[type] = input.files[0];
        }
    }

	async function handleNext() {
		try {
            isLoading = true;
        error = null;

        if (currentStep === 1) {
            const documentsToUpload = [];
            
            if (files.business_registration) {
                documentsToUpload.push({
                    file: files.business_registration,
                    type: 'business_registration'
                });
            }
            
            if (files.pitch_deck) {
                documentsToUpload.push({
                    file: files.pitch_deck,
                    type: 'pitch_deck'
                });
            }

            if (documentsToUpload.length > 0) {
                await VerificationService.uploadDocuments(data.startup.id, documentsToUpload);
            }
			} else if (currentStep === 2) {
				await VerificationService.updateTeamMembers(data.startup.id, teamMembers);
			}

			if (currentStep < steps.length - 1) {
				currentStep++;
			} else if (data.canSubmit) {
				await VerificationService.submitVerification(data.startup.id);
				success = 'Verification submitted successfully!';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Verify Your Startup</h1>
			<p class="mt-2 text-gray-600">Complete verification to start fundraising</p>
		</div>

		<!-- Progress Steps -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				{#each steps as step, index}
					<div class="flex items-center flex-1">
						<div
							class="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200
                            {index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}"
						>
							{#if index < currentStep}
								<Check class="w-5 h-5" />
							{:else}
								<svelte:component this={step.icon} class="w-5 h-5" />
							{/if}
						</div>
						{#if index < steps.length - 1}
							<div
								class="flex-1 h-1 mx-4 transition-colors duration-200
                                {index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}"
							/>
						{/if}
					</div>
				{/each}
			</div>
			<div class="flex justify-between mt-2">
				{#each steps as step}
					<div class="w-24 text-center">
						<div class="text-sm font-medium text-gray-900">{step.title}</div>
						<div class="text-xs text-gray-500 mt-1">{step.description}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Error/Success Messages -->
		{#if error}
			<div
				class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
				transition:fade
			>
				{error}
			</div>
		{/if}

		{#if success}
			<div
				class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md"
				transition:fade
			>
				{success}
			</div>
		{/if}

		<!-- Step Content -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{#if currentStep === 0}
				<!-- <div class="space-y-6">
					<div>
						<label for="founded-date" class="block text-sm font-medium text-gray-700"
							>Founded Date</label
						>
						<input
							type="date"
							id="founded-date"
							bind:value={companyDetails.founded_Date}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label for="funding-goal" class="block text-sm font-medium text-gray-700"
							>Funding Goal (USD)</label
						>
						<div class="mt-1 relative rounded-md shadow-sm">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<DollarSign class="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="number"
								id="funding-goal"
								bind:value={companyDetails.funding_goal}
								class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								placeholder="100000"
							/>
						</div>
					</div>
				</div> -->
			{:else if currentStep === 1}
				<div class="space-y-6">
					<div>
                        <label for="business-registration" class="block text-sm font-medium text-gray-700">Business Registration</label>
                        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
                            <div class="space-y-1 text-center">
                                <Upload class="mx-auto h-12 w-12 text-gray-400" />
                                <div class="flex text-sm text-gray-600">
                                    <label class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            class="sr-only"
                                            accept=".pdf,.doc,.docx,image/*"
                                            on:change={(e) => handleFileChange(e, 'business_registration')}
                                        />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500">PDF or image up to 10MB</p>
                            </div>
                        </div>
                        {#if files.business_registration}
                            <p class="mt-2 text-sm text-gray-600">
                                Selected: {files.business_registration.name}
                            </p>
                        {/if}
                    </div>
                
                
					</div>
                    <div>
                        <label for="pitch-deck" class="block text-sm font-medium text-gray-700">Pitch Deck</label>
                        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
                            <div class="space-y-1 text-center">
                                <Upload class="mx-auto h-12 w-12 text-gray-400" />
                                <div class="flex text-sm text-gray-600">
                                    <label class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            class="sr-only"
                                            accept=".pdf,.ppt,.pptx"
                                            on:change={(e) => handleFileChange(e, 'pitch_deck')}
                                        />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500">PDF or PPT up to 20MB</p>
                            </div>
                        </div>
                        {#if files.pitch_deck}
                            <p class="mt-2 text-sm text-gray-600">
                                Selected: {files.pitch_deck.name}
                            </p>
                        {/if}
                    </div>
                
			{:else if currentStep === 2}
				<div class="space-y-6">
					{#each teamMembers as member, index}
						<div class="p-4 border rounded-md relative">
							{#if teamMembers.length > 1}
								<button
									type="button"
									class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
									on:click={() => removeTeamMember(index)}
								>
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
									<input
										type="text"
										bind:value={member.name}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div>
									<label for="role" class="block text-sm font-medium text-gray-700">Role</label>
									<input
										type="text"
										bind:value={member.role}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div class="col-span-2">
									<label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
									<textarea
										bind:value={member.bio}
										rows="3"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
							</div>
						</div>
					{/each}

					<button
						type="button"
						class="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
						on:click={addTeamMember}
					>
						Add Team Member
					</button>
				</div>
			{/if}

			<!-- Navigation -->
			<div class="mt-8 flex justify-end">
				<button
					type="button"
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={handleNext}
					disabled={isLoading}
				>
					{#if isLoading}
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{/if}
					{currentStep === steps.length - 1 ? 'Submit Verification' : 'Continue'}
					{#if !isLoading}
						<ArrowRight class="ml-2 h-4 w-4" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>