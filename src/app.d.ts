// src/app.d.ts
import type { PocketBase } from 'pocketbase';

declare global {
    namespace App {
        interface Locals {
            user: {
                id: string;
                email: string;
                name: string;
                role: 'startup' | 'investor';
                profile_picture?: string;
                verification_status: string;
            } | null;
            token: string | null;
        }

        interface PageData {
            user: Locals['user'];
            campaign?: any; // Define proper campaign type
        }

        interface Error {
            message: string;
        }

        interface Platform {}
    }
}

export {};