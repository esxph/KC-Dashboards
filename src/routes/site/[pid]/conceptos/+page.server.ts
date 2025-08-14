import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data, error } = await supabase
		.from('conceptos')
		.select('id,name,percent')
		.eq('project_id', params.pid)
		.order('name');

	if (error) {
		return { components: [], title: 'Conceptos' };
	}

	return { components: data ?? [], title: 'Conceptos' };
};


