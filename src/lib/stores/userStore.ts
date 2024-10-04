import { writable } from 'svelte/store';
import type { UserData } from '../pocketbase';

export type User = UserData;

export const currentUser = writable<User | null>(null);

// You can add more user-related store functions here if needed