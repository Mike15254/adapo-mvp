// import type { PageLoad } from './$types';
// import { redirect } from '@sveltejs/kit';

// export const load: PageLoad = async ({ parent }) => {
//     const { startup } = await parent();
    
//     if (!startup) {
//         throw redirect(303, '/dashboard/startup/onboarding');
//     }

//     if (startup.verification_status === 'verified') {
//         throw redirect(303, '/dashboard/startup');
//     }

//     return {
//         startup
//     };
// };