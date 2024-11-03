// import { createApiResponse, createErrorResponse } from '$lib/utils/api.utils';
// import { pb } from '$lib/pocketbase';
// import type { RequestHandler } from '../$types';

// export const GET: RequestHandler = async ({ locals }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const profile = await pb.collection('startup_profiles')
//             .getFirstListItem(`user="${userId}"`);
            
//         return createApiResponse({ profile });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };

// export const POST: RequestHandler = async ({ request, locals }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const formData = await request.formData();
//         formData.append('user', userId);
//         formData.append('verification_status', 'unverified');

//         const profile = await pb.collection('startup_profiles').create(formData);
        
//         return createApiResponse({ profile });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };
