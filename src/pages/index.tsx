import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import { getSortedPosts, getAllCategories, PostMeta } from '../lib/posts';

interface HomeProps {
  posts: PostMeta[];
  categories: string[];
}

/**
 * The home page lists all blog posts and allows optional filtering by category.
 * Users can click on a category chip to filter the posts displayed.  The
 * navigation bar also shows all available categories.
 */
export default function Home({ posts, categories }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Determine which posts to show based on the selected category.
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.categories.includes(selectedCategory))
    : posts;

  // Provide a handler for category chip clicks.  Clicking the same chip twice
  // toggles it off.
  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Latest Posts
        </Typography>
        {/* Filter chips: 'All' resets the selection, followed by each category. */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
          {/* Filter buttons: 'All' resets the selection, followed by each tag. */}
          <Button
            variant={selectedCategory === null ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => handleCategoryClick(category)}
              sx={{ textTransform: 'none' }}
            >
              {category.replace(/-/g, ' ')}
            </Button>
          ))}
        </Stack>
        <PostList posts={filteredPosts} />
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Fetch all posts and categories at build time.  Because the data lives in
  // the filesystem, these operations are synchronous.
  const posts = getSortedPosts();
  const categories = getAllCategories();
  return {
    props: {
      posts,
      categories,
    },
  };
};