<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    // Removed unused UI imports

	export let kmzUrl;
	export let autoLoad = false;
	
	let className = '';
	export { className as class };
	
	let map;
	let currentLayer = null;
	let mapContainer;
	let loading = false;
	let error = '';
	let L: any;
	let JSZip: any;
	let toGeoJSON: any;

    export let locations: Array<{
        id: string;
        asset_type: string;
        latitude: number;
        longitude: number;
        asset_id: string;
        name?: string | null;
    }> = [];

    function capitalizeFirst(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


	onMount(async () => {
		if (browser && !map && mapContainer) {
			// Dynamically import leaflet and other dependencies only on the client
			const [leafletModule, jszipModule, togeojsonModule] = await Promise.all([
				import('leaflet'),
				import('jszip'),
				import('@tmcw/togeojson')
			]);
			
			L = leafletModule.default;
			JSZip = jszipModule.default;
			toGeoJSON = togeojsonModule;

			// Import CSS dynamically
			await import('leaflet/dist/leaflet.css');

			map = L.map(mapContainer, {
				attributionControl: false
			}).setView([0, 0], 2);

			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				attribution: ''
			}).addTo(map);

			// Carga los puntos desde la base de datos
        	await loadLocations();

			// Auto-load KMZ if URL is provided and autoLoad is true
			if (kmzUrl && autoLoad) {
				loadKmzFromUrl();
			}
		}
	});

	async function loadKmzFromUrl() {
		if (!kmzUrl || loading || !browser || !JSZip) return;
		
		loading = true;
		error = '';

		try {
			// For local development, try proxy mode first to avoid SSL/CORS issues
			const isLocalDev = window.location.hostname === 'localhost' || 
							   window.location.hostname.startsWith('10.') ||
							   window.location.hostname.startsWith('192.168.') ||
							   window.location.hostname.startsWith('172.');
			
			let fileResponse;
			
			if (isLocalDev) {
				try {
					const proxyUrl = `${kmzUrl}&proxy=true`;
					
					fileResponse = await fetch(proxyUrl, {
						mode: 'cors',
						cache: 'no-cache'
					});
					
					if (!fileResponse.ok) {
						throw new Error(`Proxy failed: ${fileResponse.status}`);
					}
				} catch (proxyError) {
					// Fallback to signed URL method
					await trySignedUrlMethod();
				}
			} else {
				// Production: try signed URL first
				await trySignedUrlMethod();
			}
			
			async function trySignedUrlMethod() {
				// First, get the signed download URL from our API
				const apiResponse = await fetch(kmzUrl);
				if (!apiResponse.ok) {
					throw new Error(`Failed to get download URL: ${apiResponse.status} ${apiResponse.statusText}`);
				}
				
				const responseData = await apiResponse.json();
				const { downloadUrl } = responseData;
				
				if (!downloadUrl) {
					throw new Error('No download URL received from API');
				}
				
				// Now fetch the actual KMZ file using the signed URL
				fileResponse = await fetch(downloadUrl, {
					mode: 'cors',
					cache: 'no-cache'
				});
				
				if (!fileResponse.ok) {
					throw new Error(`Failed to fetch KMZ file: ${fileResponse.status} ${fileResponse.statusText}`);
				}
			}
			
			const arrayBuffer = await fileResponse.arrayBuffer();
			await processKmzData(arrayBuffer);
		} catch (err) {
			error = 'Error al cargar el archivo KMZ';
		} finally {
			loading = false;
		}
	}

	async function processKmzData(arrayBuffer: ArrayBuffer) {
		if (!browser || !JSZip || !toGeoJSON || !L) return;
		
		try {
			const zip = await JSZip.loadAsync(arrayBuffer);
			const kmlEntry = Object.values(zip.files).find((f) => f.name.endsWith('.kml'));

			if (!kmlEntry) {
				throw new Error('No se encontró la estructura correcta en este archivo.');
			}

			const kmlText = await kmlEntry.async('text');
			const parser = new DOMParser();
			const kmlDom = parser.parseFromString(kmlText, 'application/xml');
			const geojson = toGeoJSON.kml(kmlDom);

			await tick();

			if (currentLayer) {
				map.removeLayer(currentLayer);
			}

			currentLayer = L.geoJSON(geojson).addTo(map);
			map.fitBounds(currentLayer.getBounds());
		} catch (err) {
			throw err;
		}
	}

							function centerMap() {
			if (currentLayer && browser && map) {
				try {
					map.fitBounds(currentLayer.getBounds());
				} catch (error) {
					// Silently handle error
				}
			}
		}

	// Reactive statement to reload when kmzUrl changes
	$: if (kmzUrl && autoLoad && map && browser) {
		loadKmzFromUrl();
	}

    function loadLocations() {
        if (!browser || !map || !locations) return;

        if (locations && locations.length > 0) {
            const typeLabel: Record<string, string> = {
                partida: 'Partida',
                subpartida: 'Subpartida',
                concepto: 'Concepto',
                subconcepto: 'Subconcepto'
            };

            locations.map((loc) => {
                const displayName = loc.name || typeLabel[loc.asset_type] || 'Elemento';
                const typeText = capitalizeFirst(loc.asset_type);
                const info = `
                    <div class="location-popup">
                        <strong>${displayName}</strong><br>
                        <small>${typeText}</small><br>
                        <small>${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</small>
                    </div>
                `;
                return addMarkerWithPopup(loc.latitude, loc.longitude, info, loc.asset_type);
            });
        }
    }

	function addMarkerWithPopup(lat: number, lng: number, info: string, assetType?: string) {
		if (!browser || !map || !L) return;
		
		// Crear marcador con icono personalizado según el tipo de asset
		let markerIcon;
		switch (assetType) {
			case 'partida':
				markerIcon = L.divIcon({
					className: 'custom-marker partida-marker',
					html: '<div class="marker-icon partida">P</div>',
					iconSize: [24, 24],
					iconAnchor: [12, 12]
				});
				break;
			case 'subpartida':
				markerIcon = L.divIcon({
					className: 'custom-marker subpartida-marker',
					html: '<div class="marker-icon subpartida">S</div>',
					iconSize: [20, 20],
					iconAnchor: [10, 10]
				});
				break;
			case 'concepto':
				markerIcon = L.divIcon({
					className: 'custom-marker concepto-marker',
					html: '<div class="marker-icon concepto">C</div>',
					iconSize: [18, 18],
					iconAnchor: [9, 9]
				});
				break;
			case 'subconcepto':
				markerIcon = L.divIcon({
					className: 'custom-marker subconcepto-marker',
					html: '<div class="marker-icon subconcepto">SC</div>',
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				});
				break;
			default:
				markerIcon = L.divIcon({
					className: 'custom-marker default-marker',
					html: '<div class="marker-icon default">•</div>',
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				});
		}
		
		const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
		
		// Bind popup directamente con la información
		marker.bindPopup(info, {
			className: 'location-popup-container',
            maxWidth: 320,
			closeButton: true
		});

		// Add click handler to open popup
		marker.on('click', () => {
			// Close any other open popup first
			map.closePopup();
			// Open this marker's popup
			marker.openPopup();
		});
		
		return marker;
	}

