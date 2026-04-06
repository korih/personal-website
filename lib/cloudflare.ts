import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface CloudflareEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  SESSIONS: KVNamespace;
  ADMIN_EMAIL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXT_PUBLIC_SITE_URL: string;
}

export async function getEnv(): Promise<CloudflareEnv> {
  const ctx = await getCloudflareContext({ async: true });
  return ctx.env as unknown as CloudflareEnv;
}
