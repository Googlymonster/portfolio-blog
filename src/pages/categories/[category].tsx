import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import {
  getAllCategories,
  getPostsByCategory,
  PostMeta,
} from '../../lib/posts';
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
  const categories = getAllCategories();
  const paths = categories.map((category) => ({ params: { category } }));
  return {
    paths,
    fallback: false,
  };
};

// Preload posts for a given category and all categories for the navigation bar.
export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const category = params?.category as string;
  const posts = getPostsByCategory(category);
  return {
    props: {
      category,
      posts,
    },
  };
};