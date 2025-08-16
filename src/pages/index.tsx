import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
// Use Strapi as the content backend instead of reading Markdown files from
// the filesystem.  The fetchPosts and extractCategories helpers come from
// lib/strapi and communicate with your Strapi instance via REST API.
// Use Contentful as the content backend instead of reading Markdown files or
// talking to Strapi.  The fetchPosts and extractCategories helpers come
// from lib/contentful and communicate with Contentful's Content Delivery
// API via REST.  Ensure you have set CONTENTFUL_SPACE_ID and
// CONTENTFUL_ACCESS_TOKEN in your environment (e.g. via .env.local) when
// building locally or deploying on Netlify.
import { fetchPosts, extractCategories } from '../lib/contentful';
import type { PostMeta } from '../lib/posts';

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
  // Fetch all posts from Strapi at build time.  Note that this call
  // requires a reachable Strapi instance (configured via the STRAPI_URL
  // environment variable).  Posts are sorted by date descending in
  // the helper itself.  We derive the list of categories from the
  // posts rather than relying on a separate endpoint.
  const posts = await fetchPosts();
  const categories = extractCategories(posts);
  return {
    props: {
      posts,
      categories,
    },
  };
};