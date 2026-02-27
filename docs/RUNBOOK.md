# Runbook - Space Explorer

Operational guide for running, building, and maintaining Space Explorer.

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start

# Or export static site
npm run export
```

## Project Structure

```
Space/
├── app/                    # Next.js app router pages
├── components/             # React components
├── data/                   # JSON data files
├── utils/                  # Utility functions
├── styles/                 # CSS files
├── public/                 # Static assets
├── docs/                   # Documentation
└── scripts/                # Build scripts
```

## Development Workflow

### 1. Setup
```bash
# Clone repository
git clone <repo-url>
cd Space

# Install dependencies
npm install

# Copy environment file (if needed)
cp .env.example .env
```

### 2. Running Locally
```bash
# Development server (with hot reload)
npm run dev

# Production build (test locally)
npm run build
npm start

# Static export (for static hosting)
npm run build
npm run export
```

### 3. Code Quality
```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Format code (if configured)
npm run format
```

## Build Process

### Next.js Build
```bash
npm run build
```

**What it does:**
1. TypeScript compilation
2. Next.js optimization
3. Image optimization
4. Code splitting
5. Static page generation

**Output:** `.next/` directory

### Static Export
```bash
npm run build
npm run export
```

**What it does:**
1. Generates static HTML files
2. Copies static assets
3. Creates `out/` directory

**Use case:** GitHub Pages, static hosting

## Environment Variables

### Development (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=your-analytics-id
```

## Data Management

### Adding New Content

1. **Add to sitemap:**
   - Edit `data/spaceSitemap.json`
   - Add route entry with metadata

2. **Add encyclopedia article:**
   - Edit `data/encyclopedia/[category].json`
   - Add article object

3. **Add page:**
   - Create `app/[slug]/page.tsx`
   - Use PageTemplate component

### Updating Content
- Edit JSON files in `data/`
- Changes reflected immediately (dev mode)
- Rebuild for production

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Error: Out of memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Error: TypeScript errors**
```bash
# Check types
npm run type-check
# Fix or add @ts-ignore (temporary)
```

### Runtime Errors

**Images not loading:**
- Check `next.config.js` remotePatterns
- Verify image URLs
- Check network tab for 404s

**JSON not loading:**
- Check file paths
- Verify JSON syntax
- Check browser console

**Styling issues:**
- Clear browser cache
- Check Tailwind config
- Verify CSS imports

## Performance Optimization

### Build Performance
- Use build cache
- Optimize images
- Reduce dependencies

### Runtime Performance
- Enable image optimization
- Use static generation
- Implement lazy loading
- Code splitting

### Monitoring
```bash
# Analyze bundle size
npm run analyze

# Check Core Web Vitals
# Use Lighthouse in Chrome DevTools
```

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` successfully
- [ ] Test all pages locally
- [ ] Check for console errors
- [ ] Verify environment variables
- [ ] Update sitemap.json
- [ ] Test search functionality
- [ ] Verify image loading

### Deployment
- [ ] Push to repository
- [ ] Configure hosting platform
- [ ] Set environment variables
- [ ] Deploy
- [ ] Verify deployment
- [ ] Test production site

### Post-Deployment
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Verify analytics
- [ ] Test on mobile
- [ ] Check accessibility

## Maintenance

### Weekly
- Check for dependency updates
- Review error logs
- Monitor performance

### Monthly
- Update dependencies
- Security audit: `npm audit`
- Review analytics
- Backup data

### Quarterly
- Major dependency updates
- Performance review
- Content updates
- Documentation updates

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linter
npm run type-check       # TypeScript check

# Data
npm run data:validate    # Validate JSON files (if script exists)

# Utilities
npm run clean            # Clean build artifacts
npm run analyze          # Analyze bundle size
```

## Configuration Files

### next.config.js
- Image domains
- Redirects
- Headers
- Webpack config

### tailwind.config.ts
- Theme customization
- Plugin configuration
- Content paths

### tsconfig.json
- TypeScript options
- Path aliases
- Include/exclude paths

### package.json
- Dependencies
- Scripts
- Project metadata

## Search Engine

### Local Search
- Uses `utils/search/searchEngine.ts`
- Indexes encyclopedia content
- Caches results
- Supports category filtering

### Adding Searchable Content
1. Add to encyclopedia JSON
2. Or add to spaceSitemap.json
3. Search engine auto-indexes

## Offline Support

### Caching
- Uses `utils/offline/cacheManager.ts`
- Caches JSON loads
- TTL: 1 hour default
- Auto-cleanup expired entries

### Fallbacks
- Graceful degradation
- Default content on error
- User-friendly error messages

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com/docs

### Issues
- Check GitHub issues
- Review error logs
- Test in isolation

### Community
- GitHub Discussions
- Stack Overflow
- Discord (if available)

## Emergency Procedures

### Site Down
1. Check hosting platform status
2. Review error logs
3. Check recent deployments
4. Rollback if needed
5. Notify team

### Data Loss
1. Check Git history
2. Restore from backup
3. Verify data integrity
4. Update documentation

### Security Incident
1. Rotate all secrets
2. Review access logs
3. Update dependencies
4. Security audit
5. Document incident

## Version History

- v1.0.0: Initial release
- Check git tags for versions
