<!-- src/routes/(dashboard)/startup/campaign/steps/TeamMembers.svelte -->
<script lang="ts">
	import { campaignStore } from '$lib/stores/campaign.store';
	import type { TeamMember, CampaignFormData } from '$lib/types/dashboard.type';

	let formData: CampaignFormData;

	let newMember: TeamMember = {
		name: '',
		role: '',
		bio: '',
		linkedin: ''
	};

	campaignStore.subscribe((state) => {
		formData = state.formData;
	});

	function validateMember(member: TeamMember): boolean {
		return !!member.name && !!member.role && !!member.bio;
	}

	function addTeamMember() {
		if (validateMember(newMember)) {
			campaignStore.addTeamMember({ ...newMember });

			// Reset form
			newMember = {
				name: '',
				role: '',
				bio: '',
				linkedin: ''
			};
		}
	}

	function removeTeamMember(index: number) {
		campaignStore.removeTeamMember(index);
	}
</script>

<div class="space-y-6">
	<div class="bg-gray-50 p-4 rounded-lg">
		<h3 class="text-lg font-medium mb-4">Add Team Member</h3>
		<div class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"> Name * </label>
					<input
						type="text"
						class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
						bind:value={newMember.name}
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"> Role * </label>
					<input
						type="text"
						class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
						bind:value={newMember.role}
						required
					/>
				</div>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1"> Bio * </label>
				<textarea
					class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
					rows="3"
					bind:value={newMember.bio}
					required
				></textarea>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">
					LinkedIn URL (Optional)
				</label>
				<input
					type="url"
					class="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
					bind:value={newMember.linkedin}
					placeholder="https://linkedin.com/in/..."
				/>
			</div>
			<button
				class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={addTeamMember}
				disabled={!newMember.name || !newMember.role || !newMember.bio}
			>
				Add Team Member
			</button>
		</div>
	</div>

	<!-- Team Members List -->
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Team Members</h3>
		{#if formData.team_members.length === 0}
			<p class="text-gray-500">No team members added yet.</p>
		{:else}
			{#each formData.team_members as member, index}
				<div class="bg-white p-4 border rounded-lg shadow-sm">
					<div class="flex justify-between items-start">
						<div>
							<h4 class="font-medium">{member.name}</h4>
							<p class="text-gray-600">{member.role}</p>
							<p class="text-sm mt-2">{member.bio}</p>
							{#if member.linkedin}
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									class="text-indigo-600 text-sm mt-2 inline-block hover:text-indigo-800"
								>
									LinkedIn Profile
								</a>
							{/if}
						</div>
						<button
							class="text-red-600 hover:text-red-800 p-1 rounded"
							on:click={() => removeTeamMember(index)}
						>
							Remove
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
