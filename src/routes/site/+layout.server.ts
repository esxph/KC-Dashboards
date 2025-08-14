// Get profile information for use in children pages
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	// User session invalid, redirecting to logout
	if (!user) {
		redirect(303, '/auth/logout');
	}

	// Get profile of user
	const { data: dbProfile } = await supabase
		.from('profiles')
		.select(`first_name, last_name`)
		.eq('id', user.id)
		.single();

	// No profile found, redirecting to logout
	if (!dbProfile) {
		redirect(303, '/auth/logout');
	}

	const profile = {
		id: user.id,
		email: user.email,
		first_name: dbProfile.first_name,
		last_name: dbProfile.last_name
	};

	return {
		profile,
		session
	};
};
