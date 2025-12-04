// Centralized fetch utility that handles unauthorized responses

let onUnauthorizedCallback = null;

export function setUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback;
}

export async function authFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);

    // If unauthorized, trigger the global handler
    if (response.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    // Re-throw network errors or other fetch errors
    throw error;
  }
}
