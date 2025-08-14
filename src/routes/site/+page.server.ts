import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Get user session from Supabase
	const {
		data: { user }
	} = await supabase.auth.getUser();

	// Find project memberships for user
	const { data: projects } = await supabase
		.from('project_members')
		.select('project_id')
		.eq('user_id', user?.id)
		.eq('revoked', false);

	// If the user is member of any project, redirect to the first result
	// TODO: add a mechanism for the user to select a default project
	if (projects) {
		if (projects.length > 0) {
			const defaultProject = projects[0].project_id;
			redirect(303, '/site/' + defaultProject);
		}
	}
};
