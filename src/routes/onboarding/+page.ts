import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const load: PageLoad = async () => {
  // Redirect if already authenticated
  if (pb.authStore.isValid) {
    throw redirect(302, `/dashboard/${pb.authStore.model?.role}`);
  }
  return {};
};
