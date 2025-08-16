import { PostMeta } from './posts';

/**
 * Helpers to fetch blog content from a Strapi backend.
 *
 * Strapi exposes a REST API under /api. Each collection type is available
 * at `/api/<collection>` with optional query parameters for filtering and
 * population of relations. See https://docs.strapi.io/dev-docs/api/rest
 * for more details.
 *
 * These functions expect an environment variable STRAPI_URL to be set to
 * the base URL of your Strapi instance. During local development this
 * might be http://localhost:1337, while in production it could point to
 * your hosted Strapi domain. If STRAPI_URL is not defined, the default
 * fallback is http://localhost:1337.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * Convert a raw Strapi post record into the PostMeta shape used by the
 * frontend.  Strapi wraps records under an `attributes` key and stores
 * relations (such as categories and image) under a `data` property.  This
 * helper flattens the structure and prefixes relative image URLs with
 * STRAPI_URL so that <img> tags in Next.js resolve correctly.
 */
function normalizePost(item: any): PostMeta {
  const attrs = item.attributes;
  // Extract categories as slugs or names. Strapi collection types can define
  // a UID for categories. If a slug is present, use it; otherwise fall back
  // to the name converted to a kebab-case string.
  const categories: string[] = (attrs.categories?.data || []).map(
    (cat: any) => {
      const c = cat.attributes;
      // Prefer slug if available; otherwise derive slug from name by
      // lowercasing and replacing spaces with dashes.
      return c.slug || c.name.toLowerCase().replace(/\s+/g, '-');
    },
  );
  // Build a full image URL if an image relation exists. Strapi stores
  // uploaded files under the `/uploads` path by default. Prefix the
  // relative URL with STRAPI_URL so the frontend can fetch it.
  let image: string | undefined;
  if (attrs.image?.data?.attributes?.url) {
    const url: string = attrs.image.data.attributes.url;
    image = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return {
    slug: attrs.slug,
    title: attrs.title,
    date: attrs.date,
    categories,
    excerpt: attrs.excerpt || '',
    image,
  };
}

/**
 * Fetch a list of posts from Strapi.  Posts are returned in descending
 * chronological order.  The `populate` query tells Strapi to include
 * category and image relations in the response.  Without this parameter
 * these fields would be undefined.
 */
export async function fetchPosts(): Promise<PostMeta[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/posts?populate=categories,image&sort=date:desc`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  const json = await res.json();
  return (json.data || []).map(normalizePost);
}

/**
 * Fetch a single post by slug.  Strapi allows filtering by arbitrary
 * fields using `filters`.  We request population of categories and image
 * just like in fetchPosts.  The returned object includes both the
 * PostMeta information and the raw content string.  Strapi does not
 * automatically convert Markdown to HTML, so the caller may need to
 * perform conversion if the `content` field contains Markdown.
 */
export async function fetchPost(
  slug: string,
): Promise<{ post: PostMeta; content: string }> {
  const res = await fetch(
    `${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}&populate=categories,image`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.status}`);
  }
  const json = await res.json();
  const item = json.data?.[0];
  if (!item) {
    throw new Error(`Post with slug ${slug} not found`);
  }
  const attrs = item.attributes;
  const post = normalizePost(item);
  // Strapi stores content in a field named `content`. If you used a rich
  // text editor, this will already be HTML; if you stored Markdown, you
  // may need to convert it to HTML on the client or server.
  return {
    post,
    content: attrs.content || '',
  };
}

/**
 * Derive a sorted list of unique category slugs from a list of posts.
 * This helper is useful on the homepage to build filter buttons.
 */
export function extractCategories(posts: PostMeta[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}