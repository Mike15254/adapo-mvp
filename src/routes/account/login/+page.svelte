<script lang="ts">
    let email = '';
    let password = '';
    let errorMessage = '';

    async function handleLogin() {
        console.log('handleLogin');
    }
</script>

<div class="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">
    <h2 class="text-xl font-bold">Login</h2>
    <p class="text-sm text-gray-600 py-2">Enter your credentials to access your account</p>

    <form on:submit|preventDefault={handleLogin} class="flex flex-col py-2 space-y-4">
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                id="email"
                bind:value={email}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
        <div>
            <label for="password" class="text-sm font-medium text-gray-700 flex flex-row justify-between">
                Password 
                <a href="/account/reset-password" class="text-xs underline">Forgot your password?</a>
            </label>
            <input
                type="password"
                id="password"
                bind:value={password}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
        <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Login
        </button>
    </form>
    <div class="absolute -top-1 -right-1 border m-3">
        {#if errorMessage}
       <p>Not now</p>
        {/if}
    </div>

    <div class="mt-4 text-center text-xm">
        <a href="/account/signup" class="text-sm text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign up
        </a>
    </div>
</div>