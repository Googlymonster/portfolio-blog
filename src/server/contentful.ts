import type { PostMeta } from '../lib/posts';

/**
 * Helper to ensure required environment variables are defined.  Throws
 * an error if the variable is missing so that misconfigurations are
 * surfaced at runtime rather than silently failing.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Retrieve configuration for Contentful API.  Reads from
 * process.env at call time so that these values are not inlined
 * into client bundles.  Consumers should call this inside server
 * functions (getStaticProps, getStaticPaths) to avoid leaking
 * secrets.
 */
function getCfg() {
  const spaceId = required('CONTENTFUL_SPACE_ID', process.env.CONTENTFUL_SPACE_ID);
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
  const token = required('CONTENTFUL_ACCESS_TOKEN', process.env.CONTENTFUL_ACCESS_TOKEN);
  return { spaceId, environment, token };
}

const BASE_URL = 'https://cdn.contentful.com';

/**
 * Fetch all published posts from Contentful.  Returns an array of
 * PostMeta objects containing only the metadata needed for listing and
 * previews.  Filters out any entries lacking a slug or title to
 * prevent Next.js serialization errors.
 */
export async function fetchPosts(): Promise<PostMeta[]> {
  const { spaceId, environment, token } = getCfg();
  const url = new URL(`${BASE_URL}/spaces/${spaceId}/environments/${environment}/entries`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('content_type', 'post');
  url.searchParams.set('include', '2');
  url.searchParams.set('order', '-fields.date');
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch posts from Contentful: ${res.status}`);
  }
  const data = await res.json();
  // Map of asset ID to asset entry, used for resolving images
  const assets = new Map<string, any>();
  // Map of category entry ID to entry
  const categories = new Map<string, any>();
  if (data.includes) {
    (data.includes.Asset || []).forEach((asset: any) => {
      assets.set(asset.sys.id, asset);
    });
    (data.includes.Entry || []).forEach((entry: any) => {
      if (entry.sys.contentType?.sys?.id === 'category') {
        categories.set(entry.sys.id, entry);
      }
    });
  }
  const posts: PostMeta[] = (data.items || []).map((item: any) => {
    const f = item.fields || {};
    const slug: string | undefined = f.slug;
    const title: string | undefined = f.title;
    const date: string | undefined = f.date;
    const excerpt: string = f.excerpt || '';
    // Resolve categories into slugified strings
    const catRefs: any[] = f.categories || [];
    const catSlugs: string[] = catRefs
      .map((ref: any) => categories.get(ref.sys.id))
      .filter(Boolean)
      .map((cat: any) => (cat.fields.slug || cat.fields.name).toLowerCase().replace(/\s+/g, '-'));
    // Resolve image URL if present
    let image: string | undefined;
    if (f.image && f.image.sys && assets.has(f.image.sys.id)) {
      const asset = assets.get(f.image.sys.id);
      const fileUrl: string | undefined = asset.fields?.file?.url;
      if (fileUrl) {
        image = fileUrl.startsWith('http') ? fileUrl : `https:${fileUrl}`;
      }
    }
    return {
      slug,
      title,
      date,
      categories: catSlugs,
      excerpt,
      image,
    } as PostMeta;
  });
  // Filter out incomplete posts
  return posts.filter((p) => !!p.slug && !!p.title);
}

/**
 * Fetch a single post by slug.  Returns the normalized PostMeta and
 * raw content string.  If the post is not found, returns null.  The
 * content field from Contentful should be stored as Markdown or plain
 * text; conversion to HTML happens in the page layer.
 */
export async function fetchPost(slug: string): Promise<{ post: PostMeta; content: string } | null> {
  const { spaceId, environment, token } = getCfg();
  const url = new URL(`${BASE_URL}/spaces/${spaceId}/environments/${environment}/entries`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('content_type', 'post');
  url.searchParams.set('fields.slug', slug);
  url.searchParams.set('limit', '1');
  url.searchParams.set('include', '2');
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch post from Contentful: ${res.status}`);
  }
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  // Use fetchPosts to normalise metadata for all posts
  const posts = await fetchPosts();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return null;
  const content: string = item.fields?.content || '';
  return { post: meta, content };
}

/**
 * Extract unique category slugs from posts.  Useful for generating
 * category filter lists.
 */
export function extractCategories(posts: PostMeta[]): string[] {
  const set = new Set<string>();
  posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}