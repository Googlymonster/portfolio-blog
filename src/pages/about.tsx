import React from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../components/Layout';

/**
 * The About page provides a space to introduce yourself and explain the purpose
 * of your portfolio blog.  Feel free to edit this content to reflect your
 * background, interests, and the kinds of projects or tutorials you share.
 */
export default function About() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to my portfolio and blog! Here you'll find detailed write‑ups
          of the projects I’ve been working on, tutorials that walk through
          technical concepts, and notes from my homelab experiments. I’m
          passionate about automation, programming, and IT solutions, and this
          site serves as a hub where I document what I learn along the way.
        </Typography>
        <Typography variant="body1" paragraph>
          Use the Blog link in the header to explore posts by tag. You can
          filter posts on the blog page using the tag buttons just below the
          heading. The content of this page is fully editable—open
          <code>src/pages/about.tsx</code> in your editor to make changes.
        </Typography>
      </Box>
    </Layout>
  );
}