import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Container, Button, Box } from '@mui/material';

export interface LayoutProps {
  /**
   * The content to render inside the layout.
   */
  children: React.ReactNode;
}

/**
 * Layout wraps pages with a consistent header and navigation bar.  Instead of a
 * text title, it displays a logo that links back to the home page.  Two
 * navigation buttons—Blog and About—allow users to navigate between the
 * main blog listing and an about page.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo linking back to the home page */}
          <Link href="/" passHref legacyBehavior>
            <Box
              component="a"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src="/images/logo.png"
                alt="Logo"
                sx={{ height: 32, width: 32, mr: 1 }}
              />
            </Box>
          </Link>
          {/* Navigation links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} href="/" sx={{ textTransform: 'none' }}>
              Blog
            </Button>
            <Button color="inherit" component={Link} href="/about" sx={{ textTransform: 'none' }}>
              About
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;