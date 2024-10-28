<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import {
        PlusCircle,
        Calendar,
        AlertTriangle,
        CheckCircle
    } from 'lucide-svelte';
    import type { PageData } from './$types';
    import type { StartupUpdate, UpdateType } from '$lib/types/startup.types';
    import { pb } from '$lib/pocketbase';

    export let data: PageData;

    let showNewUpdateForm = false;
    let loading = false;
    let error = '';
    let success = '';

    interface UpdateForm {
        title: string;
        content: string;
        update_type: UpdateType;
        attachments?: File[];
    }

    let newUpdate: UpdateForm = {
        title: '',
        content: '',
        update_type: 'general',
        attachments: []
    };

    const UPDATE_TYPES: Array<{ value: UpdateType; label: string }> = [
        { value: 'milestone', label: 'Milestone Update' },
        { value: 'financial', label: 'Financial Update' },
        { value: 'team', label: 'Team Update' },
        { value: 'general', label: 'General Update' }
    ];

    function formatDate(date: string) {
        try {
            return new Date(date).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            return date;
        }
    }

    function getUpdateTypeClass(type: UpdateType): string {
        const classes: Record<UpdateType, string> = {
            milestone: 'bg-green-100 text-green-800',
            financial: 'bg-blue-100 text-blue-800',
            team: 'bg-purple-100 text-purple-800',
            general: 'bg-gray-100 text-gray-800'
        };
        return classes[type];
    }  
    
    async function refreshUpdates() {
        if (!data.startup?.id) return;
        
        try {
            const result = await pb.collection('startup_updates').getList(1, 50, {
                filter: `startup="${data.startup.id}"`,
                sort: '-created'
            });
            
            data = {
                ...data,
                updates: result.items.map(record => ({
                    id: record.id,
                    startup: record.startup,
                    title: record.title || '',
                    content: record.content || '',
                    update_type: record.update_type || 'general',
                    attachments: record.attachments || [],
                    created: record.created
                }))
            };
        } catch (err) {
            console.error('Error refreshing updates:', err);
        }
    }

    async function handleSubmitUpdate() {
        if (!data.startup?.id) {
            error = 'Startup profile not found';
            return;
        }

        if (!newUpdate.title.trim() || !newUpdate.content.trim()) {
            error = 'Please fill in all required fields';
            return;
        }

        loading = true;
        error = '';
        success = '';

        try {
            const formData = new FormData();
            formData.append('startup', data.startup.id);
            formData.append('title', newUpdate.title.trim());
            formData.append('content', newUpdate.content.trim());
            formData.append('update_type', newUpdate.update_type);

            if (newUpdate.attachments?.length) {
                newUpdate.attachments.forEach(file => {
                    formData.append('attachments', file);
                });
            }

            await pb.collection('startup_updates').create(formData);

            success = 'Update posted successfully';
            showNewUpdateForm = false;
            newUpdate = {
                title: '',
                content: '',
                update_type: 'general',
                attachments: []
            };

            await refreshUpdates();

        } catch (err) {
            console.error('Error posting update:', err);
            error = err instanceof Error ? err.message : 'Failed to post update';
        } finally {
            loading = false;
        }
    }

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input?.files) return;
        
        const files = Array.from(input.files);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        if (totalSize > 5 * 1024 * 1024) { // 5MB limit
            error = 'Total file size exceeds 5MB limit';
            input.value = '';
            return;
        }

        newUpdate.attachments = files;
    }

    function handleError(err: unknown): string {
        if (err instanceof Error) {
            return err.message;
        }
        if (typeof err === 'string') {
            return err;
        }
        return 'An unknown error occurred';
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Project Updates
            </h2>
            <p class="mt-1 text-sm text-gray-500">
                Keep your investors informed about your progress
            </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                on:click={() => showNewUpdateForm = true}
            >
                <PlusCircle class="-ml-1 mr-2 h-5 w-5" />
                New Update
            </button>
        </div>
    </div>

    <!-- New Update Form -->
    {#if showNewUpdateForm}
        <div class="mt-8 bg-white shadow sm:rounded-lg" in:fly={{ y: 20, duration: 300 }}>
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Post New Update</h3>
                
                <form class="mt-5 space-y-6" on:submit|preventDefault={handleSubmitUpdate}>
                    <div>
                        <label for="update-title" class="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="update-title"
                            required
                            bind:value={newUpdate.title}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label for="update-type" class="block text-sm font-medium text-gray-700">
                            Update Type
                        </label>
                        <select
                            id="update-type"
                            required
                            bind:value={newUpdate.update_type}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {#each UPDATE_TYPES as type}
                                <option value={type.value}>{type.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label for="update-content" class="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="update-content"
                            required
                            rows="4"
                            bind:value={newUpdate.content}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label for="attachments" class="block text-sm font-medium text-gray-700">
                            Attachments
                        </label>
                        <input
                            type="file"
                            id="attachments"
                            multiple
                            on:change={handleFileSelect}
                            class="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-indigo-50 file:text-indigo-600
                                hover:file:bg-indigo-100"
                        />
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button
                            type="button"
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            on:click={() => showNewUpdateForm = false}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {#if loading}
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Posting...
                            {:else}
                                Post Update
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Updates List -->
    <div class="mt-8 space-y-6">
        {#if data.updates.length > 0}
            {#each data.updates as update (update.id)}
                <div
                    class="bg-white shadow sm:rounded-lg"
                    in:fade={{ duration: 300 }}
                >
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <h3 class="text-lg font-medium leading-6 text-gray-900">
                                    {update.title}
                                </h3>
                                <div class="mt-1 flex items-center space-x-3">
                                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeClass(update.update_type)}`}>
                                        {update.update_type}
                                    </span>
                                    <span class="text-sm text-gray-500">
                                        <Calendar class="inline-block h-4 w-4 mr-1" />
                                        {formatDate(update.created)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 text-sm text-gray-500">
                            {update.content}
                        </div>
                        {#if update.attachments?.length}
                            <div class="mt-4 border-t border-gray-200 pt-4">
                                <h4 class="text-sm font-medium text-gray-900">Attachments</h4>
                                <ul class="mt-2 space-y-2">
                                    {#each update.attachments as attachment}
                                        <li>
                                            <a
                                                href={pb.getFileUrl(update, attachment)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                                            >
                                                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                                </svg>
                                                {attachment}
                                            </a>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-center py-12 bg-white shadow sm:rounded-lg">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v20c0 4.418 7.163 8 16 8s16-3.582 16-8V14M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No updates</h3>
                <p class="mt-1 text-sm text-gray-500">
                    Get started by creating your first update
                </p>
                <div class="mt-6">
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => showNewUpdateForm = true}
                    >
                        <PlusCircle class="-ml-1 mr-2 h-5 w-5" />
                        New Update
                    </button>
                </div>
            </div>
        {/if}
    </div>

    <!-- Error/Success Messages -->
    {#if error}
        <div
            class="fixed bottom-4 right-4 bg-red-50 p-4 rounded-md shadow-lg border border-red-100"
            transition:fly={{ y: 50, duration: 300 }}
            role="alert"
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <AlertTriangle class="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-red-800">{error}</p>
                </div>
                <div class="ml-auto pl-3">
                    <div class="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            class="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                            on:click={() => error = ''}
                        >
                            <span class="sr-only">Dismiss</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if success}
        <div
            class="fixed bottom-4 right-4 bg-green-50 p-4 rounded-md shadow-lg border border-green-100"
            transition:fly={{ y: 50, duration: 300 }}
            role="alert"
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <CheckCircle class="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">{success}</p>
                </div>
                <div class="ml-auto pl-3">
                    <div class="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            class="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                            on:click={() => success = ''}
                        >
                            <span class="sr-only">Dismiss</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(.animate-spin) {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>