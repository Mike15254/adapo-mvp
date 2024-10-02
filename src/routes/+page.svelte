<script lang="ts">
    import HeroImage from "$lib/assets/business.png";
	import InvestedCompanies from "$lib/components/InvestedCompanies.svelte";
	import InvestmentStats from "$lib/components/InvestmentStats.svelte";
    import LaunchedProject from "$lib/components/LaunchedProject.svelte";
    import UpcomingProject from "$lib/components/UpcomingProject.svelte";

</script>
<section class="px-2 py-24 md:px-0">
    <div class="container items-center max-w-7xl px-4 mx-auto lg:px-2">
      <div class="flex flex-wrap items-center sm:-mx-3">
        <div class="w-full md:w-1/2 md:px-3">
          <div
            class="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-7xl md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0"
          >
            <h1
              class="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl"
            >
              <span class="block xl:inline">Empowering Kenyan</span>
              <span class="block text-secondary xl:inline">
                SMEs <span class="text-gray-800">&</span> Investors
              </span>
            </h1>
            <p
              class="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl"
            >
              Connecting ambitious Kenyan entrepreneurs with investors and fuel
              the growth of emerging markets.
            </p>
            <div class="relative flex flex-col sm:flex-row sm:space-x-4">
              <a
                href="#_"
                class="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-primary rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
              >
                Start Investing
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <button
                class="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <div class="w-full h-auto overflow-hidden rounded-md">
            <img src={HeroImage} alt="Adapo Hero Image" class="w-full h-auto overflow-hidden rounded-md" />
          </div>
        </div>
      </div>
    </div>
  </section>


<!--- Investment Stats Section -->
  <section class="py-8  mx-auto px-2">
    <InvestmentStats />
  </section>

  <!--- Invest Section -->

  <section class="py-8 max-w-7xl mx-auto px-2">
    <LaunchedProject />
  </section>


  <!--- Upcoming Projects Section -->

  <section class="py-8  mx-auto px-2">
    <UpcomingProject />
  </section>


<!-- Invested Companies Section -->
  <section class="py-8  mx-auto px-2">
    <InvestedCompanies />
  </section>


<!-- Footer -->
<footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">About Adapo</h3>
          <p>Empowering Kenyan SMEs and Investors through innovative funding solutions.</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li><a href="/" class="hover:text-gray-300">Home</a></li>
            <li><a href="/" class="hover:text-gray-300">Invest</a></li>
            <li><a href="/" class="hover:text-gray-300">Raise Funds</a></li>
            <li><a href="/" class="hover:text-gray-300">About Us</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
          <p>Email: info@adapo.com</p>
          <p>Phone: +254 123 456 789</p>
        </div>
      </div>
      <div class="mt-8 text-center">
        <p>&copy; 2024 Adapo. All rights reserved.</p>
      </div>
    </div>
  </footer>