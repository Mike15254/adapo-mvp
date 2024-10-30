<script lang="ts">
    export let loading = false;
    export let text = 'Submit';
    export let loadingText = 'Loading...';
    export let type: 'submit' | 'button' = 'button';
    export let disabled = false;
    export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
    {type}
    class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md 
           shadow-sm text-sm font-medium text-white
           {variant === 'primary' 
               ? 'bg-indigo-600 hover:bg-indigo-700' 
               : 'bg-gray-600 hover:bg-gray-700'}
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
           disabled:opacity-50 disabled:cursor-not-allowed 
           transition-all duration-200"
    {disabled}
    
    on:click
>
    {#if loading}
        <div class="flex items-center space-x-2">
            <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                />
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span>{loadingText}</span>
        </div>
    {:else}
        {text}
    {/if}
</button>