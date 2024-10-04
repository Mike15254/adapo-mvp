<script lang="ts">
    export let projects: any[];
    
    function calculateProgress(raised: number, goal: number) {
        return Math.min(100, (raised / goal) * 100);
    }
    
    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    }
    </script>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as project}
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
                    <p class="text-gray-600 mb-4">{project.description}</p>
                    <div class="mb-4">
                        <div class="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{calculateProgress(project.raised, project.goal).toFixed(1)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: {calculateProgress(project.raised, project.goal)}%"></div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">Min. Investment</span>
                        <span class="font-semibold">{formatCurrency(project.minInvestment)}</span>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4">
                    <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Invest Now
                    </button>
                </div>
            </div>
        {/each}
    </div>