import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import type { PostMeta } from '../../lib/posts';
// Import helpers from Contentful.  We'll fetch all posts and filter
// them by category on the client side.  extractCategories is used to
// build the list of unique categories when generating paths.
import { fetchPosts, extractCategories } from '../../lib/contentful';
import PostList from '../../components/PostList';

interface CategoryPageProps {
  category: string;
  posts: PostMeta[];
}

/**
 * CategoryPage lists all posts belonging to a specific category.  The URL
 * parameter corresponds to the category slug defined in each post's front
 * matter.  Posts are displayed in a responsive grid via the PostList
 * component.
 */
export default function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {category.replace(/-/g, ' ').toUpperCase()}
        </Typography>
        <PostList posts={posts} />
      </Box>
    </Layout>
  );
}

// Generate a path for each unique category across all posts.
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all posts to build the list of categories.  Contentful does
  // not provide a separate categories endpoint by default, so we
  // derive the list from post metadata.  Each category slug becomes
  // a static path.  If you have hundreds of posts, you may want to
  // implement pagination or fetch categories via a dedicated content
  // type.
  const posts = await fetchPosts();
  const categories = extractCategories(posts);
  const paths = categories.map((category) => ({ params: { category } }));
  return {
    paths,
    fallback: false,
  };
};

// Preload posts for a given category and all categories for the navigation bar.
export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const category = params?.category as string;
  // Fetch all posts and filter by category slug.  Posts store
  // categories as an array of slugified names.  If you need to
  // localise or display different labels, adjust the mapping here.
  const posts = await fetchPosts();
  const filtered = posts.filter((p) => p.categories.includes(category));
  return {
    props: {
      category,
      posts: filtered,
    },
  };
};