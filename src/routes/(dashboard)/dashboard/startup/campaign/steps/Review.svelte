<!-- src/routes/(dashboard)/startup/campaign/steps/Review.svelte -->
<script lang="ts">
	import { campaignStore } from '$lib/stores/campaign.store';
	import type { CampaignFormData } from '$lib/types/dashboard.type';

	let formData: CampaignFormData;

	campaignStore.subscribe((state) => {
		formData = state.formData;
	});

	function getFileName(file: File | null | undefined): string {
		return file?.name || 'No file uploaded';
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	$: isComplete =
		!!formData.company_name &&
		!!formData.description &&
		!!formData.industry &&
		formData.funding_goal > 0 &&
		formData.team_members.length > 0 &&
		!!formData.documents.pitch_deck &&
		formData.documents.verification_documents.length > 0;
</script>

<div class="space-y-8">
	<!-- Completion Status -->
	{#if !isComplete}
		<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">Missing Required Information</h3>
					<div class="mt-2 text-sm text-yellow-700">
						<p>Please complete all required fields before submitting:</p>
						<ul class="list-disc list-inside mt-1">
							{#if !formData.company_name}
								<li>Company name is required</li>
							{/if}
							{#if !formData.description}
								<li>Description is required</li>
							{/if}
							{#if !formData.industry}
								<li>Industry selection is required</li>
							{/if}
							{#if formData.funding_goal <= 0}
								<li>Valid funding goal is required</li>
							{/if}
							{#if formData.team_members.length === 0}
								<li>At least one team member is required</li>
							{/if}
							{#if !formData.documents.pitch_deck}
								<li>Pitch deck is required</li>
							{/if}
							{#if formData.documents.verification_documents.length === 0}
								<li>Verification documents are required</li>
							{/if}
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Basic Information -->
	<div>
		<h3 class="text-lg font-medium mb-4">Basic Information</h3>
		<div class="bg-gray-50 p-4 rounded-lg space-y-3">
			<div>
				<span class="font-medium">Company Name:</span>
				<span class="ml-2">{formData.company_name}</span>
			</div>
			<div>
				<span class="font-medium">Industry:</span>
				<span class="ml-2"
					>{formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)}</span
				>
			</div>
			<div>
				<span class="font-medium">Funding Goal:</span>
				<span class="ml-2">{formatCurrency(formData.funding_goal)}</span>
			</div>
			<div>
				<span class="font-medium">Description:</span>
				<p class="mt-1 text-gray-600">{formData.description}</p>
			</div>
		</div>
	</div>

	<!-- Team Members -->
	<div>
		<h3 class="text-lg font-medium mb-4">Team Members ({formData.team_members.length})</h3>
		<div class="space-y-4">
			{#each formData.team_members as member}
				<div class="bg-gray-50 p-4 rounded-lg">
					<h4 class="font-medium">{member.name}</h4>
					<p class="text-gray-600">{member.role}</p>
					<p class="text-sm mt-2">{member.bio}</p>
					{#if member.linkedin}
						<a
							href={member.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							class="text-indigo-600 text-sm mt-2 inline-flex items-center hover:text-indigo-800"
						>
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M15 2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10z"
								/>
								<path
									d="M7.5 6.5h-2v7h2v-7zm-1-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 2h-2v7h2v-3.5c0-1.5 2-2 2-2v-1.5c-.5 0-1.5.5-2 1.5v-1.5z"
								/>
							</svg>
							LinkedIn Profile
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Documents -->
	<div>
		<h3 class="text-lg font-medium mb-4">Documents</h3>
		<div class="bg-gray-50 p-4 rounded-lg space-y-4">
			<div>
				<span class="font-medium">Pitch Deck:</span>
				<span class="ml-2 {formData.documents.pitch_deck ? 'text-green-600' : 'text-red-600'}">
					{formData.documents.pitch_deck
						? getFileName(formData.documents.pitch_deck)
						: 'Not uploaded'}
				</span>
			</div>

			{#if formData.documents.business_plan}
				<div>
					<span class="font-medium">Business Plan:</span>
					<span class="ml-2 text-green-600">{getFileName(formData.documents.business_plan)}</span>
				</div>
			{/if}

			<div>
				<span class="font-medium">Verification Documents:</span>
				{#if formData.documents.verification_documents.length > 0}
					<ul class="mt-2 list-disc list-inside">
						{#each formData.documents.verification_documents as doc}
							<li class="text-green-600">{getFileName(doc)}</li>
						{/each}
					</ul>
				{:else}
					<span class="ml-2 text-red-600">No documents uploaded</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Social Links -->
	<div>
		<h3 class="text-lg font-medium mb-4">Social Links</h3>
		<div class="bg-gray-50 p-4 rounded-lg space-y-3">
			{#if formData.social_links.website}
				<div>
					<span class="font-medium">Website:</span>
					<a
						href={formData.social_links.website}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-2 text-indigo-600 hover:text-indigo-800"
					>
						{formData.social_links.website}
					</a>
				</div>
			{/if}

			{#if formData.social_links.linkedin}
				<div>
					<span class="font-medium">LinkedIn:</span>
					<a
						href={formData.social_links.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-2 text-indigo-600 hover:text-indigo-800"
					>
						{formData.social_links.linkedin}
					</a>
				</div>
			{/if}

			{#if formData.social_links.twitter}
				<div>
					<span class="font-medium">Twitter:</span>
					<a
						href={formData.social_links.twitter}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-2 text-indigo-600 hover:text-indigo-800"
					>
						{formData.social_links.twitter}
					</a>
				</div>
			{/if}
		</div>
	</div>

	<!-- Final Notice -->
	<div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
		<p class="text-indigo-800">
			Please review all information carefully before submitting. Once submitted, your campaign will
			be reviewed by our team. The review process typically takes 2-3 business days.
		</p>
	</div>
</div>
