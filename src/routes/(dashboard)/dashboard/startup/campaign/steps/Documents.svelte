<!-- src/routes/(dashboard)/startup/campaign/steps/Documents.svelte -->
<script lang="ts">
	import { campaignStore } from '$lib/stores/campaign.store';
	import type { CampaignFormData } from '$lib/types/dashboard.type';
	import { tick } from 'svelte';

	let formData: CampaignFormData;

	campaignStore.subscribe((state) => {
		formData = state.formData;
	});

	async function handleFileUpload(event: Event, field: keyof CampaignFormData['documents']) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		try {
			if (field === 'verification_documents') {
				const newFiles = Array.from(input.files);
				await tick();
				campaignStore.updateDocuments({
					verification_documents: [...formData.documents.verification_documents, ...newFiles]
				});
			} else {
				campaignStore.updateDocuments({
					[field]: input.files[0]
				});
			}
		} catch (error) {
			console.error('File upload error:', error);
		}
	}

	function removeDocument(index: number) {
		const updatedDocs = formData.documents.verification_documents.filter((_, i) => i !== index);
		campaignStore.updateDocuments({
			verification_documents: updatedDocs
		});
	}

	function getFileName(file: File): string {
		return file.name;
	}
</script>

<div class="space-y-6">
	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1"> Pitch Deck (PDF) * </label>
		<div class="mt-1">
			<input
				type="file"
				accept=".pdf"
				class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
				on:change={(e) => handleFileUpload(e, 'pitch_deck')}
			/>
			{#if formData.documents.pitch_deck}
				<p class="text-sm text-gray-600 mt-2 flex items-center">
					<span class="mr-2">📎</span>
					{getFileName(formData.documents.pitch_deck)}
				</p>
			{/if}
		</div>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1"> Business Plan (Optional) </label>
		<div class="mt-1">
			<input
				type="file"
				accept=".pdf"
				class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
				on:change={(e) => handleFileUpload(e, 'business_plan')}
			/>
			{#if formData.documents.business_plan}
				<p class="text-sm text-gray-600 mt-2 flex items-center">
					<span class="mr-2">📎</span>
					{getFileName(formData.documents.business_plan)}
				</p>
			{/if}
		</div>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1"> Verification Documents * </label>
		<div class="mt-1">
			<input
				type="file"
				accept=".pdf,.jpg,.jpeg,.png"
				multiple
				class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
				on:change={(e) => handleFileUpload(e, 'verification_documents')}
			/>
			{#if formData.documents.verification_documents.length > 0}
				<div class="mt-2 space-y-2">
					{#each formData.documents.verification_documents as doc, index}
						<div class="flex items-center justify-between bg-gray-50 p-2 rounded">
							<span class="text-sm flex items-center">
								<span class="mr-2">📄</span>
								{getFileName(doc)}
							</span>
							<button
								type="button"
								class="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
								on:click={() => removeDocument(index)}
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<p class="mt-2 text-sm text-gray-500">
			Upload relevant business documents (Registration, Licenses, etc.)
		</p>
	</div>
</div>
