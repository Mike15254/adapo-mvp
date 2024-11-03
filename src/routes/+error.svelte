<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                {$page.status === 404 ? 'Page Not Found' : 'Error'}
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                {$page.error?.message || 'An unexpected error occurred'}
            </p>
            <div class="mt-4">
                <a
                    href="/"
                    class="text-indigo-600 hover:text-indigo-500"
                >
                    Return to Home
                </a>
            </div>
        </div>
    </div>
</div>