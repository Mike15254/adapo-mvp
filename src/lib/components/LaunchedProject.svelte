<!--
@component
This is a component for displaying a launched project.

Usage:
```svelte
<script>
import LaunchedProject from './LaunchedProject.svelte';
</script>

<LaunchedProject />

```

@example

<LaunchedProject />

-->

<script lang="ts">

    // import images
    import agritechImage from '$lib/assets/agriTech.avif';
    import edutechImage from '$lib/assets/eduTech.avif';
    import moneymoveImage from '$lib/assets/finTech.avif';

    // import data
    
    interface Project {
        id: string;
        title: string;
        description: string;
        image: string;
        tags: string[];
        raised: number;
        goal: number;
        valuation: number;
        minInvestment: number;
    }

    const projects: Project[] = [
        {
    id: "agritech",
    title: "AgriTech",
    description: "IoT-powered precision agriculture solution for small-scale farmers",
    image: agritechImage,
    tags: ["Tech", "agriculture"],
    raised: 2500000,
    goal: 5000000,
    valuation: 20000000,
    minInvestment: 10000,
  },
  {
    id: "edutech",
    title: "Edu Tech Africa",
    description: "AI-driven personalized learning platform for K-12 students",
    image: edutechImage,
    tags: ["Technology", "Education"],
    raised: 5000000,
    goal: 5000000,
    valuation: 20000000,
    minInvestment: 10000,
  },
  {
    id: "moneymove",
    title: "Money Move",
    description: "Next-generation mobile money platform with advanced financial services",
    image: moneymoveImage,
    tags: ["Finance", "Tech"],
    raised: 3500000,
    goal: 5000000,
    valuation: 20000000,
    minInvestment: 10000,
  },
];



function calculateProgress(raised: number, goal: number) {
  const progressPercentage = Math.min(100, Math.round((raised / goal) * 100));
  const isGoalAchieved = progressPercentage >= 100;
  const progressColor = isGoalAchieved ? 'bg-green-500' : 'bg-amber-500';
  const statusColor = isGoalAchieved ? 'text-green-600 bg-green-100' : 'text-amber-600 bg-amber-100';
  const statusText = isGoalAchieved ? 'Funded' : 'In Progress';
  return { progressPercentage, progressColor, statusColor, statusText };
}
</script>

<!-- <section class=" mx-auto px-2"> -->
  <div class="container mx-auto px-2 py-16 max-w-7xl">
    <h1 class="text-3xl font-medium mb-6">Just Launched Projects</h1>
    <p class="mb-6 text-sm text-gray-600 lg:text-base">
      These pitches are the newest to launch on the platform. You'll find many more investment opportunities in the 
      <a href="/" class="text-primary underline underline-offset-2">full marketplace</a>. 
      If you want to learn more, check out our introduction to investing.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each projects as project}
        {@const { progressPercentage, progressColor, statusColor, statusText } = calculateProgress(project.raised, project.goal)}
        <a href={`/projects/${project.id}`} class="block">
          <div class="bg-white rounded-md border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg group">
            <img src={project.image} alt={project.title} class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
              <p class="text-gray-600 mb-4">{project.description}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                {#each project.tags as tag}
                  <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tag}</span>
                {/each}
              </div>
              <div class="space-y-2">
                <p><span class="text-sm">Raised:</span> <span class="font-semibold">KSh {project.raised.toLocaleString()}</span></p>
                
                <div class="relative py-4 mt-4">
                  <div class="flex mb-2 items-center justify-between">
                    <div>
                      <span class={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs font-semibold inline-block text-gray-600">
                        {progressPercentage}%
                      </span>   
                    </div>
                  </div>
                  <div class="flex rounded-full h-2 bg-gray-200">
                    <div style="width:{progressPercentage}%" class={`rounded-full ${progressColor}`}></div>
                  </div>
                </div>
                <p class="border-t pt-2"><span class="text-sm">Goal:</span> <span class="font-semibold">KSh {project.goal.toLocaleString()}</span></p>
                <p class="border-t pt-2"><span class="text-sm">Valuation:</span> <span class="font-semibold">KSh {project.valuation.toLocaleString()}</span></p>
                <p class="border-t pt-2 "><span class="text-sm">Min. Investment:</span> <span class="font-semibold">KSh {project.minInvestment.toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
    <div class="flex justify-center pt-8"> 
      <button class="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">
        View More Project Pitches
      </button>
    </div>
  </div>
<!-- </section> -->

<style>
  .group:hover :global(.group-hover\:opacity-100) {
    transition-delay: 150ms;
  }
</style>