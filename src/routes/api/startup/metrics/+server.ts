// import { createApiResponse, createErrorResponse } from '$lib/utils/api.utils';
// import { pb } from '$lib/pocketbase';
// import type { RequestHandler } from '../$types';


// export const GET: RequestHandler = async ({ locals }) => {
//     try {
//         const userId = locals.user?.id;
//         if (!userId) return createErrorResponse('Unauthorized', 401);

//         const profile = await pb.collection('startup_profiles')
//             .getFirstListItem(`user="${userId}"`);

//         // Get funding projects
//         const projects = await pb.collection('fundingProjects').getList(1, 10, {
//             filter: `startup="${profile.id}"`,
//             sort: '-created'
//         });

//         // Get total investments
//         const investments = await pb.collection('investments').getList(1, 50, {
//             filter: `startup="${profile.id}" && status="completed"`,
//             sort: '-created'
//         });

//         const metrics = {
//             totalFunding: investments.items.reduce((sum, inv) => sum + inv.amount, 0),
//             projectCount: projects.totalItems,
//             investorCount: new Set(investments.items.map(inv => inv.investor)).size,
//             averageInvestment: investments.items.length > 0 
//                 ? investments.items.reduce((sum, inv) => sum + inv.amount, 0) / investments.items.length 
//                 : 0
//         };

//         return createApiResponse({ metrics });
//     } catch (error: any) {
//         return createErrorResponse(error.message, 500);
//     }
// };