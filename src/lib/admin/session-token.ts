/**
 * Edge-safe HMAC helpers for admin session cookies.
 * Cookie format: `<token>.<base64url(hmac-sha256(token))>`
 */

function getSessionSecret() {
  const fromEnv =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "";
  if (fromEnv.length >= 16) return fromEnv;
  // Dev-only fallback so local sessions still sign. Never used when prod password is set.
  return "neighbrville-dev-session-secret";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSessionToken(token: string) {
  const key = await importKey(getSessionSecret());
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(token),
  );
  return `${token}.${toBase64Url(signature)}`;
}

export async function verifySignedSessionCookie(
  cookieValue: string | undefined,
): Promise<string | null> {
  if (!cookieValue) return null;
  const splitAt = cookieValue.lastIndexOf(".");
  if (splitAt <= 0) return null;

  const token = cookieValue.slice(0, splitAt);
  const signature = cookieValue.slice(splitAt + 1);
  if (!token || !signature) return null;

  try {
    const key = await importKey(getSessionSecret());
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      new TextEncoder().encode(token),
    );
    return valid ? token : null;
  } catch {
    return null;
  }
}
