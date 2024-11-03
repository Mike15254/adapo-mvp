// import { createApiResponse, createErrorResponse } from '$lib/utils/api.utils';
// import { pb } from '$lib/pocketbase';
// import type { RequestHandler } from '../$types';

// export const GET: RequestHandler = async ({ locals, url }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const profile = await pb.collection('startup_profiles')
//             .getFirstListItem(`user="${userId}"`);

//         const updates = await pb.collection('startup_updates').getList(1, 10, {
//             filter: `startup="${profile.id}"`,
//             sort: '-created'
//         });

//         return createApiResponse({ updates: updates.items });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };

// export const POST: RequestHandler = async ({ request, locals }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const formData = await request.formData();
//         const profile = await pb.collection('startup_profiles')
//             .getFirstListItem(`user="${userId}"`);

//         formData.append('startup', profile.id);
//         const update = await pb.collection('startup_updates').create(formData);

//         return createApiResponse({ update });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };