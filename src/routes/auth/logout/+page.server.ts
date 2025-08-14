import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	redirect(303, '/auth/login');
};
