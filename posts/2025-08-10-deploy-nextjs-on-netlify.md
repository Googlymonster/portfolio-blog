---
title: "Deploy a Next.js App on Netlify"
date: "2025-08-10"
categories:
  - it-solutions
  - programming
excerpt: "A step-by-step guide to deploying a Next.js application on Netlify, including configuration tips."
image: "/images/deploy-cloud.png"
---

Netlify is a popular platform for hosting static and serverless applications. With Next.js, you can deploy hybrid applications that use static generation and server-side rendering.

## Steps to deploy

1. Push your Next.js code to a Git provider (e.g., GitHub).
2. Sign in to Netlify and create a new site from your repository.
3. Set the build command to `npm run build` and the publish directory to `out` if you’re using static generation (`next export`), or leave it as `.next` for server-side rendering.
4. Configure environment variables and deploy.

Netlify’s free tier is great for personal projects and provides features like custom domains, form handling, and edge functions. It's an excellent choice for hosting your portfolio blog.