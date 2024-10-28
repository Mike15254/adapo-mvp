import { writable } from 'svelte/store';

export const userType = writable<'investor' | 'startup' | null>(null);
export const user = writable(null);
