/**
 * api/api.js
 *
 * Thin wrapper around fetch for communicating with the Express backend.
 * All meal endpoints are relative to BACKEND_ORIGIN.
 */

const BACKEND_ORIGIN = 'http://localhost:3002';

/**
 * Perform a fetch request and parse the JSON response.
 * Throws a descriptive Error for non-2xx responses.
 *
 * @param {string} path     - e.g. '/api/meals' or '/api/meals/3'
 * @param {RequestInit} [options] - fetch options (method, body, headers, …)
 * @returns {Promise<any>}  - parsed JSON body
 */
export async function apiRequest(path, options = {}) {
  const url = `${BACKEND_ORIGIN}${path}`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    // Try to pull an error message from the JSON body, fall back to status text.
    let message = response.statusText;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(`HTTP ${response.status}: ${message}`);
  }

  // 204 No Content – nothing to parse
  if (response.status === 204) return null;

  return response.json();
}

// ---------------------------------------------------------------------------
// Meal-specific helpers (thin wrappers around apiRequest)
// ---------------------------------------------------------------------------

/** Fetch the full list of meals. */
export const getMeals = ()           => apiRequest('/api/meals');

/** Fetch a single meal by id. */
export const getMeal  = (id)         => apiRequest(`/api/meals/${id}`);

/** Create a new meal. */
export const createMeal = (data)     => apiRequest('/api/meals', { method: 'POST', body: JSON.stringify(data) });

/** Replace all fields of an existing meal. */
export const updateMeal = (id, data) => apiRequest(`/api/meals/${id}`, { method: 'PUT',  body: JSON.stringify(data) });

/** Delete a meal by id. */
export const deleteMeal = (id)       => apiRequest(`/api/meals/${id}`, { method: 'DELETE' });

