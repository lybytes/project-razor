// Stores a same-device redirect target set by our own code (e.g. the lesson
// completion wall) so the auth page can send a learner straight back into the
// course after signup/confirmation instead of dropping them on /account.
// Uses localStorage (not sessionStorage) because email confirmation links
// commonly open in a new tab on the same device/browser — the supported
// recovery path per product scope. Never populated from user input or URL
// params — the value is always a path we constructed ourselves — so there's
// no open-redirect risk.
const KEY = "project-razor-post-auth-redirect";

export function setPostAuthRedirect(path: string) {
  localStorage.setItem(KEY, path);
}

export function consumePostAuthRedirect(): string | null {
  const value = localStorage.getItem(KEY);
  localStorage.removeItem(KEY);
  return value;
}
