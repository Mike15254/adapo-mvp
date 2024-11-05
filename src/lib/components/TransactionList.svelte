<script lang="ts">
    import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-svelte';
    import type { WalletTransaction } from '$lib/types/dashboard.type';
    
    export let transactions: WalletTransaction[] = [];
    export let limit: number = 5;

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    }
</script>

<div class="bg-white shadow-sm rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 class="text-lg font-medium">Recent Activity</h2>
        <a href="/dashboard/investor/wallet" class="text-sm text-indigo-600 hover:text-indigo-900">
            View all →
        </a>
    </div>
    <div class="border-t border-gray-200">
        <ul role="list" class="divide-y divide-gray-200">
            {#each transactions.slice(0, limit) as transaction}
                <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            {#if transaction.type === 'deposit'}
                                <ArrowUpRight class="h-6 w-6 text-green-500" />
                            {:else if transaction.type === 'withdrawal'}
                                <ArrowDownRight class="h-6 w-6 text-red-500" />
                            {:else}
                                <DollarSign class="h-6 w-6 text-blue-500" />
                            {/if}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900">
                                {transaction.description}
                            </p>
                            <div class="mt-1 flex items-center text-sm text-gray-500">
                                <span>{formatDate(transaction.created)}</span>
                                <span class="mx-2">•</span>
                                <span>{transaction.reference}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end space-y-1">
                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                                  transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {formatCurrency(transaction.amount)}
                            </span>
                            <span class={`text-xs ${
                                transaction.status === 'complete' ? 'text-green-600' :
                                transaction.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                {transaction.status}
                            </span>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>
