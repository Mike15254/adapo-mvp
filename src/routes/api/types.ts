import type { RequestEvent } from '@sveltejs/kit';

export type ApiHandler = {
    GET?: (event: RequestEvent) => Promise<Response>;
    POST?: (event: RequestEvent) => Promise<Response>;
    PUT?: (event: RequestEvent) => Promise<Response>;
    DELETE?: (event: RequestEvent) => Promise<Response>;
    PATCH?: (event: RequestEvent) => Promise<Response>;
};