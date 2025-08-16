import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import Layout from '../../components/Layout';
import {
  getSortedPosts,
  getPostData,
  PostMeta,
} from '../../lib/posts';

interface PostPageProps {
  post: PostMeta;
  contentHtml: string;
}

/**
 * PostPage renders the full content of a blog post.  It displays the post
 * title, publication date, list of categories, and HTML content generated from
 * markdown.  The Layout component provides the global navigation bar.
 */
export default function PostPage({ post, contentHtml }: PostPageProps) {
  return (
    <Layout>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {new Date(post.date).toLocaleDateString()}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {post.categories.map((category) => (
            <Chip
              key={category}
              label={category.replace(/-/g, ' ')}
              size="small"
            />
          ))}
        </Stack>
        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt={post.title}
            sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', mb: 3 }}
          />
        )}
        <Box
          sx={{
            '& img': { maxWidth: '100%' },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 1,
              overflowX: 'auto',
            },
          }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </Box>
    </Layout>
  );
}

// Generate static paths for all posts based on their slugs.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return {
    paths,
    fallback: false,
  };
};

// Fetch data for a single post at build time.
export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const { meta, contentHtml } = await getPostData(slug);
  return {
    props: {
      post: meta,
      contentHtml,
    },
  };
};