<script lang="ts">
    import { onMount } from 'svelte';
    import image1 from '$lib/assets/agriTech.avif';
    import image2 from '$lib/assets/eduTech.avif';
    import image3 from '$lib/assets/finTech.avif';

    interface Opportunity {
        title: string;
        description: string;
        image: string;
        goal: number;
        raised: number;
        sector: string;
        url: string
    }

    const opportunities: Opportunity[] = [
        {
            title: "AgriTech Innovation",
            description: "Revolutionary IoT solution for small-scale farmers",
            image: image1,
            url: "agritech",
            goal: 500000,
            raised: 250000,
            sector: "Agriculture"
        },
        {
            title: "EduTech Platform",
            description: "AI-driven personalized learning for K-12 students",
            image: image2,
            url: "edutech",
            goal: 750000,
            raised: 500000,
            sector: "Education"
        },
        {
            title: "FinTech Solution",
            description: "Next-gen mobile money platform for rural areas",
            image: image3,
            url: "mobilebanking",
            goal: 1000000,
            
            raised: 600000,
            sector: "Finance"
        }
    ];

    const sectors = [
        { name: "Agriculture", icon: "🌾" },
        { name: "Education", icon: "📚" },
        { name: "Finance", icon: "💰" },
        { name: "Healthcare", icon: "🏥" },
        { name: "Technology", icon: "💻" },
        { name: "Energy", icon: "⚡" },
        { name: "Real Estate", icon: "🏘️" },
        { name: "Manufacturing", icon: "🏭" }
    ];

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    }

    onMount(() => {
        // Any necessary onMount logic
    });
</script>

<main class="bg-gray-100 min-h-screen">
    <section class="py-16 md:py-24 px-4">
        <div class="container mx-auto max-w-7xl">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-5xl font-bold text-primary mb-6">Invest in Kenya's Future</h1>
                <p class="text-lg text-gray-700 mb-8">Discover high-potential investment opportunities across various sectors in Kenya.</p>
            </div>

            <!-- Featured Investment Opportunities -->
            <h2 class="text-3xl font-bold text-primary mb-6">Featured Opportunities</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {#each opportunities as opportunity}
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                        <img src={opportunity.image} alt={opportunity.title} class="w-full h-48 object-cover" />
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-2">{opportunity.title}</h3>
                            <p class="text-gray-600 mb-4">{opportunity.description}</p>
                            <div class="mb-4">
                                <div class="flex justify-between text-sm text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round((opportunity.raised / opportunity.goal) * 100)}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-primary h-2.5 rounded-full" style="width: {(opportunity.raised / opportunity.goal) * 100}%"></div>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-primary font-bold">{formatCurrency(opportunity.goal)} Goal</span>
                                <a href="/projects/{opportunity.url.toLowerCase().replace(/\s+/g, '-')}" class="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">Learn More</a>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Investment Sectors -->
            <h2 class="text-3xl font-bold text-primary mb-6">Investment Sectors</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
                {#each sectors as sector}
                    <div class="bg-white p-4 rounded-lg shadow text-center transition-all duration-300 hover:shadow-md hover:bg-gray-50">
                        <div class="text-4xl mb-2">{sector.icon}</div>
                        <h3 class="font-semibold">{sector.name}</h3>
                    </div>
                {/each}
            </div>

            <!-- Why Invest with Adapo -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-16">
                <h2 class="text-3xl font-bold text-primary mb-6">Why Invest with Adapo?</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Curated Opportunities</h3>
                        <p class="text-gray-600">Access carefully vetted investment opportunities across various sectors in Kenya.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Diversification</h3>
                        <p class="text-gray-600">Spread your investment across multiple high-potential startups and SMEs.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Transparent Process</h3>
                        <p class="text-gray-600">Get detailed information and updates on your investments through our platform.</p>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="bg-primary text-white p-8 rounded-lg text-center">
                <h2 class="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
                <p class="mb-6">Join Adapo today to explore exciting investment opportunities in Kenya's growing economy.</p>
                <a href="/auth/signup" class="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">Create an Account</a>
            </div>
        </div>
    </section>
</main>

<style>
    /* Add any component-specific styles here */
</style>