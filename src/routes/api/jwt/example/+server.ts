// Just leaving this is an example for Edward Hunter @esxph
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// This API returns the user profile when provided with JWT
// JWT should be provided in headers as Bearer token
export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');

	// Checking if Bearer token exists, and then extract JWT from token
	if (!authHeader) {
		error(400, 'Please provide Authorization header');
	}

	if (!authHeader.startsWith('Bearer ')) {
		error(400, 'Please provide JWT in Authorization header as Bearer token');
	}

	// Create Supabase Client with JWT in headers
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } }
	});

	// We get the current user information
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		error(401, 'Wrong or expired JWT');
	}

	// Retrieve profile from db and return
	const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single();

	return json(profile);
};
