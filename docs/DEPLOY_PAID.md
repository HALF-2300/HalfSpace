# Paid Hosting Deployment Guide

This guide covers deploying Space Explorer to paid hosting platforms for production use.

## Recommended Platforms

### Vercel Pro ($20/month)
- **Best for**: Production Next.js apps
- **Features**: 
  - Unlimited bandwidth
  - Advanced analytics
  - Edge functions
  - Preview deployments
  - Team collaboration

#### Setup:
1. Upgrade to Pro plan
2. Connect custom domain
3. Enable analytics
4. Configure edge functions if needed

### AWS Amplify
- **Cost**: Pay-as-you-go
- **Best for**: Enterprise scale
- **Features**:
  - Full AWS integration
  - Custom CI/CD
  - Advanced caching
  - Global CDN

#### Setup:
1. Install AWS CLI
2. Configure AWS credentials
3. Deploy:
   ```bash
   aws amplify create-app --name space-explorer
   ```
4. Connect repository
5. Configure build settings

### DigitalOcean App Platform
- **Cost**: $5-25/month
- **Best for**: Simple deployments
- **Features**:
  - Automatic HTTPS
  - Horizontal scaling
  - Database integration

#### Setup:
1. Create App Platform app
2. Connect GitHub repository
3. Configure:
   - Build command: `npm run build`
   - Run command: `npm start`
4. Set environment variables

### Railway
- **Cost**: $5/month + usage
- **Best for**: Developer-friendly hosting
- **Features**:
  - One-click deploy
  - Automatic HTTPS
  - Database included

#### Setup:
1. Connect GitHub
2. Select repository
3. Railway auto-detects Next.js
4. Add environment variables
5. Deploy

## Production Optimizations

### 1. Environment Variables

Set these in production:

```env
# Required
NODE_ENV=production

# Optional but recommended
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Analytics
NEXT_PUBLIC_GA_ID=your-analytics-id

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Feature flags
NEXT_PUBLIC_ENABLE_EXPERIMENTAL=false
```

### 2. Performance Monitoring

#### Vercel Analytics (Pro):
- Automatic performance monitoring
- Real User Monitoring (RUM)
- Web Vitals tracking

#### Sentry Integration:
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 3. Database Setup (if needed)

#### PostgreSQL:
```bash
# Using Supabase (free tier available)
npm install @supabase/supabase-js
```

#### MongoDB Atlas:
```bash
npm install mongodb
```

### 4. CDN Configuration

Most platforms include CDN automatically. For custom CDN:

- Cloudflare: Add domain to Cloudflare
- AWS CloudFront: Configure distribution
- Fastly: Enterprise CDN option

### 5. Caching Strategy

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Scaling Considerations

### Traffic Spikes:
- Enable auto-scaling on platform
- Use edge functions for dynamic content
- Implement rate limiting

### Image Optimization:
- Use Next.js Image Optimization
- Consider Cloudinary/Imgix for advanced features
- Implement lazy loading

### API Rate Limiting:
- Implement rate limiting middleware
- Use Redis for session management
- Cache API responses

## Security Best Practices

### 1. HTTPS:
- Automatic on most platforms
- Force HTTPS redirects

### 2. Environment Variables:
- Never commit secrets
- Use platform secrets management
- Rotate keys regularly

### 3. Dependencies:
- Regular security audits: `npm audit`
- Update dependencies: `npm update`
- Use Dependabot for automated updates

### 4. Headers:
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ]
}
```

## Monitoring & Analytics

### Application Monitoring:
- **Vercel Analytics**: Built-in (Pro)
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: APM (enterprise)

### Performance Monitoring:
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Synthetic monitoring

## Backup & Disaster Recovery

### Code Backup:
- Git repository (primary backup)
- Regular commits
- Tag releases

### Database Backup (if applicable):
- Automated daily backups
- Point-in-time recovery
- Cross-region replication

## Cost Optimization

### Reduce Bandwidth:
- Optimize images
- Enable compression
- Use CDN caching

### Optimize Builds:
- Reduce build time
- Use build cache
- Parallel builds

### Resource Optimization:
- Right-size instances
- Use serverless where possible
- Monitor usage

## Troubleshooting

### Build Failures:
1. Check build logs
2. Verify Node.js version
3. Check memory limits
4. Review dependency issues

### Performance Issues:
1. Run Lighthouse audit
2. Check Core Web Vitals
3. Analyze bundle size
4. Review database queries

### Deployment Issues:
1. Check environment variables
2. Verify build configuration
3. Review platform logs
4. Test locally first

## Support

- Platform support: Check platform docs
- Next.js support: [nextjs.org/docs](https://nextjs.org/docs)
- Community: GitHub Discussions

## Migration Guide

### From Free to Paid:
1. Backup current deployment
2. Export environment variables
3. Create new paid account
4. Import configuration
5. Test thoroughly
6. Update DNS

### Between Platforms:
1. Export all data
2. Document configuration
3. Set up new platform
4. Import data
5. Test
6. Switch DNS
