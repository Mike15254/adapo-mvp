<!--

@component
This is a component for displaying a list of upcoming projects.

Usage:
```svelte
<script>
import UpcomingProject from './UpcomingProject.svelte';
</script>

<UpcomingProject />
```

@example           
<UpcomingProject /> 

-->

<script lang="ts">
    // Import images
    import blockchainImage from "$lib/assets/blockChain.avif";
    import healthImage from "$lib/assets/healthcare.avif";
    import climateImage from "$lib/assets/climate-change.avif";
    
    interface UpcomingProject {
      id: string;
      title: string;
      description: string;
      image: any; // Change this to the correct type for Svelte's image handling
      tags: string[];
    }
    
    const upcomingProjects: UpcomingProject[] = [
      {
        id: "blockchain",
        title: "BlockChain Revolution",
        description: "Decentralized finance solution for cross-border transactions",
        image: blockchainImage,
        tags: ["Blockchain", "FinTech"],
      },
      {
        id: "health",
        title: "HealthTech Innovators",
        description: "AI-powered diagnostic tool for rural healthcare centers",
        image: healthImage,
        tags: ["HealthTech", "AI"],
      },
      {
        id: "climate",
        title: "CleanSeas Initiative",
        description: "Innovative marine cleanup technology for coastal regions",
        image: climateImage,
        tags: ["CleanTech", "Marine"],
      },
    ];
    </script>
    
    <section class="py-16 bg-gray-100">
      <div class="container mx-auto px-4 max-w-7xl">
        <h2 class="text-3xl font-medium mb-6">Coming Soon: Projects to Invest In</h2>
        <p class="mb-6 text-sm text-gray-600 lg:text-base">
          Explore exciting businesses soon to be launching. Get a preview of their pitches, register for early access in the campaign and follow along on their raise journey.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each upcomingProjects as project (project.id)}
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
              <img src={project.image} alt={project.title} class="w-full h-48 object-cover" />
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
                <p class="text-gray-600 mb-4">{project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each project.tags as tag}
                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{tag}</span>
                  {/each}
                </div>
                <div class="mt-4">
                  <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>