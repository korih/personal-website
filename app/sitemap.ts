import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://korih.dev";

async function getPublishedSlugs(): Promise<{
  posts: string[];
  movieSlugs: string[];
  lnSlugs: string[];
  projectSlugs: string[];
}> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listPublishedPosts, listPublishedReviews, listProjects } = await import("@/lib/db");
    const env = await getEnv();

    const [posts, movies, lns, projects] = await Promise.all([
      listPublishedPosts(env.DB, 1000),
      listPublishedReviews(env.DB, "movie", 1000),
      listPublishedReviews(env.DB, "light_novel", 1000),
      listProjects(env.DB),
    ]);

    return {
      posts: posts.map((p) => p.slug),
      movieSlugs: movies.map((r) => r.slug),
      lnSlugs: lns.map((r) => r.slug),
      projectSlugs: projects.map((p) => p.slug),
    };
  } catch {
    return { posts: [], movieSlugs: [], lnSlugs: [], projectSlugs: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, movieSlugs, lnSlugs, projectSlugs } = await getPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/reviews`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/reviews/movies`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/reviews/light-novels`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/projects`, priority: 0.8, changeFrequency: "monthly" },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...posts.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      priority: 0.7 as const,
      changeFrequency: "monthly" as const,
    })),
    ...movieSlugs.map((slug) => ({
      url: `${SITE_URL}/reviews/movies/${slug}`,
      priority: 0.6 as const,
      changeFrequency: "never" as const,
    })),
    ...lnSlugs.map((slug) => ({
      url: `${SITE_URL}/reviews/light-novels/${slug}`,
      priority: 0.6 as const,
      changeFrequency: "never" as const,
    })),
    ...projectSlugs.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      priority: 0.6 as const,
      changeFrequency: "monthly" as const,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
