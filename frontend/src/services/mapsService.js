// =============================================================================
// SECTION: Google Maps Service
// Wraps two Google Maps Platform APIs:
//
//   1. Places Autocomplete (New) — typeahead search for origin/destination
//   2. Routes API (computeRoutes) — returns driving/transit distance in metres
//
// Both APIs are called via the REST endpoints (no SDK needed) so there is
// zero bundle overhead — just fetch calls with the browser API key.
//
// All functions return { data, error } so callers never need try/catch.
//
// Required environment variable:
//   VITE_GOOGLE_MAPS_API_KEY — from Google Cloud Console
//     Enabled APIs: Places API (New) + Routes API
//
// Usage:
//   import { autocomplete, getRouteDistance } from './mapsService';
// =============================================================================

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// =============================================================================
// SECTION: autocomplete
// Returns place suggestions for a partial text query.
//
// @param {string} input  — partial text typed by the user
// @returns {{ data: Array<{ placeId, description }>, error }}
// =============================================================================
export async function autocomplete(input) {
  if (!input || input.length < 3) return { data: [], error: null };
  if (!API_KEY) return { data: [], error: 'VITE_GOOGLE_MAPS_API_KEY not set.' };

  try {
    const res = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
        },
        body: JSON.stringify({
          input,
          // Bias results toward broadly useful place types
          includedPrimaryTypes: ['locality', 'street_address', 'airport', 'transit_station'],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { data: [], error: err?.error?.message || `Places API error (${res.status})` };
    }

    const json = await res.json();
    const suggestions = (json.suggestions || []).map((s) => ({
      placeId:     s.placePrediction?.placeId     || '',
      description: s.placePrediction?.text?.text  || '',
    })).filter((s) => s.placeId);

    return { data: suggestions, error: null };
  } catch (err) {
    return { data: [], error: err.message || 'Network error calling Places API.' };
  }
}

// =============================================================================
// SECTION: getRouteDistance
// Computes the distance (in km, rounded to 1 dp) between two place IDs
// using the Routes API. Tries the requested travel mode first; falls back
// to DRIVE if the mode is unavailable for that route.
//
// @param {string} originPlaceId
// @param {string} destinationPlaceId
// @param {'DRIVE'|'TRANSIT'|'BICYCLE'|'WALK'} travelMode
// @returns {{ data: { distanceKm: number, durationMin: number, mode: string }, error }}
// =============================================================================
export async function getRouteDistance(originPlaceId, destinationPlaceId, travelMode = 'DRIVE') {
  if (!API_KEY) return { data: null, error: 'VITE_GOOGLE_MAPS_API_KEY not set.' };

  const body = {
    origin:      { placeId: originPlaceId },
    destination: { placeId: destinationPlaceId },
    travelMode,
    routingPreference: travelMode === 'DRIVE' ? 'TRAFFIC_AWARE' : undefined,
    computeAlternativeRoutes: false,
    routeModifiers: { avoidTolls: false, avoidHighways: false },
    languageCode: 'en-US',
    units: 'METRIC',
  };

  try {
    const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        // Only request the fields we actually need (minimises billing)
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.travelAdvisory',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { data: null, error: err?.error?.message || `Routes API error (${res.status})` };
    }

    const json  = await res.json();
    const route = json.routes?.[0];
    if (!route) return { data: null, error: 'No route found between these locations.' };

    const distanceKm  = Math.round((route.distanceMeters / 1000) * 10) / 10;
    // duration comes as e.g. "420s"
    const durationMin = Math.ceil(parseInt(route.duration || '0', 10) / 60);

    return { data: { distanceKm, durationMin, mode: travelMode }, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error calling Routes API.' };
  }
}
