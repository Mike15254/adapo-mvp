<script lang="ts">
    import HeroCarousel from "$lib/components/HeroCarousel.svelte";
	import InvestedCompanies from "$lib/components/InvestedCompanies.svelte";
	import InvestmentStats from "$lib/components/InvestmentStats.svelte";
    import LaunchedProject from "$lib/components/LaunchedProject.svelte";
    import UpcomingProject from "$lib/components/UpcomingProject.svelte";

</script>
<section class="px-4 py-12 md:py-24">
  <div class="container max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row items-center md:space-x-8">
      <div class="w-full md:w-1/2 mb-8 md:mb-0">
        <div class="space-y-4 md:space-y-6 lg:space-y-8">
          <span class="text-4xl  md:text-4xl lg:text-5xl xl:text-6xl md:text-left lg:text-left lg:font-extrabold  text-gray-800 font-bold">
            <span class="block">Empowering Kenyan</span>
            <span class="block text-secondary pt-2">
              SMEs <span class="text-gray-800">&</span> Investors
            </span>
          </span>
          <p class="text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl pt-2 leading-relaxed mb-10">
            Connecting ambitious Kenyan entrepreneurs with investors and fueling
            the growth of emerging markets.
          </p>
          <div class="pt-6 lg:pt-4 flex items-center  gap-x-6">
            <a href="/invest"
                class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">
                Start Investing
            </a>
            <a href="/raise" class="text-sm font-semibold leading-6 text-gray-900">
                Raise Funds
                <span>→</span>
            </a>
        </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 mx-auto">
        <HeroCarousel />
      </div>
    </div>
  </div>
</section>


<!--- Investment Stats Section -->
  <section class="py-2 lg:py-8  mx-auto px-2">
    <InvestmentStats />
  </section>

  <!--- Invest Section -->

  <section class="py-2 lg:py-8max-w-7xl mx-auto px-2">
    <LaunchedProject />
  </section>


  <!--- Upcoming Projects Section -->

  <section class="py-2 lg:py-8  mx-auto px-2">
    <UpcomingProject />
  </section>


<!-- Invested Companies Section -->
  <section class="py-2 lg:py-8  mx-auto px-2">
    <InvestedCompanies />
  </section>

