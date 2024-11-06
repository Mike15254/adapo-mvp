<script lang="ts">
  import { onMount } from 'svelte';
  import image1 from '$lib/assets/finTech.avif'
	import Navbar from '$lib/components/Navbar.svelte';

  export let project = {
      id: "mobliebanking",
      title: "Mobile Banking",
      description: "Next-generation financial technology for all",
      image: {image1},
      tags: ["Finance", "Tech"],
      raised: 4500000,
      goal: 5000000,
      valuation: 20000000,
      minInvestment: 10000,
      website: "https://agritech.example.com",
      socialMedia: {
          twitter: "https://twitter.com/agritech",
          facebook: "https://facebook.com/agritech",
          linkedin: "https://linkedin.com/company/agritech"
      },
      highlights: [
          "Revolutionary blockchain projects for financial inclusion",
          "Next-gen mobile money platform for rural areas",
          "Innovative solutions for small and medium enterprises"
      ],
      keyFeatures: [
          "Real-time transactions",
          "Secure and efficient payments",
          "Decentralized finance solutions",
          "Cross-border transactions"
      ],
      about: "Mobile Banking is a revolutionary financial technology platform that empowers small and medium enterprises to access financial services globally. Our innovative solutions are designed to make financial transactions faster, more secure, and more accessible to all."
  };

  function calculateProgress(raised: number, goal: number) {
  const progressPercentage = Math.min(100, Math.round((raised / goal) * 100));
  const isGoalAchieved = progressPercentage >= 100;
  const progressColor = isGoalAchieved ? 'bg-green-500' : 'bg-amber-500';
  const statusColor = isGoalAchieved ? 'text-green-600 bg-green-100' : 'text-amber-600 bg-amber-100';
  const statusText = isGoalAchieved ? 'Funded' : 'In Progress';
  return { progressPercentage, progressColor, statusColor, statusText };
}
  const { progressPercentage, progressColor, statusColor, statusText } = calculateProgress(project.raised, project.goal);

  let daysLeft = 30; // You may want to calculate this based on the campaign end date

  function formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  }

  onMount(() => {
      // You can add any necessary onMount logic here
  });
</script>

<svelte:head>
  <title>{project.title} | ADAPO</title>
</svelte:head>

<div  class="sticky top-0 z-50">
    <Navbar />
</div>

<div class="bg-gray-100 min-h-screen">
  <div class="w-full h-64 bg-cover bg-center" style="background-image: url({image1});">
      <div class="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <h1 class="text-4xl font-bold text-white">{project.title}</h1>
      </div>
  </div>

  <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex flex-wrap -mx-4">
              <div class="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
                  <h2 class="text-2xl font-semibold mb-4">About the Campaign</h2>
                  <p class="text-gray-700 mb-4">{project.about}</p>
                  <div class="mb-6">
                      <h3 class="text-xl font-semibold mb-2">Key Features</h3>
                      <ul class="list-disc list-inside">
                          {#each project.keyFeatures as feature}
                              <li class="text-gray-700">{feature}</li>
                          {/each}
                      </ul>
                  </div>
                  <div>
                      <h3 class="text-xl font-semibold mb-2">Highlights</h3>
                      <ul class="list-disc list-inside">
                          {#each project.highlights as highlight}
                              <li class="text-gray-700">{highlight}</li>
                          {/each}
                      </ul>
                  </div>
              </div>
              <div class="w-full lg:w-1/3 px-4">
                  <div class="bg-gray-100 rounded-lg p-6">
                      <h3 class="text-xl font-semibold mb-4">Campaign Stats</h3>
                      <div class="mb-4">
                          <p class="text-sm text-gray-600">Raised</p>
                          <p class="text-2xl font-bold">{formatCurrency(project.raised)}</p>
                      </div>
                      <div class="mb-4">
                          <div class="flex justify-between items-center mb-1">
                              <span class="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
                              <span class={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusColor}`}>
                                  {statusText}
                              </span>
                          </div>
                          <div class="w-full bg-gray-200 rounded-full h-2.5">
                              <div class={`h-2.5 rounded-full ${progressColor}`} style="width: {progressPercentage}%"></div>
                          </div>
                      </div>
                      <div class="mb-4">
                          <p class="text-sm text-gray-600">Goal</p>
                          <p class="text-xl font-semibold">{formatCurrency(project.goal)}</p>
                      </div>
                      <div class="mb-4">
                          <p class="text-sm text-gray-600">Valuation</p>
                          <p class="text-xl font-semibold">{formatCurrency(project.valuation)}</p>
                      </div>
                      <div class="mb-6">
                          <p class="text-sm text-gray-600">Minimum Investment</p>
                          <p class="text-xl font-semibold">{formatCurrency(project.minInvestment)}</p>
                      </div>
                      <div class="mb-6">
                          <p class="text-sm text-gray-600">Time Left</p>
                          <p class="text-xl font-semibold">{daysLeft} days</p>
                      </div>
                      <a href="/auth/signup" class="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
                          Invest Now
                      </a>
                  </div>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Connect with {project.title}</h2>
        <div class="flex flex-wrap items-center gap-4">
            <a href={project.website} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
            </a>
            {#if project.socialMedia.twitter}
                <a href={project.socialMedia.twitter} target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                </a>
            {/if}
            {#if project.socialMedia.facebook}
                <a href={project.socialMedia.facebook} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    Facebook
                </a>
            {/if}
            {#if project.socialMedia.linkedin}
                <a href={project.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                    LinkedIn
                </a>
            {/if}
        </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Project Tags</h2>
        <div class="flex flex-wrap gap-2">
            {#each project.tags as tag}
                <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
            {/each}
        </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Investment Risks</h2>
        <p class="text-gray-700 mb-4">
            Investing in startups and early-stage businesses involves risks, including illiquidity, lack of dividends, loss of investment and dilution, and it should be done only as part of a diversified portfolio.
        </p>
        <p class="text-gray-700">
            This page is approved as a financial promotion by ADAPO, which is authorized and regulated by the Financial Conduct Authority (FRN 1234567). Investments can fall as well as rise in value. Past performance is not a reliable indicator of future results. Please read our <a href="/" class="text-primary hover:underline">Risk Warning</a> before investing.
        </p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div class="space-y-4">
            <details class="border-b pb-4">
                <summary class="font-medium text-lg cursor-pointer">How does investing work?</summary>
                <p class="mt-2 text-gray-700">When you invest, you're purchasing shares in the company. If the company succeeds, the value of your shares may increase. However, if the company fails, you may lose your investment.</p>
            </details>
            <details class="border-b pb-4">
                <summary class="font-medium text-lg cursor-pointer">What happens after I invest?</summary>
                <p class="mt-2 text-gray-700">After investing, you'll receive updates about the company's progress. If the funding goal is met, you'll become a shareholder. If not, your investment will be returned.</p>
            </details>
            <details class="border-b pb-4">
                <summary class="font-medium text-lg cursor-pointer">Can I sell my shares?</summary>
                <p class="mt-2 text-gray-700">Shares in private companies are generally illiquid. You may be able to sell your shares if the company goes public or is acquired, but this is not guaranteed.</p>
            </details>
        </div>
    </div>
</div>
</div>

<style>
    /* Add any component-specific styles here */
</style>