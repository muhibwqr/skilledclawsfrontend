/**
 * API base URL for the SkilledClaws backend (muhibwqr/skilledclaws).
 * In dev with proxy: use '' so fetch('/api/...') goes via Vite proxy to localhost:3001.
 * Without proxy: set VITE_API_URL=http://localhost:3001 in .env
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? ''
