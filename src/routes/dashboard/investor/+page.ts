import type { PageLoad } from './$types';
import type { Investment, Project, ListResult } from '$lib/types/';
import { pb } from '$lib/pocketbase';
import type { RecordModel } from 'pocketbase';

// Type for the page data
interface PageData {
  investments: Investment[];
  opportunities: Project[];
  totalInvested: number;
  activeInvestments: number;
  error?: string;
}

export const load: PageLoad<PageData> = async () => {
  const user = pb.authStore.model;
  if (!user) {
    return {
      investments: [],
      opportunities: [],
      totalInvested: 0,
      activeInvestments: 0
    };
  }

  try {
    const [investmentData, projectData] = await Promise.all([
      pb.collection('investments').getList<Investment>(1, 50, {
        filter: `investor = "${user.id}"`,
        expand: 'project'
      }),
      pb.collection('projects').getList<Project>(1, 5, {
        filter: 'status = "active"',
        sort: '-created'
      })
    ]);

    return {
      investments: investmentData.items as Investment[],
      opportunities: projectData.items as Project[],
      totalInvested: investmentData.items.reduce((sum, inv) => sum + inv.amount, 0),
      activeInvestments: investmentData.items.length
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return {
      investments: [],
      opportunities: [],
      totalInvested: 0,
      activeInvestments: 0,
      error: 'Failed to load dashboard data'
    };
  }
};