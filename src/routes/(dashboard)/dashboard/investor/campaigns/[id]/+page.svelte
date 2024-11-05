<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import type { StartupProfile, WalletTransaction, mapRecordToWalletTransaction } from '$lib/types/dashboard.type';
    import { investmentService } from '$lib/services/investment.service';
    import { wallet } from '$lib/stores/investor.store';
    import { 
        TrendingUp, Users, DollarSign, Clock,
        FileText, Briefcase, AlertTriangle, 
        CheckCircle, XCircle
    } from 'lucide-svelte';


    // Helper function to get file URL
    function getFileUrl(file: { url: string; name: string; } | undefined | null): string {
        if (!file) return '';
        return typeof file === 'string' ? file : file.url;
    }
    
    export let data: { campaign: StartupProfile };
    
    let campaign = data.campaign;
    let investments: WalletTransaction[] = [];
    let loading = false;
    let showInvestModal = false;
    let investmentAmount = 0;
    let investmentError: string | null = null;
    let agreeToTerms = false;
    let confirmUnderstanding = false;
    let activeTab = 'overview';

    // Format functions
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async function loadInvestments() {
        try {
            investments = await investmentService.getCampaignInvestments(campaign.id);
        } catch (error) {
            console.error('Error loading investments:', error);
        }
    }

    $: fundingProgress = (campaign.funds_raised / campaign.funding_goal) * 100;
    
    onMount(loadInvestments);


	function handleInvestment() {
	try {
		loading = true;
		investmentService.createInvestment({
			campaignId: campaign.id,
			amount: investmentAmount,
			termsAccepted: agreeToTerms,
			risksAcknowledged: confirmUnderstanding
		});
		showInvestModal = false;
	} catch (error) {
		investmentError = error.message;
	} finally {
		loading = false;	
	}
}
</script>

