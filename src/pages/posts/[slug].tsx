import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import Layout from '../../components/Layout';
import type { PostMeta } from '../../lib/posts';
// Use Strapi helpers to fetch posts instead of reading Markdown files.
// Fetch data from Contentful instead of Strapi.  These helpers
// communicate with Contentful's Content Delivery API and return
// normalised post metadata and raw content.  See lib/contentful.ts for
// details.
import { fetchPosts, fetchPost } from '../../lib/contentful';

// We'll convert Markdown content to HTML on the server at build time.
// Contentful stores the body field as plain text or Markdown.  We
// rely on remark to transform Markdown into HTML for rendering.  If
// your Contentful content is stored as rich text or HTML already,
// remove this conversion and pass it through directly.
import { remark } from 'remark';
import html from 'remark-html';

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
  // Retrieve all posts from Contentful and generate static paths based on
  // their slugs.  Without a reachable Contentful API at build time
  // this call will throw; ensure your CONTENTFUL_SPACE_ID and
  // CONTENTFUL_ACCESS_TOKEN env vars are defined.
  const posts = await fetchPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return {
    paths,
    fallback: false,
  };
};

// Fetch data for a single post at build time.
export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  // Fetch the post data from Contentful.  We receive normalised
  // metadata and a raw content string.  If you stored rich text
  // instead of Markdown, adjust the conversion accordingly (e.g. use
  // @contentful/rich-text-react-renderer).
  const { post, content } = await fetchPost(slug);
  // Convert Markdown to HTML using remark.  If the content is not
  // Markdown (e.g. plain text or already HTML), this will still
  // produce a valid HTML string.  Contentful can store rich text
  // fields as structured JSON; in that case, you'd need to use
  // @contentful/rich-text libraries instead of remark.
  const processed = await remark().use(html).process(content || '');
  const contentHtml = processed.toString();
  return {
    props: {
      post,
      contentHtml,
    },
  };
};