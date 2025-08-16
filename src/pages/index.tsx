import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
// We use Contentful as the headless CMS for this site.  All data is
// fetched server-side via dynamic imports in getStaticProps/Paths to
// avoid exposing environment variables to the client.  See
// src/server/contentful.ts for the implementation.
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
  // Dynamically import server-side helpers.  This prevents env vars
  // from leaking into the client bundle.  Note: do not move this
  // import to the top of the file.
  const { fetchPosts, extractCategories } = await import('../server/contentful');
  let posts = await fetchPosts();
  // Filter out incomplete posts (missing slug/title)
  posts = posts.filter((p) => p.slug && p.title);
  const categories = extractCategories(posts);
  return {
    props: {
      posts,
      categories,
    },
  };
};