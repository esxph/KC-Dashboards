import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// This API returns a JWT when provided email and password
// will be used for mobile login in the report submitter

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const POST: RequestHandler = async ({ request }) => {
	const contentType = request.headers.get('content-type') || '';
	if (!contentType.includes('application/json')) {
		error(415, { message: 'Content-Type must be application/json' });
	}

	const { email, password } = await request.json();

	if (email === undefined) {
		error(400, { message: 'Missing email' });
	}

	if (password === undefined) {
		error(400, { message: 'Missing password' });
	}

	// Assigning dummy set cookies and get cookies options, we just want the JWT back
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => [],
			setAll: () => {}
		}
	});

	const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
	if (loginError) {
		error(401, { message: 'Wrong credentials' });
	} else {
		// We want to return access token, actually used for calls but with 1 hour expiration
		// and refresh token, which will let the app grab a new token
		return json({
			access_token: data.session.access_token,
			refresh_token: data.session.refresh_token
		}, { headers: CORS_HEADERS });
	}
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
