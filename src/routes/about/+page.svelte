<script>

	import Navbar from "$lib/components/Navbar.svelte";

</script>

<div class="bg-gray-300 text-center top-0 mt-0">
  <p class="p-2 text-sm">
    Update: We are now in Beta. Please contact us at <a
      href="mailto:hello@adapo.io"
      class="underline underline-offset-2">hello@adapo.io</a
    > for more information.
  </p>
</div>
  <div  class="sticky top-0 z-50">
    <Navbar />
  </div>
  <main class="bg-background min-h-screen">
    <section class="py-16 md:py-24 px-4">
      <div class="container mx-auto max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold text-primary mb-6">About Adapo</h1>
        <p class="text-lg text-gray-700 mb-8">Adapo is empowering Kenyan SMEs and investors by connecting ambitious entrepreneurs with growth capital.</p>
        
        <!-- Mission and Vision -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 class="text-2xl font-bold text-secondary mb-4">Our Mission</h2>
            <p class="text-gray-600">To accelerate the growth of Kenyan businesses by providing accessible investment opportunities and fostering a vibrant entrepreneurial ecosystem.</p>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-secondary mb-4">Our Vision</h2>
            <p class="text-gray-600">A thriving Kenyan economy powered by innovative SMEs and supported by a diverse community of local and global investors.</p>
          </div>
        </div>
  
        <!-- Team Section -->
        <h2 class="text-3xl font-bold text-primary mb-6">Our Team</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <!-- Repeat for each team member -->
          <div class="text-center">
            <img src="/path-to-image.jpg" alt="Team Member" class="w-32 h-32 rounded-full mx-auto mb-4" />
            <h3 class="font-semibold">Name</h3>
            <p class="text-gray-600">Position</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  