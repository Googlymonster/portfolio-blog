// NOTE: This file previously contained helpers to read Markdown files from
// the local `posts` directory.  In the Strapi migration, we only retain
// the `PostMeta` interface so that type definitions remain consistent.

/**
 * A lightweight representation of a post used for listings and previews.  The
 * `slug` corresponds to the filename without the `.md` extension.  The
 * `categories` property contains an array of slugified category names.
 */
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  excerpt: string;
  image?: string;
}