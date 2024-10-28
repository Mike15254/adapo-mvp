import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: LayoutLoad = async () => {
  const user = pb.authStore.model;

  if (!user) {
    throw redirect(302, '/login');
  }

  return {
    user,
    role: user.role
  };
};