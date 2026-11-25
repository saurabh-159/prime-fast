/**
 * When true, the storefront reads catalog/home/content from JSON
 * (data/batteries.json + data/ui-content.json) and skips MongoDB.
 *
 * Default: on whenever MONGODB_URI is missing (Vercel UI preview),
 * or when USE_STATIC_DATA=1 is set explicitly.
 */
export function useStaticData() {
  if (process.env.USE_STATIC_DATA === '1' || process.env.USE_STATIC_DATA === 'true') return true;
  if (process.env.USE_STATIC_DATA === '0' || process.env.USE_STATIC_DATA === 'false') return false;
  return !process.env.MONGODB_URI;
}
