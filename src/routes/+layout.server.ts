// Get profile information for use in children pages
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, url }) => {
	const { session } = await safeGetSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	// Currently only two pages are allowed to access without login, /api/jwt and /auth/login
	if (!user) {
		if (!url.pathname.startsWith('/api/jwt') && !url.pathname.startsWith('/auth/login')) {
			throw redirect(303, '/auth/login');
		}
	}
};
