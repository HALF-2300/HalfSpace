# Free Hosting Deployment Guide

This guide covers deploying Space Explorer to free hosting platforms.

## Supported Platforms

### Vercel (Recommended)
- **Free Tier**: Generous limits, excellent Next.js support
- **Deploy**: Connect GitHub repository, automatic deployments
- **Custom Domain**: Free on all plans
- **CDN**: Global CDN included

#### Deployment Steps:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables (if needed)
6. Deploy

#### Vercel Configuration:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Netlify
- **Free Tier**: 100GB bandwidth, 300 build minutes/month
- **Deploy**: Git integration or drag & drop
- **CDN**: Global CDN included

#### Deployment Steps:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy

#### Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### GitHub Pages (Static Export)
- **Free Tier**: Unlimited public repos
- **Limitation**: Requires static export (no server-side features)

#### Setup:
1. Install `next export` (already in package.json)
2. Build static site:
   ```bash
   npm run build
   npm run export
   ```
3. Push `out/` directory to `gh-pages` branch
4. Enable GitHub Pages in repo settings

### Cloudflare Pages
- **Free Tier**: Unlimited builds, unlimited bandwidth
- **Deploy**: Git integration
- **CDN**: Global Cloudflare CDN

#### Deployment Steps:
1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Create new project from Git
4. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`

## Environment Variables

Set these in your hosting platform:

```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_FEATURE_X=true
```

## Build Optimization

The project is already optimized for free hosting:

- ✅ Static generation where possible
- ✅ Image optimization with Next.js Image
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minimal dependencies

## Free Tier Limits

| Platform | Bandwidth | Builds | Storage |
|----------|-----------|--------|---------|
| Vercel | Unlimited | Unlimited | Unlimited |
| Netlify | 100GB/mo | 300 min/mo | 100GB |
| GitHub Pages | 100GB/mo | N/A | 1GB |
| Cloudflare Pages | Unlimited | Unlimited | Unlimited |

## Monitoring

### Free Options:
- Vercel Analytics (free tier included)
- Google Analytics (free)
- Uptime Robot (free monitoring)

## Custom Domain

All platforms support custom domains on free tier:
1. Add domain in platform settings
2. Update DNS records as instructed
3. SSL certificate automatically provisioned

## Troubleshooting

### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

### Image Loading Issues
- Ensure external image domains in `next.config.js`
- Use relative paths for local images
- Check image URLs are accessible

### Performance Issues
- Enable image optimization
- Use static generation
- Check bundle size with `npm run analyze`

## Maintenance

### Regular Updates:
- Update dependencies monthly
- Monitor security advisories
- Keep Next.js updated

### Backup:
- Git repository serves as backup
- Regular commits ensure data safety

## Support

- Platform docs: Vercel/Netlify/GitHub documentation
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Project issues: Check GitHub issues
