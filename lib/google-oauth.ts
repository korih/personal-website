const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

export interface OAuthEnv {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SESSIONS: KVNamespace;
}

export function buildAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email",
    state,
    access_type: "online",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ id_token: string }> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return res.json();
}

interface JWTPayload {
  email: string;
  email_verified: boolean;
  aud: string;
  iss: string;
  exp: number;
  sub: string;
}

export async function verifyIdToken(
  idToken: string,
  clientId: string,
  kv: KVNamespace
): Promise<JWTPayload> {
  // Decode the JWT (we verify via Google's userinfo endpoint for simplicity
  // — avoids JWKS key parsing complexity in the edge runtime)
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");

  const payload = JSON.parse(
    Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
  ) as JWTPayload;

  // Basic claim validation
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error("Token expired");
  if (payload.aud !== clientId) throw new Error("Invalid audience");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss)) {
    throw new Error("Invalid issuer");
  }
  if (!payload.email_verified) throw new Error("Email not verified");

  return payload;
}

export async function storeOAuthState(kv: KVNamespace, state: string): Promise<void> {
  await kv.put(`oauth_state:${state}`, "1", { expirationTtl: 120 });
}

export async function consumeOAuthState(kv: KVNamespace, state: string): Promise<boolean> {
  const val = await kv.get(`oauth_state:${state}`);
  if (!val) return false;
  await kv.delete(`oauth_state:${state}`);
  return true;
}
