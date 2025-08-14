import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const projectId = url.searchParams.get('projectId');
	const filePath = url.searchParams.get('path');
	const proxy = url.searchParams.get('proxy');
	
	if (!projectId || !filePath) {
		throw error(400, 'Missing projectId or path parameter');
	}

	const fullPath = `${projectId}/${filePath}`;

	try {
		// If proxy=true, stream the file directly through our server
		if (proxy === 'true') {
			const { data, error: downloadError } = await supabase.storage
				.from('civilog')
				.download(fullPath);

			if (downloadError) {
				throw error(404, `File not found: ${downloadError.message}`);
			}

			if (!data) {
				throw error(404, 'File not found - no data returned');
			}

			// Get the content type based on file extension
			const extension = filePath.split('.').pop()?.toLowerCase();
			const contentType = getContentType(extension);

			// Stream the file with proper headers
			return new Response(data.stream(), {
				headers: {
					'Content-Type': contentType,
					'Cache-Control': 'public, max-age=3600',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization'
				}
			});
		} else {
			// Default behavior: return signed URL
			const { data, error: downloadError } = await supabase.storage
				.from('civilog')
				.createSignedUrl(fullPath, 3600); // 1 hour expiry

			if (downloadError) {
				throw error(500, `Failed to create download URL: ${downloadError.message}`);
			}

			// Handle protocol for signed URL
			let signedUrl = data.signedUrl;
			
			// Check if this is a local IP address - if so, keep HTTP to avoid SSL issues
			const isLocalIP = signedUrl && (
				signedUrl.includes('://localhost') ||
				signedUrl.includes('://127.0.0.1') ||
				signedUrl.includes('://10.') ||
				signedUrl.includes('://192.168.') ||
				signedUrl.includes('://172.')
			);
			
			if (signedUrl && signedUrl.startsWith('http://') && !isLocalIP) {
				signedUrl = signedUrl.replace('http://', 'https://');
			} else if (signedUrl && signedUrl.startsWith('https://') && isLocalIP) {
				signedUrl = signedUrl.replace('https://', 'http://');
			}

			return json(
				{ downloadUrl: signedUrl },
				{
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
						'Cache-Control': 'public, max-age=300'
					}
				}
			);
		}
	} catch (err) {
		console.error('Unexpected error:', err);
		throw error(500, 'Internal server error');
	}
};

function getContentType(extension?: string): string {
	const types: Record<string, string> = {
		'kmz': 'application/vnd.google-earth.kmz',
		'kml': 'application/vnd.google-earth.kml+xml',
		'zip': 'application/zip',
		'pdf': 'application/pdf',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'png': 'image/png',
		'gif': 'image/gif',
		'svg': 'image/svg+xml',
		'txt': 'text/plain'
	};
	
	return types[extension || ''] || 'application/octet-stream';
}

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
};