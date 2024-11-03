<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Shield, Upload, AlertCircle, X } from 'lucide-svelte';
	import { investorStore } from '$lib/stores/investor.store';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	let files: FileList | null = null;
	let loading = false;
	let error: string | null = null;
	let type: 'individual' | 'institution' = data.profile?.type || 'individual';
	let formData = {
		id_number: data.profile?.id_number || '',
		kra_pin: data.profile?.kra_pin || '',
		profession: data.profile?.profession || '',
		investment_focus: data.profile?.investment_focus || 'technology',
		investment_range: data.profile?.investment_range || '0-100k',
		verification_documents: [] as File[]
	};

	let dragOver = false;
	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

	$: verificationStatus = data.profile?.verificationStatus || 'unverified';
	$: isFormValid =
		formData.id_number &&
		formData.kra_pin &&
		formData.verification_documents.length > 0 &&
		!hasInvalidFiles;
	$: hasInvalidFiles = formData.verification_documents.some(
		(file) => file.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type)
	);

	// Initialize form with existing data
	onMount(() => {
		if (data.profile) {
			type = data.profile.type;
			formData = {
				id_number: data.profile.id_number || '',
				kra_pin: data.profile.kra_pin || '',
				profession: data.profile.profession || '',
				investment_focus: data.profile.investment_focus || 'technology',
				investment_range: data.profile.investment_range || '0-100k',
				verification_documents: []
			};
		}
	});

	function validateFile(file: File): string | null {
		if (file.size > MAX_FILE_SIZE) {
			return `${file.name} is too large. Maximum file size is 5MB`;
		}
		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			return `${file.name} is not a supported file type. Please upload PDF or images`;
		}
		return null;
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const newFiles = Array.from(input.files);
			let validationError = null;

			for (const file of newFiles) {
				validationError = validateFile(file);
				if (validationError) {
					error = validationError;
					return;
				}
			}

			error = null;
			formData.verification_documents = [...formData.verification_documents, ...newFiles];
		}
	}

	function removeFile(index: number) {
		formData.verification_documents = formData.verification_documents.filter((_, i) => i !== index);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;

		if (e.dataTransfer?.files) {
			const newFiles = Array.from(e.dataTransfer.files);
			let validationError = null;

			for (const file of newFiles) {
				validationError = validateFile(file);
				if (validationError) {
					error = validationError;
					return;
				}
			}

			error = null;
			formData.verification_documents = [...formData.verification_documents, ...newFiles];
		}
	}

	async function handleSubmit() {
		if (!isFormValid) {
			error = 'Please fill in all required fields and upload valid documents';
			return;
		}

		try {
			loading = true;
			error = null;

			console.log('Submitting verification:', {
				...formData,
				type,
				verificationStatus: 'pending'
			});

			await investorStore.submitVerification({
				...formData,
				type
			});

			window.location.reload();
		} catch (e: any) {
			console.error('Verification submission error:', e);
			error = e.message || 'Failed to submit verification. Please try again.';
		} finally {
			loading = false;
		}
	}

	function getStatusDisplay() {
		console.log('Current verification status:', verificationStatus);
		switch (verificationStatus) {
			case 'verified':
				return {
					icon: Shield,
					title: 'Verification Complete',
					message: 'Your account is verified and you can start investing.',
					color: 'text-green-500'
				};
			case 'pending':
				return {
					icon: AlertCircle,
					title: 'Verification Pending',
					message: 'Your verification is under review. This usually takes 1-2 business days.',
					color: 'text-yellow-500'
				};
			case 'rejected':
				return {
					icon: AlertCircle,
					title: 'Verification Rejected',
					message: 'Your verification was rejected. Please submit updated documents.',
					color: 'text-red-500'
				};
			default:
				return {
					icon: Shield,
					title: 'Verification Required',
					message: 'Please complete verification to start investing.',
					color: 'text-gray-500'
				};
		}
	}

	$: statusDisplay = getStatusDisplay();
</script>

