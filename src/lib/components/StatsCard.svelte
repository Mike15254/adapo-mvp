<script lang="ts">
    import type { Icon } from 'lucide-svelte';
    
    export let icon: Icon;
    export let title: string;
    export let value: string;
    export let subtext: string = '';
    export let href: string = '';
    export let linkText: string = '';
    export let trend: 'positive' | 'negative' | 'neutral' = 'neutral';

    const Icon = icon;
</script>

<div class="bg-white overflow-hidden shadow-sm rounded-lg">
    <div class="p-5">
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <Icon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
                <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                        {title}
                    </dt>
                    <dd class="mt-1 flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">
                            {value}
                        </div>
                        {#if subtext}
                            <span class="ml-2 text-sm text-gray-500">
                                {subtext}
                            </span>
                        {/if}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
    {#if href}
        <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
                <a {href} class="font-medium text-indigo-700 hover:text-indigo-900">
                    {linkText}
                </a>
            </div>
        </div>
    {/if}
</div>