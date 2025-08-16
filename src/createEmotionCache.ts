import createCache from '@emotion/cache';

/**
 * Create an Emotion cache configured to inject styles at the top of the
 * `<head>` element.  This is required for Material UI to avoid a mismatch
 * between server‑rendered and client‑rendered class names.
 */
export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}