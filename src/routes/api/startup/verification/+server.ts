// import { createApiResponse, createErrorResponse } from '$lib/utils/api.utils';
// import { pb } from '$lib/pocketbase';
// import type { RequestHandler } from '../$types';


// export const POST: RequestHandler = async ({ request, locals }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const formData = await request.formData();
//         const profileId = formData.get('profileId') as string;

//         // Upload verification documents
//         const docs = formData.getAll('documents') as File[];
//         const uploadedDocs = await Promise.all(
//             docs.map(doc => {
//                 const docData = new FormData();
//                 docData.append('file', doc);
//                 docData.append('user', userId);
//                 return pb.collection('verification_documents').create(docData);
//             })
//         );

//         // Update startup profile
//         const profile = await pb.collection('startup_profiles').update(profileId, {
//             verification_documents: uploadedDocs.map(doc => doc.id),
//             verification_status: 'documents_pending'
//         });

//         return createApiResponse({ profile });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };