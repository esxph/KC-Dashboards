import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	// Fetch subpartidas data
	const { data, error } = await supabase
		.from('subpartidas')
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
			title: 'Subpartidas', 
			project: { name: project?.name || 'Proyecto', description: project?.description || '' }
		};
	}

	return { 
		components: data ?? [], 
		title: 'Subpartidas', 
		project: { name: project?.name || 'Proyecto', description: project?.description || '' }
	};
};


