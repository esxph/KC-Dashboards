import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, params }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	// Get list of all projects the user is a part of
	const { data: projectMemberships } = await supabase
		.from('project_members')
		.select()
		.eq('user_id', user?.id)
		.eq('revoked', false);

	// No project memberships found
	if (!projectMemberships) {
		redirect(303, '/site');
	}

	const currentMembership = projectMemberships.find((mem) => mem.project_id === params.pid);
	// No valid membership found for current project
	if (!currentMembership) {
		redirect(303, '/site');
	}

	// Get all projects user has access to
	const { data: projectList } = await supabase
		.from('projects')
		.select()
		.in(
			'id',
			projectMemberships.map((mem) => mem.project_id)
		);

	// Get current project information
	const currentProject = projectList?.find((mem) => mem.id === params.pid);

	// Pass project data
	return {
		project: {
			id: params.pid,
			role: currentMembership.role,
			name: currentProject.name,
			description: currentProject.description
		},
		projectList
	};
};
