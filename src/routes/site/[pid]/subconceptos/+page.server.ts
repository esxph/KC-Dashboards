import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	// Fetch subconceptos data
	const { data, error } = await supabase
		.from('subconceptos')
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
			title: 'Subconceptos', 
			project: { name: project?.name || 'Proyecto', description: project?.description || '' }
		};
	}

	return { 
		components: data ?? [], 
		title: 'Subconceptos', 
		project: { name: project?.name || 'Proyecto', description: project?.description || '' }
	};
};


