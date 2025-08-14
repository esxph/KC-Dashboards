// This helps the app refresh a session using the refresh token
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// JWT should be provided in headers as Bearer token
// Refresh token in query parameters /api/jwt/refresh?token=

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const GET: RequestHandler = async ({ request, url }) => {
	const authHeader = request.headers.get('Authorization');

	// Checking if Bearer token exists, and then extract JWT from token
	if (!authHeader) {
		error(400, 'Please provide Authorization header');
	}

	if (!authHeader.startsWith('Bearer ')) {
		error(400, 'Please provide JWT in Authorization header as Bearer token');
	}

	// Check if refresh token was provided in query params
	const refreshToken = url.searchParams.get('token');

	if (!refreshToken) {
		error(400, 'Please provide refresh token in query parameters');
	}

	// Create Supabase Client with JWT in headers
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } }
	});

	// We refresh the session
	const { data, error: refreshError } = await supabase.auth.refreshSession({
		refresh_token: refreshToken
	});

	// Error when refreshing
	if (refreshError) {
		error(400, 'Wrong or expired refresh token');
	}

  return json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  }, { headers: CORS_HEADERS });
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
