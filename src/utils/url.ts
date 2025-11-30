/**
 * URL utility functions for shareable calculator links
 */

const QUERY_PARAM = 'c';

/**
 * Encodes content to a URL-safe base64 string
 */
export function encodeContentForURL(content: string): string {
  if (!content) return '';

  try {
    // Use btoa for base64 encoding, then make it URL-safe
    const base64 = btoa(encodeURIComponent(content));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding content for URL:', error);
    return '';
  }
}

/**
 * Decodes content from a URL-safe base64 string
 */
export function decodeContentFromURL(encoded: string): string {
  if (!encoded) return '';

  try {
    // Convert URL-safe base64 back to standard base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    // Decode base64 and then URI component
    return decodeURIComponent(atob(base64));
  } catch (error) {
    console.error('Error decoding content from URL:', error);
    return '';
  }
}

/**
 * Gets content from the current URL query parameter
 */
export function getContentFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(QUERY_PARAM);

  if (!encoded) return null;

  return decodeContentFromURL(encoded);
}

/**
 * Updates the browser URL with encoded content (without page reload)
 */
export function updateURL(content: string): void {
  const encoded = encodeContentForURL(content);
  const url = new URL(window.location.href);

  if (encoded) {
    url.searchParams.set(QUERY_PARAM, encoded);
  } else {
    url.searchParams.delete(QUERY_PARAM);
  }

  // Use replaceState to avoid adding to browser history on every change
  window.history.replaceState({}, '', url.toString());
}

/**
 * Creates a shareable URL with the given content
 */
export function createShareableURL(content: string): string {
  const encoded = encodeContentForURL(content);
  const url = new URL(window.location.origin + window.location.pathname);

  if (encoded) {
    url.searchParams.set(QUERY_PARAM, encoded);
  }

  return url.toString();
}

/**
 * Clears the content parameter from the URL
 */
export function clearURLParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(QUERY_PARAM);
  window.history.replaceState({}, '', url.toString());
}
