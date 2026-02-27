# 🚀 Quick Deployment Guide - Space Explorer

## Current Issue Fixed ✅
- Cleaned `.next` build directory
- Restarted server with fresh build
- Server should now be working at: `http://localhost:9200`

## For Online Deployment

### Option 1: Vercel (Recommended - Easiest) ⭐

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your Space Explorer repository
   - Vercel auto-detects Next.js - click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Settings (Optional)**:
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

**That's it!** Vercel handles everything automatically.

---

### Option 2: Netlify

1. **Push to GitHub** (if not already)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

**Note:** For Netlify, you may need to install `@netlify/plugin-nextjs`:
```bash
npm install -D @netlify/plugin-nextjs
```

Then create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Cloudflare Pages

1. **Push to GitHub**

2. **Deploy to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`
   - Click "Save and Deploy"

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] Local development server works: `npm run dev`
- [ ] Production build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] All images load correctly
- [ ] Navigation works on all pages

## Testing Production Build Locally

To test the production build before deploying:

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000 (default port)
```

## Environment Variables (Optional)

Most platforms let you set environment variables in their dashboard:

- `NODE_ENV=production` (usually set automatically)
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com` (optional)

## After Deployment

1. **Check your live site** - Visit the URL provided by the platform
2. **Test all pages** - Make sure navigation works
3. **Check images** - Verify NASA images load correctly
4. **Monitor** - Check platform dashboard for any errors

## Troubleshooting

### Build Fails Online But Works Locally

1. **Check Node.js version**: Ensure platform uses Node 18+
2. **Check build logs**: Platform dashboard shows detailed errors
3. **Clear cache**: Some platforms have "Clear cache and redeploy" option

### Images Not Loading

- Verify `next.config.js` has all NASA image domains
- Check browser console for CORS or 403 errors
- Images may need time to load on first visit

### 500 Errors

- Check server logs in platform dashboard
- Verify all dependencies are in `package.json`
- Check for missing environment variables

## Recommended: Vercel

Vercel is the easiest option because:
- ✅ Zero configuration needed for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free custom domain
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests

## Need Help?

- Check platform documentation
- Review `docs/DEPLOY_FREE.md` for more details
- Check Next.js deployment docs: https://nextjs.org/docs/deployment
