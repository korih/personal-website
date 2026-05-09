import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://korih.dev";

async function getPublishedSlugs(): Promise<{
  posts: string[];
  reviews: { slug: string; media_type: string }[];
  projectSlugs: string[];
}> {
  try {
    const { getEnv } = await import("@/lib/cloudflare");
    const { listPublishedPosts, listPublishedReviews, listProjects } = await import("@/lib/db");
    const env = await getEnv();

    const [posts, reviews, projects] = await Promise.all([
      listPublishedPosts(env.DB, 1000),
      listPublishedReviews(env.DB, undefined, 1000),
      listProjects(env.DB),
    ]);

    return {
      posts: posts.map((p) => p.slug),
      reviews: reviews.map((r) => ({ slug: r.slug, media_type: r.media_type })),
      projectSlugs: projects.map((p) => p.slug),
    };
  } catch {
    return { posts: [], reviews: [], projectSlugs: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, reviews, projectSlugs } = await getPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/reviews`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/projects`, priority: 0.8, changeFrequency: "monthly" },
  ];

  const reviewTypePaths: Record<string, string> = {
    movie: "movies",
    light_novel: "light-novels",
    manga: "manga",
    anime: "anime",
  };

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...posts.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      priority: 0.7 as const,
      changeFrequency: "monthly" as const,
    })),
    ...reviews.map((review) => ({
      url: `${SITE_URL}/reviews/${reviewTypePaths[review.media_type]}/${review.slug}`,
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
