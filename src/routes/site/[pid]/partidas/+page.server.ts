import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	// Fetch partidas data
	const { data, error } = await supabase
		.from('partidas')
		.select('id,name,percent')
		.eq('project_id', params.pid)
		.order('name');

	// Fetch project data
	const { data: project } = await supabase
		.from('projects')
		.select('name, description')
		.eq('id', params.pid)
		.single();

	if (error) {
		return { 
			components: [], 
			title: 'Partidas', 
			project: { name: project?.name || 'Proyecto', description: project?.description || '' }
		};
	}

	return { 
		components: data ?? [], 
		title: 'Partidas', 
		project: { name: project?.name || 'Proyecto', description: project?.description || '' }
	};
};


