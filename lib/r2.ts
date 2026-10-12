/**
 * Returns the full permanent public URL for a given R2 storage key.
 * If already an absolute HTTP/HTTPS URL, returns it unchanged.
 */
export function getR2PublicUrl(keyOrUrl?: string | null): string {
  if (!keyOrUrl) return "";
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }
  const baseUrl = (
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    process.env.CF_PUBLIC_URL ||
    process.env.R2_PUBLIC_URL ||
    ""
  ).replace(/\/+$/, "");

  const cleanKey = keyOrUrl.replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${cleanKey}` : `/${cleanKey}`;
}
