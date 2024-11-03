<script lang="ts">
	import { campaignStore } from '$lib/stores/campaign.store';
	import type { IndustryType, CampaignFormData } from '$lib/types/dashboard.type';

	let formData: CampaignFormData;

	campaignStore.subscribe((state) => {
		formData = state.formData;
	});

	const industries: IndustryType[] = [
		'technology',
		'healthcare',
		'finance',
		'education',
		'agriculture',
		'other'
	];

	function handleBasicInfoChange(
		field: keyof Omit<CampaignFormData, 'social_links' | 'team_members' | 'documents'>,
		value: string | number
	) {
		campaignStore.updateBasicInfo({ [field]: value });
	}

	function handleSocialLinksChange(field: keyof CampaignFormData['social_links'], value: string) {
		campaignStore.updateSocialLinks({ [field]: value });
	}
</script>

<div class="space-y-6">
	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1"> Company Name * </label>
		<input
			type="text"
			class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
			value={formData.company_name}
			on:input={(e) => handleBasicInfoChange('company_name', e.currentTarget.value)}
			required
		/>
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1"> Industry * </label>
		<select
			class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
			value={formData.industry}
			on:change={(e) => handleBasicInfoChange('industry', e.currentTarget.value)}
			required
		>
			<option value="">Select an industry</option>
			{#each industries as industry}
				<option value={industry}>
					{industry.charAt(0).toUpperCase() + industry.slice(1)}
				</option>
			{/each}
		</select>
	</div>

	<div>
		<label  for="funding_goal" class="block text-sm font-medium text-gray-700 mb-1"> Funding Goal (USD) * </label>
		<input
			type="number"
			class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
			value={formData.funding_goal}
			min="0"
			step="1000"
			on:input={(e) => handleBasicInfoChange('funding_goal', Number(e.currentTarget.value))}
			required
		/>
		<p class="mt-1 text-sm text-gray-500">Enter your funding goal in USD</p>
	</div>

	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-1"> Description * </label>
		<textarea
			class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
			rows="4"
			value={formData.description}
			on:input={(e) => handleBasicInfoChange('description', e.currentTarget.value)}
			required
		></textarea>
		<p class="mt-1 text-sm text-gray-500">
			Provide a clear description of your startup and its goals
		</p>
	</div>

	<div>
		<label for="url" class="block text-sm font-medium text-gray-700 mb-1"> Social Links </label>
		<div class="space-y-3">
			<div>
				<label for="url" class="text-xs text-gray-500 mb-1">Website URL</label>
				<input
					type="url"
					placeholder="https://example.com"
					class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
					value={formData.social_links.website}
					on:input={(e) => handleSocialLinksChange('website', e.currentTarget.value)}
				/>
			</div>
			<div>
				<label for="url" class="text-xs text-gray-500 mb-1">LinkedIn URL</label>
				<input
					type="url"
					placeholder="https://linkedin.com/company/..."
					class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
					value={formData.social_links.linkedin}
					on:input={(e) => handleSocialLinksChange('linkedin', e.currentTarget.value)}
				/>
			</div>
			<div>
				<label for="url" class="text-xs text-gray-500 mb-1">Twitter URL</label>
				<input
					type="url"
					placeholder="https://twitter.com/..."
					class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
					value={formData.social_links.twitter}
					on:input={(e) => handleSocialLinksChange('twitter', e.currentTarget.value)}
				/>
			</div>
		</div>
		<p class="mt-1 text-sm text-gray-500">Add your company's social media profiles (optional)</p>
	</div>
</div>
