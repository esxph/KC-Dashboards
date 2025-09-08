import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Dummy data for testing the bar chart component
	const chartData = [
		{ month: "January", planeada: 186, real: 80 },
		{ month: "February", planeada: 305, real: 200 },
		{ month: "March", planeada: 237, real: 120 },
		{ month: "April", planeada: 73, real: 190 },
		{ month: "May", planeada: 209, real: 130 },
		{ month: "June", planeada: 214, real: 140 },
		{ month: "July", planeada: 180, real: 160 },
		{ month: "August", planeada: 250, real: 180 },
		{ month: "September", planeada: 190, real: 140 },
		{ month: "October", planeada: 220, real: 170 },
		{ month: "November", planeada: 280, real: 200 },
		{ month: "December", planeada: 320, real: 240 }
	];

	const chartConfig = {
		planeada: {
			label: "Planeada",
			color: "#2563eb",
		},
		real: {
			label: "Real",
			color: "#60a5fa",
		},
	};

	return {
		chartData,
		chartConfig,
		title: 'Chart Test'
	};
};
