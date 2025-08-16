import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Define the location of your markdown posts.  The files should reside in
// `<projectRoot>/posts` and use `.md` extensions.  At build time these files
// are read from the filesystem by Next.js via getStaticProps.
// When Next.js executes `getStaticProps` or related functions, process.cwd()
// refers to the root of the project (where package.json resides).  Our posts
// live under the `posts` directory at the project root, so join it here.
const postsDirectory = path.join(process.cwd(), 'posts');

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

/**
 * Read all markdown files in the posts directory, parse their front matter and
 * return an array of post metadata sorted by date descending.
 */
export function getSortedPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        categories: Array.isArray(data.categories)
          ? (data.categories as string[])
          : [],
        excerpt: data.excerpt as string,
        image: data.image as string | undefined,
      } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

/**
 * Given a post slug, read the corresponding markdown file, parse its front
 * matter and content, and convert the markdown body into HTML.  The
 * returned object contains the post metadata and its HTML content.
 */
export async function getPostData(slug: string): Promise<{
  meta: PostMeta;
  contentHtml: string;
}> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  return {
    meta: {
      slug,
      title: data.title as string,
      date: data.date as string,
      categories: Array.isArray(data.categories)
        ? (data.categories as string[])
        : [],
      excerpt: data.excerpt as string,
      image: data.image as string | undefined,
    },
    contentHtml,
  };
}

/**
 * Gather all unique categories across your posts.  Categories are returned
 * alphabetically so that navigation appears predictable.
 */
export function getAllCategories(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const categoriesSet = new Set<string>();
  fileNames.forEach((fileName) => {
    if (!fileName.endsWith('.md')) return;
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    const cats = data.categories as string[] | undefined;
    if (Array.isArray(cats)) {
      cats.forEach((cat) => categoriesSet.add(cat));
    }
  });
  return Array.from(categoriesSet).sort();
}

/**
 * Retrieve all posts that belong to a specific category.  Posts are sorted
 * by date descending.  Category names should match the slugs used in
 * front matter (e.g. 'it-solutions').
 */
export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getSortedPosts();
  return posts.filter((post) => post.categories.includes(category));
}