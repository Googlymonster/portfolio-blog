import React from 'react';
import { Grid } from '@mui/material';
import PostCard, { PostPreview } from './PostCard';

/**
 * PostList renders a responsive grid of PostCard components.  It accepts an
 * array of post previews and displays them across the available columns.
 */
const PostList: React.FC<{ posts: PostPreview[] }> = ({ posts }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item key={post.slug} xs={12} sm={6} md={4} lg={3}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;