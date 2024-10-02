<!--

@component
This fir showing investement stats.

Usage:
```svelte
<script>
import InvestmentStats from './InvestmentStats.svelte'
</script>

<InvestmentStats />
```

@example           
<InvestmentStats />

-->
<script lang="ts">
    import { onMount } from 'svelte';
    
    let totalInvestments = 0;
    let totalDeals = 0;
    let currentOpportunities = 0;
    
    function animateValue(
        start: number,
        end: number,
        duration: number,
        setter: (value: number) => void
    ) {
        const range = end - start;
        const increment = range / (duration / 4); // 60 FPS
        let current = start;
    
        function step() {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                setter(end);
            } else {
                setter(current);
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    
    onMount(() => {
        animateValue(0, 2.8, 2000, value => totalInvestments = value);
        animateValue(0, 2284, 2000, value => totalDeals = Math.round(value));
        animateValue(0, 32, 2000, value => currentOpportunities = Math.round(value));
    });
    </script>
    
    <section class="py-8 bg-gray-100">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="flex flex-row items-center justify-center">
                    <div class="border bg-white rounded-full mr-4 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-primary">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Total investments</h3>
                        <p class="text-2xl font-bold text-primary">
                            ${totalInvestments.toFixed(1)}B
                        </p>
                    </div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <div class="border bg-white rounded-full mr-4 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-primary">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Total funded deals</h3>
                        <p class="text-2xl font-bold text-primary">
                            {totalDeals}
                        </p>
                    </div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <div class="border bg-white rounded-full mr-4 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-primary">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Current opportunities</h3>
                        <p class="text-2xl font-bold text-primary">
                            {currentOpportunities}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>