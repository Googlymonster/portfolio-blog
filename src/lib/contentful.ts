import type { PostMeta } from './posts';

/**
 * Helpers to fetch blog content from Contentful.
 *
 * Contentful exposes a Content Delivery API (CDA) at
 * `https://cdn.contentful.com/spaces/{spaceId}/environments/{environment}/entries`.
 * You must provide a space ID and an access token with read access.  Set
 * these values via the CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN
 * environment variables.  Optionally, override the environment (defaults
 * to `master`) via CONTENTFUL_ENVIRONMENT.
 */

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE_ID || !ACCESS_TOKEN) {
  throw new Error('Contentful space ID and access token must be set in environment variables');
}

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

/**
 * Fetch all posts from Contentful.  We request `include=2` so that linked
 * entries (categories) and assets (images) are returned in the same
 * response.  Posts are sorted by descending date.  The returned
 * PostMeta objects include slug, title, date, excerpt, categories and
 * image URL.  Category slugs are derived from the linked category
 * entries (using the `slug` field if present, otherwise the `name`).
 */
export async function fetchPosts(): Promise<PostMeta[]> {
  const url =
    `${BASE_URL}/entries` +
    `?access_token=${ACCESS_TOKEN}` +
    `&content_type=post` +
    `&include=2` +
    `&order=-fields.date`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts from Contentful: ${res.status}`);
  }
  const data = await res.json();
  // Build maps of linked assets and categories for easy lookup.
  const assetsMap: Record<string, any> = {};
  const categoriesMap: Record<string, any> = {};
  if (data.includes) {
    (data.includes.Asset || []).forEach((asset: any) => {
      assetsMap[asset.sys.id] = asset;
    });
    (data.includes.Entry || []).forEach((entry: any) => {
      if (entry.sys.contentType?.sys?.id === 'category') {
        categoriesMap[entry.sys.id] = entry;
      }
    });
  }
  return (data.items || []).map((item: any) => {
    const fields = item.fields;
    // Resolve categories.
    const categoryRefs = fields.categories || [];
    const categories: string[] = categoryRefs.map((ref: any) => {
      const cat = categoriesMap[ref.sys.id];
      if (!cat) return 'unknown';
      const catSlug = cat.fields.slug || cat.fields.name;
      return catSlug.toLowerCase().replace(/\s+/g, '-');
    });
    // Resolve image.
    let image: string | undefined;
    if (fields.image && fields.image.sys && assetsMap[fields.image.sys.id]) {
      const asset = assetsMap[fields.image.sys.id];
      image = asset.fields?.file?.url;
      if (image && image.startsWith('//')) {
        image = `https:${image}`;
      }
    }
    return {
      slug: fields.slug,
      title: fields.title,
      date: fields.date,
      categories,
      excerpt: fields.excerpt || '',
      image,
    } as PostMeta;
  });
}

/**
 * Fetch a single post from Contentful by its slug.  We request a
 * filter on the slug and include linked entries and assets.  The
 * returned object contains the PostMeta information and the raw
 * content string (which may be Markdown or Rich Text depending on your
 * Contentful setup).  If you store content as Markdown, you will need
 * to convert it to HTML on the client or server.
 */
export async function fetchPost(slug: string): Promise<{
  post: PostMeta;
  content: string;
}> {
  const url =
    `${BASE_URL}/entries` +
    `?access_token=${ACCESS_TOKEN}` +
    `&content_type=post` +
    `&include=2` +
    `&fields.slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch post from Contentful: ${res.status}`);
  }
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) {
    throw new Error(`Post with slug ${slug} not found`);
  }
  const posts = await fetchPosts();
  // Find the matching PostMeta in the list (to reuse normalization logic).
  const meta = posts.find((p) => p.slug === slug);
  const content: string = item.fields.content || '';
  return {
    post: meta as PostMeta,
    content,
  };
}

/**
 * Extract a list of unique categories from an array of posts, sorted
 * alphabetically.  This helper can be used to build filter lists for
 * category pages.
 */
export function extractCategories(posts: PostMeta[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}