<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Campaign Header -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden" transition:fade>
        <div class="p-6">
            <div class="flex items-start space-x-6">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    {#if campaign.logo}
                        <img 
                            src={campaign.logo} 
                            alt={campaign.company_name}
                            class="h-24 w-24 rounded-lg object-cover bg-gray-100"
                        />
                    {:else}
                        <div class="h-24 w-24 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Briefcase class="h-12 w-12 text-indigo-600" />
                        </div>
                    {/if}
                </div>

                <!-- Campaign Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {campaign.company_name}
                            </h1>
                            <p class="mt-1 text-sm text-gray-500">
                                {campaign.industry} • Founded {formatDate(campaign.founded_Date || '')}
                            </p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <span class={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${campaign.verification_status === 'verified' 
                                    ? 'bg-green-100 text-green-800'
                                    : campaign.verification_status === 'under_review'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'}`}>
                                {campaign.verification_status.replace('_', ' ')}
                            </span>
                            {#if campaign.social_links?.website}
                                <a 
                                    href={campaign.social_links.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-gray-400 hover:text-gray-500"
                                >
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <!-- Website icon -->
                                    </svg>
                                </a>
                            {/if}
                        </div>
                    </div>

                    <!-- Investment Progress -->
                    <div class="mt-6">
                        <div class="flex items-center justify-between text-base">
                            <span class="font-medium text-gray-900">
                                {formatCurrency(campaign.funds_raised)} raised
                            </span>
                            <span class="text-gray-500">
                                of {formatCurrency(campaign.funding_goal)} goal
                            </span>
                        </div>
                        <div class="mt-2 relative">
                            <div class="h-2 bg-gray-200 rounded-full">
                                <div 
                                    class="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                                    style={`width: ${Math.min(fundingProgress, 100)}%`}
                                />
                            </div>
                        </div>
                        <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
                            <span>{campaign.investor_count} investor{campaign.investor_count !== 1 ? 's' : ''}</span>
                            <span>{Math.round(fundingProgress)}% funded</span>
                        </div>
                    </div>

                    <!-- Key Metrics -->
                    <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="flex items-center">
                                <DollarSign class="h-5 w-5 text-indigo-500" />
                                <p class="ml-2 text-sm font-medium text-gray-900">
                                    {formatCurrency(campaign.min_investment)} min investment
                                </p>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="flex items-center">
                                <Users class="h-5 w-5 text-indigo-500" />
                                <p class="ml-2 text-sm font-medium text-gray-900">
                                    {campaign.team_members?.length || 0} team members
                                </p>
                            </div>
                        </div>
                        <!-- Add more metrics as needed -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-t border-gray-200">
            <nav class="flex -mb-px">
                {#each ['Overview', 'Team', 'Documents', 'Updates', 'Investments'] as tab}
                    <button 
                        class={`px-6 py-3 border-b-2 text-sm font-medium
                            ${activeTab === tab.toLowerCase()
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        on:click={() => activeTab = tab.toLowerCase()}
                    >
                        {tab}
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
        {#if activeTab === 'overview'}
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="prose max-w-none">
                    {campaign.description}
                </div>
            </div>
        {:else if activeTab === 'team'}
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {#each campaign.team_members as member}
                        <div class="border rounded-lg p-4">
                            <h3 class="font-medium text-gray-900">{member.name}</h3>
                            <p class="text-sm text-gray-500">{member.role}</p>
                            <p class="mt-2 text-sm text-gray-600">{member.bio}</p>
                            {#if member.linkedin}
                                
                                <a    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    LinkedIn Profile
                                    <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {:else if activeTab === 'documents'}
		<div class="bg-white rounded-xl shadow-sm p-6">
			<div class="space-y-4">
				{#if campaign.pitch_deck}
					<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div class="flex items-center">
							<FileText class="h-5 w-5 text-indigo-500" />
							<span class="ml-2 text-sm font-medium text-gray-900">Pitch Deck</span>
						</div>
						
							<a href={getFileUrl(campaign.pitch_deck)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							View
						</a>
					</div>
				{/if}
				
				{#if campaign.verification_documents && campaign.verification_documents.length > 0}
					{#each campaign.verification_documents as doc}
						<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div class="flex items-center">
								<FileText class="h-5 w-5 text-indigo-500" />
								<span class="ml-2 text-sm font-medium text-gray-900">
									{doc.name || 'Business Document'}
								</span>
							</div>
							
							<a	href={getFileUrl(doc)}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								View
							</a>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
    </div>

    <!-- Investment Button -->
    <div class="fixed bottom-6 right-6">
        <button
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click={() => showInvestModal = true}
            disabled={campaign.verification_status !== 'verified'}
        >
            Invest Now
        </button>
    </div>
</div>
{#if showInvestModal}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 z-40" transition:fade />
    <div class="fixed inset-0 z-50 overflow-y-auto" transition:fade>
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <!-- Close button -->
                <button 
                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                    on:click={() => showInvestModal = false}
                >
                    <XCircle class="h-6 w-6" />
                </button>

                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-lg font-semibold leading-6 text-gray-900">
                            Invest in {campaign.company_name}
                        </h3>

                        <!-- Wallet Balance -->
                        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Available Balance</span>
                                <span class="text-lg font-medium text-gray-900">
                                    {formatCurrency($wallet?.balance || 0)}
                                </span>
                            </div>
                        </div>

                        <!-- Investment Amount -->
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">
                                Investment Amount
                            </label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span class="text-gray-500 sm:text-sm">KES</span>
                                </div>
                                <input
                                    type="number"
                                    bind:value={investmentAmount}
                                    min={campaign.min_investment}
                                    step="100"
                                    class="pl-12 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="0"
                                />
                            </div>
                            {#if investmentError}
                                <p class="mt-2 text-sm text-red-600">{investmentError}</p>
                            {/if}
                        </div>

                        <!-- Investment Details -->
                        <div class="mt-4 bg-gray-50 rounded-lg p-4">
                            <h4 class="text-sm font-medium text-gray-900">Investment Details</h4>
                            <dl class="mt-2 space-y-2">
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-500">Minimum Investment</dt>
                                    <dd class="text-sm font-medium text-gray-900">
                                        {formatCurrency(campaign.min_investment)}
                                    </dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-500">Current Progress</dt>
                                    <dd class="text-sm font-medium text-gray-900">
                                        {Math.round(fundingProgress)}%
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Terms and Acknowledgments -->
                        <div class="mt-4 space-y-3">
                            <label class="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    bind:checked={agreeToTerms}
                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span class="text-sm text-gray-600">
                                    I agree to the investment terms and conditions
                                </span>
                            </label>

                            <label class="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    bind:checked={confirmUnderstanding}
                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span class="text-sm text-gray-600">
                                    I understand the risks associated with this investment
                                </span>
                            </label>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                on:click={() => showInvestModal = false}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!agreeToTerms || !confirmUnderstanding || !investmentAmount || loading}
                                on:click={handleInvestment}
                            >
                                {#if loading}
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Processing...
                                {:else}
                                    Confirm Investment
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}