</script>

<div class="relative {className} overflow-hidden">
	{#if browser}
		<div bind:this={mapContainer} class="h-full w-full rounded-lg relative z-0"></div>
		
		{#if loading}
			<div class="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
				<div class="text-white">Cargando mapa...</div>
			</div>
		{/if}
		
		{#if error}
			<div class="absolute top-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
				{error}
			</div>
		{/if}
		
			{#if currentLayer}
		<div class="absolute bottom-4 right-4 z-[1000] pointer-events-auto">
			<button 
				onclick={centerMap}
				class="bg-background hover:bg-accent border border-border px-3 py-2 rounded-md shadow-lg cursor-pointer text-sm font-medium transition-colors text-foreground"
			>
				Centrar vista
			</button>
		</div>
	{/if}
	{:else}
		<!-- Server-side rendering fallback -->
		<div class="h-full w-full rounded-lg bg-gray-100 flex items-center justify-center">
			<div class="text-gray-500">Cargando mapa...</div>
		</div>
	{/if}
</div>

<style>
    :global(.custom-marker) {
        background: transparent;
        border: none;
    }
    
    :global(.marker-icon) {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
    }
    
    :global(.partida) {
        background-color: #3b82f6;
        width: 24px;
        height: 24px;
    }
    
    :global(.subpartida) {
        background-color: #10b981;
        width: 20px;
        height: 20px;
    }
    
    :global(.concepto) {
        background-color: #f59e0b;
        width: 18px;
        height: 18px;
    }
    
    :global(.subconcepto) {
        background-color: #ef4444;
        width: 16px;
        height: 16px;
    }
    
    :global(.default) {
        background-color: #6b7280;
        width: 16px;
        height: 16px;
    }
    
    :global(.location-popup-container .leaflet-popup-content-wrapper) {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    :global(.location-popup-container .leaflet-popup-content) {
        margin: 12px;
        line-height: 1.4;
    }
    
    :global(.location-popup) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    :global(.location-popup strong) {
        color: #1f2937;
        font-size: 14px;
    }
    
    :global(.location-popup small) {
        color: #6b7280;
        font-size: 12px;
    }
</style>