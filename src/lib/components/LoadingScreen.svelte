<!-- src/lib/components/LoadingScreen.svelte -->
<script lang="ts">
  export let message = 'Loading...';
  export let size: 'small' | 'medium' | 'large' = 'medium';
</script>

<div 
  class="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
  role="alert"
  aria-label="Loading content"
>
  <div class="text-center">
      <div class="relative">
          <!-- Spinner -->
          <div class={`
              rounded-full border-t-2 border-b-2 border-indigo-500
              ${size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-12 h-12' : 'w-16 h-16'}
              animate-spin
          `}></div>
          
          <!-- Inner pulse -->
          <div class={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              rounded-full bg-indigo-500/20
              ${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-6 h-6' : 'w-8 h-8'}
              animate-pulse
          `}></div>
      </div>

      <!-- Message -->
      {#if message}
          <p class="mt-4 text-gray-600 font-medium animate-pulse">
              {message}
          </p>
      {/if}
  </div>
</div>

<style>
  /* Optional: Add any custom animations if needed */
  @keyframes custom-spin {
      to {
          transform: rotate(360deg);
      }
  }
</style>