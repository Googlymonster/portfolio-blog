import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
} from '@mui/material';

export interface PostPreview {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  image?: string;
}

/**
 * PostCard displays a summary of a blog post, including its title, date,
 * excerpt, categories, and optional cover image.  Clicking the card navigates
 * to the full post.
 */
const PostCard: React.FC<{ post: PostPreview }> = ({ post }) => {
  return (
    <Card>
      <Link href={`/posts/${post.slug}`} passHref legacyBehavior>
        <CardActionArea component="a">
          {post.image && (
            <CardMedia
              component="img"
              height="140"
              image={post.image}
              alt={post.title}
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {new Date(post.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.excerpt}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
              {post.categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat.replace(/-/g, ' ')}
                  size="small"
                />
              ))}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default PostCard;