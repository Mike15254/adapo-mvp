<script lang="ts">
    import { onMount } from 'svelte';

    const benefits = [
        { title: "Access to Capital", description: "Connect with a diverse pool of investors ready to fund your vision", icon: "💼" },
        { title: "Expert Guidance", description: "Receive support from our team of experienced business advisors", icon: "🧠" },
        { title: "Increased Visibility", description: "Showcase your business to a wide audience of potential investors", icon: "👁️" }
    ];

    const steps = [
        { title: "Apply", description: "Submit your business details and funding requirements" },
        { title: "Get Approved", description: "Our team reviews your application and provides feedback" },
        { title: "Create Campaign", description: "Develop your pitch and set your funding target" },
        { title: "Connect with Investors", description: "Engage with interested investors and secure funding" }
    ];

    onMount(() => {
        // Any necessary onMount logic
    });
</script>

<main class="bg-gray-100 min-h-screen">
    <section class="py-16 md:py-24 px-4">
        <div class="container mx-auto max-w-7xl">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-5xl font-bold text-primary mb-6">Raise Capital for Your Business</h1>
                <p class="text-lg text-gray-700 mb-8">Connect with investors and secure the funding you need to grow your Kenyan business.</p>
            </div>

            <!-- About Adapo -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-16">
                <h2 class="text-3xl font-bold text-primary mb-6">About Adapo</h2>
                <p class="text-gray-600 mb-4">
                    Adapo is a leading investment platform connecting innovative Kenyan businesses with local and international investors. Our mission is to fuel economic growth by providing access to capital for promising startups and SMEs across various sectors.
                </p>
                <p class="text-gray-600 mb-4">
                    Founded in 2021, Adapo has helped over 100 businesses raise more than KES 500 million in funding. Our team of experienced professionals is dedicated to supporting entrepreneurs throughout their fundraising journey, from application to successful funding.
                </p>
                <p class="text-gray-600">
                    With a rigorous vetting process and a commitment to transparency, Adapo ensures that both businesses and investors can engage in mutually beneficial partnerships with confidence.
                </p>
            </div>

            <!-- Benefits of Raising with Adapo -->
            <h2 class="text-3xl font-bold text-primary mb-6">Why Raise with Adapo?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {#each benefits as benefit}
                    <div class="bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-md">
                        <div class="text-4xl mb-4">{benefit.icon}</div>
                        <h3 class="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p class="text-gray-600">{benefit.description}</p>
                    </div>
                {/each}
            </div>

            <!-- How It Works -->
            <h2 class="text-3xl font-bold text-primary mb-6">How It Works</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {#each steps as step, index}
                    <div class="text-center">
                        <div class="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{index + 1}</div>
                        <h3 class="font-semibold mb-2">{step.title}</h3>
                        <p class="text-gray-600">{step.description}</p>
                    </div>
                {/each}
            </div>

            <!-- Eligibility -->
            <div class="bg-white rounded-lg shadow-md p-8 mb-16">
                <h2 class="text-3xl font-bold text-primary mb-6">Eligibility Criteria</h2>
                <ul class="list-disc list-inside text-gray-600">
                    <li>Registered business in Kenya</li>
                    <li>Minimum 6 months of operation</li>
                    <li>Clear business model and growth strategy</li>
                    <li>Scalable product or service</li>
                    <li>Strong founding team</li>
                    <li>Seeking funding between KES 1 million to KES 50 million</li>
                </ul>
            </div>

            <!-- CTA -->
            <div class="bg-primary text-white p-8 rounded-lg text-center">
                <h2 class="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
                <p class="mb-6">Apply now to start your fundraising journey with Adapo.</p>
                <a href="/apply" class="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">Apply to Raise</a>
            </div>
        </div>
    </section>
</main>

<style>
    /* Add any component-specific styles here */
</style>