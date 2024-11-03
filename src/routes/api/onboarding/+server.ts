// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { pb } from '$lib/pocketbase';
// import { createErrorResponse } from '$lib/utils/api.utils';

// export const POST: RequestHandler = async ({ request, locals }) => {
//     try {
//         // Check for authenticated user
//         if (!locals.user?.id) {
//             return createErrorResponse('Unauthorized', 401);
//         }

//         const data = await request.json();
//         const { role, profileData } = data;

//         // Validate required data
//         if (!role || !profileData) {
//             return createErrorResponse('Missing required data', 400);
//         }

//         let profile;
        
//         switch (role) {
//             case 'startup':
//                 profile = await pb.collection('startup_profiles').create({
//                     user: locals.user.id,
//                     ...profileData,
//                     verification_status: 'unverified'
//                 });
//                 break;
            
//             case 'investor':
//                 profile = await pb.collection('investors_profiles').create({
//                     user: locals.user.id,
//                     ...profileData,
//                     verification_status: 'unverified'
//                 });
//                 break;
            
//             default:
//                 return createErrorResponse('Invalid role specified', 400);
//         }

//         // Update user record to indicate profile is created
//         await pb.collection('users').update(locals.user.id, {
//             has_completed_profile: true
//         });

//         return json({ 
//             success: true, 
//             profile,
//             message: 'Profile created successfully' 
//         });

//     } catch (error: any) {
//         console.error('Onboarding error:', error);
//         return createErrorResponse(
//             error.data?.message || error.message || 'Failed to complete onboarding',
//             error.status || 400
//         );
//     }
// };