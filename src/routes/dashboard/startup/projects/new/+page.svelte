<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import {
		ArrowLeft,
		ArrowRight,
		Upload,
		Plus,
		X,
		Calendar,
		DollarSign,
		Users
	} from 'lucide-svelte';
	import { pb } from '$lib/pocketbase';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	let currentStep = 1;
	const totalSteps = 4;

	// Match your database schema
	let projectData = {
		title: '',
		description: '',
		industry: '',
		funding_goal: 0,
		min_investment: 0, // Fixed typo in field name
		start_date: '',
		end_date: '',
		campaign_duration: 30,
		pitch_deck: null as File | null,
		team_members: [] as Array<{
			name: string;
			role: string;
			bio: string;
		}>,
		project_timeline: [] as Array<{
			title: string;
			date: string;
			description: string;
		}>,
		project_images: null as FileList | null,
		project_video: null as File | null,
		status: 'draft',
		approval_status: 'pending',
		startup: data?.startup?.id || '', // Get startup ID from data
		raised: 0,
		current_funding: 0
	};

	// Industry options based on your schema
	const industryOptions = [
		{ value: 'technology', label: 'Technology' },
		{ value: 'healthcare', label: 'Healthcare' },
		{ value: 'finance', label: 'Finance' },
		{ value: 'education', label: 'Education' },
		{ value: 'agriculture', label: 'Agriculture' },
		{ value: 'other', label: 'Other' }
	];

	let errors: Record<string, string> = {};
	let isSubmitting = false;
	let teamMember = { name: '', role: '', bio: '' };
	let timelineEvent = { title: '', date: '', description: '' };

	// Format currency input
	function formatCurrency(value: number) {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			maximumFractionDigits: 0
		}).format(value);
	}

	function removeTeamMember(index: number) {
		projectData.team_members = projectData.team_members.filter((_, i) => i !== index);
	}

	function removeTimelineEvent(index: number) {
		projectData.project_timeline = projectData.project_timeline.filter((_, i) => i !== index);
	}

	// Updated validation functions
	function validateBasicInfo() {
		errors = {};
		if (!projectData.title.trim()) errors.title = 'Title is required';
		if (!projectData.description.trim()) errors.description = 'Description is required';
		if (projectData.description.length < 100) {
			errors.description = 'Description should be at least 100 characters';
		}
		if (!projectData.industry) errors.industry = 'Industry is required';
		return Object.keys(errors).length === 0;
	}

	function validateFunding() {
		errors = {};
		if (!projectData.funding_goal || projectData.funding_goal < 1000) {
			errors.funding_goal = 'Funding goal must be at least 1,000 KES';
		}
		if (!projectData.min_investment || projectData.min_investment < 100) {
			errors.min_investment = 'Minimum investment must be at least 100 KES';
		}
		if (projectData.min_investment > projectData.funding_goal) {
			errors.min_investment = 'Minimum investment cannot be greater than funding goal';
		}
		return Object.keys(errors).length === 0;
	}

	function validateDates() {
		errors = {};
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const start = new Date(projectData.start_date);
		const end = new Date(projectData.end_date);

		if (!projectData.start_date) errors.start_date = 'Start date is required';
		if (!projectData.end_date) errors.end_date = 'End date is required';
		if (start < today) errors.start_date = 'Start date cannot be in the past';
		if (end <= start) errors.end_date = 'End date must be after start date';

		// Calculate campaign duration
		if (start && end) {
			const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
			if (duration < 30) errors.end_date = 'Campaign must be at least 30 days';
			if (duration > 180) errors.end_date = 'Campaign cannot exceed 180 days';
			projectData.campaign_duration = duration;
		}

		return Object.keys(errors).length === 0;
	}

	function handleFileUpload(
		event: Event,
		field: 'project_images' | 'project_video' | 'pitch_deck'
	) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		const maxSize = field === 'project_video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

		if (file.size > maxSize) {
			errors[field] = `File size exceeds maximum limit (${maxSize / 1024 / 1024}MB)`;
			input.value = '';
			return;
		}

		if (field === 'project_images') {
			projectData.project_images = input.files;
		} else {
			projectData[field] = file;
		}
		errors[field] = '';
	}

	// Team and Timeline management
	function addTeamMember() {
		if (!teamMember.name || !teamMember.role) {
			errors.team = 'Name and role are required';
			return;
		}
		projectData.team_members = [...projectData.team_members, { ...teamMember }];
		teamMember = { name: '', role: '', bio: '' };
		errors.team = '';
	}

	function addTimelineEvent() {
		if (!timelineEvent.title || !timelineEvent.date) {
			errors.timeline = 'Event title and date are required';
			return;
		}
		projectData.project_timeline = [...projectData.project_timeline, { ...timelineEvent }].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
		timelineEvent = { title: '', date: '', description: '' };
		errors.timeline = '';
	}

	async function handleSubmit() {
		try {
			isSubmitting = true;
			errors = {};

			// Validate all steps before submission
			if (!validateBasicInfo() || !validateFunding() || !validateDates()) {
				errors.submit = 'Please check all required fields';
				return;
			}

			const formData = new FormData();

			// Add basic fields
			Object.entries(projectData).forEach(([key, value]) => {
				if (value !== null && typeof value !== 'undefined') {
					if (key === 'team_members' || key === 'project_timeline') {
						formData.append(key, JSON.stringify(value));
					} else if (key === 'project_images' && value instanceof FileList) {
						Array.from(value).forEach((file) => {
							formData.append('project_images', file);
						});
					} else if (value instanceof File) {
						formData.append(key, value);
					} else {
						formData.append(key, String(value));
					}
				}
			});

			const record = await pb.collection('projects').create(formData);
			await goto(`/dashboard/startup/projects/${record.id}`);
		} catch (err) {
			console.error('Error creating project:', err);
			errors.submit = err.message || 'Failed to create project. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function nextStep() {
		let isValid = false;

		switch (currentStep) {
			case 1:
				isValid = validateBasicInfo();
				break;
			case 2:
				isValid = validateFunding();
				break;
			case 3:
				isValid = validateDates();
				break;
			default:
				isValid = true;
		}

		if (isValid) {
			currentStep++;
		}
	}

	function prevStep() {
		currentStep--;
	}
</script>

<div class="py-6 px-4 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center">
			<button
				class="mr-4 p-2 rounded-full hover:bg-gray-100"
				on:click={() => goto('/dashboard/startup/projects')}
			>
				<ArrowLeft class="h-5 w-5" />
			</button>
			<h1 class="text-2xl font-semibold text-gray-900">Create New Project</h1>
		</div>
		<p class="mt-2 text-sm text-gray-700">
			Create a new fundraising project to share with potential investors.
		</p>
	</div>

	<!-- Progress bar -->
	<div class="mb-8">
		<div class="flex justify-between items-center mb-2">
			{#each Array(totalSteps) as _, i}
				<div class="flex items-center">
					<div
						class={`w-8 h-8 rounded-full flex items-center justify-center ${
							i + 1 === currentStep
								? 'bg-indigo-600 text-white'
								: i + 1 < currentStep
									? 'bg-green-500 text-white'
									: 'bg-gray-200 text-gray-600'
						}`}
					>
						{i + 1}
					</div>
					{#if i + 1 !== totalSteps}
						<div class={`w-full h-1 ${i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="flex justify-between text-sm text-gray-600">
			<span>Basic Info</span>
			<span>Funding</span>
			<span>Timeline</span>
			<span>Team & Media</span>
		</div>
	</div>

	<!-- Form content -->
	<div class="bg-white shadow rounded-lg p-6">
		{#if currentStep === 1}
			<div class="space-y-6" transition:fade>
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700">
						Project Title <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						bind:value={projectData.title}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Enter your project title"
					/>
					{#if errors.title}
						<p class="mt-1 text-sm text-red-600">{errors.title}</p>
					{/if}
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700">
						Project Description <span class="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						bind:value={projectData.description}
						rows="4"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Describe your project in detail"
					></textarea>
					<p class="mt-1 text-sm text-gray-500">
						Minimum 100 characters. {projectData.description?.length || 0}/100
					</p>
					{#if errors.description}
						<p class="mt-1 text-sm text-red-600">{errors.description}</p>
					{/if}
				</div>

				<div>
					<label for="industry" class="block text-sm font-medium text-gray-700">
						Industry <span class="text-red-500">*</span>
					</label>
					<select
						id="industry"
						bind:value={projectData.industry}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						<option value="">Select an industry</option>
						{#each industryOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>

					{#if errors.industry}
						<p class="mt-1 text-sm text-red-600">{errors.industry}</p>
					{/if}
				</div>
			</div>
		{:else if currentStep === 2}
			<div class="space-y-6" transition:fade>
				<div>
					<label for="funding_goal" class="block text-sm font-medium text-gray-700">
						Funding Goal <span class="text-red-500">*</span>
					</label>
					<div class="mt-1 relative rounded-md shadow-sm">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<DollarSign class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="number"
							id="funding_goal"
							bind:value={projectData.funding_goal}
							class="block w-full pl-10 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="0"
						/>
					</div>
					{#if errors.funding_goal}
						<p class="mt-1 text-sm text-red-600">{errors.funding_goal}</p>
					{/if}
				</div>

				<div>
					<label for="minInvestement" class="block text-sm font-medium text-gray-700">
						Minimum Investment <span class="text-red-500">*</span>
					</label>
					<div class="mt-1 relative rounded-md shadow-sm">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<DollarSign class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="number"
							id="minInvestement"
							bind:value={projectData.min_investment}
							class="block w-full pl-10 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="0"
						/>
					</div>
					{#if errors.min_investment}
						<p class="mt-1 text-sm text-red-600">{errors.min_investment}</p>
					{/if}
				</div>
			</div>
		{:else if currentStep === 3}
			<div class="space-y-6" transition:fade>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label for="start_date" class="block text-sm font-medium text-gray-700">
							Start Date <span class="text-red-500">*</span>
						</label>
						<input
							type="date"
							id="start_date"
							bind:value={projectData.start_date}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							min={new Date().toISOString().split('T')[0]}
						/>
						{#if errors.start_date}
							<p class="mt-1 text-sm text-red-600">{errors.start_date}</p>
						{/if}
					</div>

					<div>
						<label for="end_date" class="block text-sm font-medium text-gray-700">
							End Date <span class="text-red-500">*</span>
						</label>
						<input
							type="date"
							id="end_date"
							bind:value={projectData.end_date}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							min={projectData.start_date}
						/>
						{#if errors.end_date}
							<p class="mt-1 text-sm text-red-600">{errors.end_date}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Timeline Events -->
			<div class="mt-6">
				<h3 class="text-lg font-medium text-gray-900">Project Timeline</h3>
				<div class="mt-4 space-y-4">
					<!-- Add Timeline Event Form -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div>
							<input
								type="text"
								placeholder="Event Title"
								bind:value={timelineEvent.title}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<input
								type="date"
								bind:value={timelineEvent.date}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<button
								type="button"
								on:click={addTimelineEvent}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
							>
								<Plus class="h-4 w-4 mr-2" />
								Add Event
							</button>
						</div>
					</div>

					<!-- Timeline Events List -->
					{#if projectData.project_timeline.length > 0}
						<ul class="mt-4 space-y-4">
							{#each projectData.project_timeline as event, index}
								<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
									<div>
										<h4 class="text-sm font-medium text-gray-900">{event.title}</h4>
										<p class="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
									</div>
									<button
										type="button"
										on:click={() => removeTimelineEvent(index)}
										class="text-red-600 hover:text-red-800"
									>
										<X class="h-5 w-5" />
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500 text-center py-4">No timeline events added yet</p>
					{/if}
				</div>
			</div>
		{:else if currentStep === 4}
			<div class="space-y-6" transition:fade>
				<!-- Team Members -->
				<div>
					<h3 class="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div>
							<input
								type="text"
								placeholder="Name"
								bind:value={teamMember.name}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<input
								type="text"
								placeholder="Role"
								bind:value={teamMember.role}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<button
								type="button"
								on:click={addTeamMember}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
							>
								<Users class="h-4 w-4 mr-2" />
								Add Member
							</button>
						</div>
					</div>

					<!-- Team Members List -->
					{#if projectData.team_members.length > 0}
						<ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each projectData.team_members as member, index}
								<li class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
									<div>
										<h4 class="text-sm font-medium text-gray-900">{member.name}</h4>
										<p class="text-sm text-gray-500">{member.role}</p>
									</div>
									<button
										type="button"
										on:click={() => removeTeamMember(index)}
										class="text-red-600 hover:text-red-800"
									>
										<X class="h-5 w-5" />
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500 text-center py-4">No team members added yet</p>
					{/if}
				</div>

				<!-- Media Upload -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium text-gray-900">Project Media</h3>

					<!-- Project Images -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Project Images</label>
						<div
							class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
						>
							<div class="space-y-1 text-center">
								<Upload class="mx-auto h-12 w-12 text-gray-400" />
								<div class="flex text-sm text-gray-600">
									<label
										for="project-images"
										class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
									>
										<span>Upload images</span>
										<input
											id="project-images"
											type="file"
											class="sr-only"
											accept="image/*"
											multiple
											on:change={(e) => (projectData.project_images = e.target.files)}
										/>
									</label>
								</div>
								<p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
							</div>
						</div>
					</div>

					<!-- Project Video -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Project Video</label>
						<div
							class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
						>
							<div class="space-y-1 text-center">
								<Upload class="mx-auto h-12 w-12 text-gray-400" />
								<div class="flex text-sm text-gray-600">
									<label
										for="project-video"
										class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
									>
										<span>Upload a video</span>
										<input
											id="project-video"
											type="file"
											class="sr-only"
											accept="video/*"
											on:change={(e) => (projectData.project_video = e.target.files[0])}
										/>
									</label>
								</div>
								<p class="text-xs text-gray-500">MP4, WebM up to 50MB</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Navigation Buttons -->
		<div class="mt-8 flex justify-between">
			{#if currentStep > 1}
				<button
					type="button"
					on:click={prevStep}
					class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
				>
					<ArrowLeft class="h-5 w-5 mr-2" />
					Previous
				</button>
			{:else}
				<div></div>
			{/if}

			{#if currentStep < totalSteps}
				<button
					type="button"
					on:click={nextStep}
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
				>
					Next
					<ArrowRight class="h-5 w-5 ml-2" />
				</button>
			{:else}
				<button
					type="button"
					on:click={handleSubmit}
					disabled={isSubmitting}
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
				>
					{isSubmitting ? 'Creating Project...' : 'Create Project'}
					{#if isSubmitting}
						<span class="ml-2 animate-spin">⌛</span>
					{/if}
				</button>
			{/if}
		</div>

		{#if errors.submit}
			<p class="mt-4 text-sm text-red-600 text-center">{errors.submit}</p>
		{/if}
	</div>
</div>
