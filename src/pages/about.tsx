// src/pages/about.tsx
import React from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import {
  Typography,
  Box,
  Stack,
  Link,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Email, GitHub, LinkedIn } from '@mui/icons-material';

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
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
         Hi, I'm Kevin Nguyen – an IT professional, automation enthusiast, and problem solver with a passion for leveraging technology to streamline business processes and enhance user experiences.
        </Typography>
        <Typography variant="body1" paragraph>
          Currently serving as an IT System Administrator in Austin, Texas, I specialize in deploying cutting-edge AI solutions, including LLM chat platforms, AI automation workflows, and intelligent agent systems. My recent work involves implementing MCP (Model Context Protocol) servers and building custom AI chat agents that transform how organizations handle customer support and internal operations.
        </Typography>
        <Typography variant="body1" paragraph>
          My technical toolkit spans across multiple domains: from managing enterprise database infrastructure (SQL Server, MySQL) and cloud services (Azure, AWS) to developing automation solutions using Python, PowerShell, and modern workflow tools like n8n. Whether it's troubleshooting complex system issues, migrating databases, or building custom scripts to eliminate manual processes, I thrive on turning technical challenges into streamlined solutions.
        </Typography>
        <Typography variant="body1" paragraph>
          What sets me apart is my unique combination of deep technical expertise and real-world business experience. With over a decade in data analysis and customer training, plus a Chemical Engineering background from Texas Tech University, I bring both analytical rigor and practical problem-solving skills to every project. I've successfully guided customers through complex software implementations, created training materials that actually make sense, and consistently delivered solutions that work in the real world – not just in theory.
        </Typography>
        <Typography variant="body1" paragraph>
          I'm passionate about continuous learning and staying ahead of technology trends. My growing collection of certifications in cybersecurity (CompTIA Sec+), cloud platforms (AWS), and emerging technologies reflects my commitment to delivering current, relevant solutions to my clients.
        </Typography>
        <Typography variant="body1" paragraph>
          Through this blog, I share tutorials, project breakdowns, and insights from my experience building AI-powered tools, automating business processes, and solving the kind of technical challenges that keep businesses running smoothly. Whether you're looking for someone to implement an AI solution, automate your workflows, or tackle that complex data problem that's been gathering dust – I'm here to help turn your technical vision into reality.
        </Typography>
        <Typography variant="body1" paragraph>
          Let's build something amazing together.
        </Typography>
      </Box>

      {/* Profile picture */}
      <Box mt={6} display="flex" justifyContent="center">
        <Image
          src="/profile.jpg" // put your file in /public/profile.jpg
          alt="Kevin Nguyen"
          width={200}
          height={200}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          priority
        />
      </Box>

      {/* Contact card */}
      <Box mt={4} display="flex" justifyContent="center">
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Contact Me
            </Typography>

            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 1 }}>
              <IconButton
                component={Link}
                href="mailto:kdnguyen9088@gmail.com"
                aria-label="Email"
              >
                <Email fontSize="large" />
              </IconButton>
              <IconButton
                component={Link}
                href="https://github.com/Googlymonster"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
              >
                <GitHub fontSize="large" />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.linkedin.com/in/your-handle/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                <LinkedIn fontSize="large" />
              </IconButton>
            </Stack>

            <Stack spacing={0.5} alignItems="center">
              <Typography variant="body2">
                📧 <Link href="mailto:kdnguyen9088@gmail.com">kdnguyen9088@gmail.com</Link>
              </Typography>
              <Typography variant="body2">
                🖥 GitHub:{' '}
                <Link href="https://github.com/Googlymonster" target="_blank" rel="noopener">
                  Googlymonster
                </Link>
              </Typography>
              <Typography variant="body2">
                💼 LinkedIn:{' '}
                <Link href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener">
                  your-handle
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
