import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	// Fetch partidas for the project
	const { data: partidas } = await supabase
		.from('partidas')
		.select('*')
		.eq('project_id', params.pid)
		.order('name');


	// Calculate overall progress
	let overallProgress = 0;
	if (partidas && partidas.length > 0) {
		const totalProgress = partidas.reduce((sum, partida) => sum + (partida.percent || 0), 0);
		overallProgress = Math.round(totalProgress / partidas.length);
	}

	// Check if KMZ file exists in Supabase Storage
	let kmzExists = false;
	let kmzUrl = null;

	try {
		const { data: fileList, error: listError } = await supabase.storage
			.from('civilog')
			.list(`${params.pid}/KMZ`, {
				limit: 10,
				search: 'KMZ.kmz'
			});

		if (!listError && fileList && fileList.length > 0) {
			kmzExists = true;
			kmzUrl = `/api/files/download?projectId=${params.pid}&path=KMZ/KMZ.kmz`;
		}
	} catch (error) {
		// KMZ file not found, continue without it
	}

	// Get all locations for this project in a single query
	const { data: allLocations } = await supabase
		.from('locations')
		.select('id, asset_type, latitude, longitude, asset_id, name')
		.eq('project_id', params.pid);
	return {
		partidas: partidas,
		overallProgress,
		kmzExists,
		kmzUrl,
		locations: allLocations || [],
		title: 'Inicio'
	};
};
