import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import type { PostMeta } from '../../lib/posts';
// This page lists posts in a given category.  Contentful helpers
// are imported dynamically within getStaticProps/Paths to avoid
// exposing environment variables to the client.
// Do not import Contentful helpers at the top level.  We will
// dynamically import them inside getStaticProps and getStaticPaths to
// avoid bundling environment variables into client code.
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
  // Dynamically import Contentful helpers.  This ensures env vars are
  // accessed only on the server during build time.
  const { fetchPosts, extractCategories } = await import('../../server/contentful');
  let posts = await fetchPosts();
  posts = posts.filter((p) => p.slug && p.title);
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
  // Dynamically import Contentful helpers to avoid leaking env vars
  // into the client bundle.  Fetch all posts and filter by category.
  const { fetchPosts } = await import('../../server/contentful');
  let posts = await fetchPosts();
  posts = posts.filter((p) => p.slug && p.title);
  const filtered = posts.filter((p) => p.categories.includes(category));
  return {
    props: {
      category,
      posts: filtered,
    },
  };
};