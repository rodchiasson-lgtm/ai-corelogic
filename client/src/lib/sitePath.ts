/**
 * Prefix a root-relative path with the deploy base (Vite `base`), so the site works
 * both at a domain root (ai-corelogic.manus.space) and under a sub-path
 * (rodchiasson-lgtm.github.io/ai-corelogic/). Non-root paths are returned unchanged.
 */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function sitePath(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path;
}

/** True when the current page is the home page (with or without a trailing slash). */
export function isHomePath(pathname = window.location.pathname): boolean {
  return pathname === sitePath("/") || pathname === BASE_PATH || pathname === "/";
}
