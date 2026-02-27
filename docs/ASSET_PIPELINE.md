# Asset Pipeline & Organization

Guide for managing images, textures, and static assets in Space Explorer.

## Directory Structure

```
public/
├── space/
│   ├── images/          # Space images
│   │   ├── planets/     # Planet images
│   │   ├── stars/       # Star images
│   │   ├── galaxies/    # Galaxy images
│   │   └── missions/    # Mission images
│   ├── textures/        # Texture files
│   ├── icons/           # Icon files
│   └── backgrounds/     # Background images
├── favicon.ico
└── space-icon.svg
```

## Naming Convention

### Images
Format: `{category}-{subject}-{descriptor}.{ext}`

**Examples:**
- `planet-mars-surface.jpg`
- `star-sun-corona.png`
- `galaxy-andromeda-wide.jpg`
- `mission-apollo11-liftoff.jpg`

### Textures
Format: `texture-{type}-{variant}.{ext}`

**Examples:**
- `texture-starfield-01.jpg`
- `texture-nebula-purple.png`
- `texture-space-dark.jpg`

### Icons
Format: `icon-{name}.{ext}`

**Examples:**
- `icon-rocket.svg`
- `icon-planet.svg`
- `icon-star.svg`

## Image Requirements

### Recommended Formats
- **JPEG**: Photos, complex images
- **PNG**: Icons, graphics with transparency
- **SVG**: Icons, logos, simple graphics
- **WebP**: Modern format (better compression)

### Size Guidelines
- **Hero images**: 1920x1080 (16:9)
- **Card images**: 800x600 (4:3)
- **Gallery images**: 1200x800 (3:2)
- **Thumbnails**: 400x300 (4:3)
- **Icons**: 64x64 to 512x512

### File Size Limits
- Hero images: < 500KB
- Card images: < 200KB
- Gallery images: < 300KB
- Icons: < 50KB

## Adding New Assets

### Checklist

#### 1. Preparation
- [ ] Optimize image (compress)
- [ ] Resize to appropriate dimensions
- [ ] Verify format (JPEG/PNG/WebP)
- [ ] Check file size

#### 2. Naming
- [ ] Follow naming convention
- [ ] Use lowercase with hyphens
- [ ] Include category prefix
- [ ] Descriptive but concise

#### 3. Organization
- [ ] Place in correct directory
- [ ] Create category folder if needed
- [ ] Keep related assets together

#### 4. Integration
- [ ] Add to `next.config.js` if external
- [ ] Reference in component/page
- [ ] Add alt text
- [ ] Test loading

#### 5. Documentation
- [ ] Update this document if new category
- [ ] Add to asset manifest (optional)
- [ ] Update sitemap if page image

## Image Optimization

### Tools
- **TinyPNG**: https://tinypng.com
- **Squoosh**: https://squoosh.app
- **ImageOptim**: macOS app
- **Sharp**: CLI tool

### Optimization Steps
```bash
# Using Sharp (if installed)
npx sharp-cli -i input.jpg -o output.jpg --quality 85

# Or use online tools
# Upload → Optimize → Download
```

### Best Practices
1. Use appropriate format
2. Compress before upload
3. Remove metadata if possible
4. Use responsive images
5. Lazy load below fold

## External Images

### NASA Images
- Source: https://images.nasa.gov
- Format: Use `~orig.jpg` for full size
- Add domain to `next.config.js`

### Unsplash
- Source: https://unsplash.com
- Format: Append `?w=1920` for sizing
- Already configured in `next.config.js`

### Fallback
- Use placeholder if image fails
- Implement error handling
- Show default space gradient

## Textures & Backgrounds

### Usage
- Starfield backgrounds
- Nebula effects
- Space gradients
- Particle effects

### Guidelines
- Keep file size small
- Use repeatable patterns
- Test on dark backgrounds
- Consider animation needs

## Icon Management

### Source
- Use SVG when possible
- Consistent style
- Appropriate size
- Accessible colors

### Implementation
```tsx
// Using Next.js Image
<Image src="/space/icons/icon-rocket.svg" alt="Rocket" />

// Or inline SVG
<svg>...</svg>
```

## Asset Manifest (Optional)

Create `public/space/manifest.json`:
```json
{
  "images": {
    "planets": [
      {
        "name": "planet-mars-surface",
        "path": "/space/images/planets/planet-mars-surface.jpg",
        "alt": "Mars surface",
        "category": "planets"
      }
    ]
  }
}
```

## Performance Considerations

### Loading Strategy
- Hero images: `priority` prop
- Below fold: `loading="lazy"`
- Above fold: `loading="eager"`

### CDN
- Consider CDN for production
- Cloudinary/Imgix for advanced features
- Keep originals in repository

### Caching
- Set appropriate cache headers
- Use versioned filenames if needed
- Browser caching for static assets

## Troubleshooting

### Image Not Loading
1. Check file path
2. Verify file exists
3. Check `next.config.js` domains
4. Review browser console
5. Test image URL directly

### Slow Loading
1. Check file size
2. Optimize image
3. Enable compression
4. Use Next.js Image component
5. Consider lazy loading

### Format Issues
1. Convert to supported format
2. Check browser compatibility
3. Use fallback formats
4. Update `next.config.js`

## Maintenance

### Regular Tasks
- Audit unused images
- Optimize large files
- Update stale assets
- Verify all links
- Check file sizes

### Cleanup
```bash
# Find large images
find public/space -type f -size +500k

# Find duplicates (if tool available)
# Use image deduplication tool
```

## Best Practices Summary

1. ✅ Follow naming conventions
2. ✅ Optimize before adding
3. ✅ Use correct directories
4. ✅ Add proper alt text
5. ✅ Test loading
6. ✅ Document location
7. ✅ Keep file sizes reasonable
8. ✅ Use Next.js Image component
9. ✅ Implement fallbacks
10. ✅ Regular cleanup

## Tools & Resources

- Image Optimization: TinyPNG, Squoosh
- Format Conversion: CloudConvert
- SVG Optimization: SVGO
- Bulk Processing: ImageMagick
- Asset Management: Consider DAM system

## Examples

### Adding Planet Image
```bash
# 1. Download/optimize image
# 2. Rename: planet-venus-atmosphere.jpg
# 3. Place in: public/space/images/planets/
# 4. Reference in component:
<Image 
  src="/space/images/planets/planet-venus-atmosphere.jpg"
  alt="Venus atmosphere"
  width={800}
  height={600}
/>
```

### Adding Mission Icon
```bash
# 1. Create/download SVG
# 2. Rename: icon-mission-apollo.svg
# 3. Place in: public/space/icons/
# 4. Reference:
<Image 
  src="/space/icons/icon-mission-apollo.svg"
  alt="Apollo mission icon"
  width={64}
  height={64}
/>
```

## Support

For questions or issues:
- Check this documentation
- Review existing assets
- Ask in team chat
- Document new patterns