<div class="py-6" transition:fade>
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Status Header -->
		<div class="bg-white shadow-sm rounded-lg mb-6">
			<div class="px-4 py-5 sm:p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svelte:component this={statusDisplay.icon} class="h-8 w-8 {statusDisplay.color}" />
					</div>
					<div class="ml-4">
						<h3 class="text-lg font-medium text-gray-900">
							{statusDisplay.title}
						</h3>
						<p class="mt-1 text-sm text-gray-500">
							{statusDisplay.message}
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if verificationStatus === 'unverified' || verificationStatus === 'rejected'}
			<!-- Verification Form -->
			<div class="bg-white shadow-sm rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-lg font-medium text-gray-900 mb-6">Complete Your Verification</h3>

					{#if error}
						<div class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
							<div class="flex">
								<div class="flex-shrink-0">
									<AlertCircle class="h-5 w-5 text-red-400" />
								</div>
								<div class="ml-3">
									<p class="text-sm text-red-700">{error}</p>
								</div>
							</div>
						</div>
					{/if}

					<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
						<!-- Type Selection -->
						<div>
							<label class="block text-sm font-medium text-gray-700">Investor Type</label>
							<div class="mt-2">
								<div class="flex items-center space-x-4">
									<label class="inline-flex items-center">
										<input
											type="radio"
											class="form-radio"
											name="type"
											value="individual"
											bind:group={type}
										/>
										<span class="ml-2">Individual</span>
									</label>
									<label class="inline-flex items-center">
										<input
											type="radio"
											class="form-radio"
											name="type"
											value="institution"
											bind:group={type}
										/>
										<span class="ml-2">Institution</span>
									</label>
								</div>
							</div>
						</div>

						<!-- Form Fields -->
						<div>
							<label class="block text-sm font-medium text-gray-700">
								{type === 'individual' ? 'National ID Number' : 'Business Registration Number'}
							</label>
							<input
								type="text"
								bind:value={formData.id_number}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">KRA PIN</label>
							<input
								type="text"
								bind:value={formData.kra_pin}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">Investment Focus</label>
							<select
								bind:value={formData.investment_focus}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
							<label class="block text-sm font-medium text-gray-700">Investment Range</label>
							<select
								bind:value={formData.investment_range}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							>
								<option value="0-100k">0 - 100,000 KES</option>
								<option value="100k-500k">100,000 - 500,000 KES</option>
								<option value="500k-1M">500,000 - 1,000,000 KES</option>
								<option value="1M-5M">1,000,000+ KES</option>
							</select>
						</div>

						<!-- Document Upload -->
						<div>
							<label class="block text-sm font-medium text-gray-700">
								Verification Documents
							</label>
							<div
								class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 {dragOver
									? 'border-indigo-500'
									: 'border-gray-300'} border-dashed rounded-md"
								on:dragover={handleDragOver}
								on:dragleave={handleDragLeave}
								on:drop={handleDrop}
							>
								<div class="space-y-1 text-center">
									<Upload class="mx-auto h-12 w-12 text-gray-400" />
									<div class="flex text-sm text-gray-600">
										<label
											class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
										>
											<span>Upload files</span>
											<input
												type="file"
												multiple
												accept=".pdf,.jpg,.jpeg,.png"
												class="sr-only"
												on:change={handleFileChange}
											/>
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PDF or images up to 5MB</p>
								</div>
							</div>

							{#if formData.verification_documents.length > 0}
								<ul class="mt-4 space-y-2">
									{#each formData.verification_documents as doc, i}
										<li
											class="text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded"
										>
											<span class="flex items-center">
												<span class="mr-2">📎</span>
												{doc.name}
											</span>
											<button
												type="button"
												class="text-gray-400 hover:text-red-500"
												on:click={() => removeFile(i)}
											>
												<X class="h-4 w-4" />
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>

						<!-- Submit Button -->
						<div class="mt-6">
							<button
								type="submit"
								class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
								disabled={loading || !isFormValid}
							>
								{#if loading}
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
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
									Submitting...
								{:else}
									Submit Verification
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>
		{:else if verificationStatus === 'pending'}
			<div class="bg-white shadow-sm rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<div class="flex flex-col items-center justify-center text-center">
						<div class="rounded-full bg-yellow-100 p-3">
							<AlertCircle class="h-6 w-6 text-yellow-600" />
						</div>
						<h3 class="mt-4 text-lg font-medium text-gray-900">Verification in Progress</h3>
						<p class="mt-2 text-sm text-gray-500 max-w-md">
							Your documents are being reviewed by our team. This process usually takes 1-2 business
							days. We'll notify you once the verification is complete.
						</p>
						<p class="mt-4 text-sm text-gray-500">
							Submitted on: {new Date(data.profile?.updated || '').toLocaleDateString()}
						</p>
					</div>
				</div>
			</div>
		{:else if verificationStatus === 'verified'}
			<div class="bg-white shadow-sm rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<div class="flex flex-col items-center justify-center text-center">
						<div class="rounded-full bg-green-100 p-3">
							<Shield class="h-6 w-6 text-green-600" />
						</div>
						<h3 class="mt-4 text-lg font-medium text-gray-900">Account Verified</h3>
						<p class="mt-2 text-sm text-gray-500 max-w-md">
							Congratulations! Your account has been verified. You can now start investing in
							available opportunities.
						</p>
						<div class="mt-6 space-y-3">
							<a
								href="/dashboard/investor/wallet"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Fund Your Wallet
							</a>
							<a
								href="/dashboard/investor/campaigns"
								class="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
							>
								View Investment Opportunities →
							</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Verification Details -->
			<div class="mt-6 bg-white shadow-sm rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-lg font-medium text-gray-900 mb-4">Verification Details</h3>
					<dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
						<div>
							<dt class="text-sm font-medium text-gray-500">ID Number</dt>
							<dd class="mt-1 text-sm text-gray-900">{data.profile?.id_number}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Investor Type</dt>
							<dd class="mt-1 text-sm text-gray-900 capitalize">{data.profile?.type}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Investment Focus</dt>
							<dd class="mt-1 text-sm text-gray-900 capitalize">
								{data.profile?.investment_focus}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Investment Range</dt>
							<dd class="mt-1 text-sm text-gray-900">{data.profile?.investment_range}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Verification Date</dt>
							<dd class="mt-1 text-sm text-gray-900">
								{new Date(data.profile?.updated || '').toLocaleDateString()}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		{/if}

		<!-- {#if import.meta.env.DEV}
            <div class="mt-6 bg-gray-100 p-4 rounded">
                <pre class="text-xs overflow-auto">
                    Profile Data: {JSON.stringify(data.profile, null, 2)}
                </pre>
            </div>
        {/if} -->
	</div>
</div>
