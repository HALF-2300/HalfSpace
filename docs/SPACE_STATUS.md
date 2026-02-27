# Space Status & Stability Kit

## Overview

The Space Status system provides comprehensive monitoring and stability tools for the Space section of the application. It includes:

- **Status Page** (`/space/status`): Real-time monitoring of space pages and data files
- **Data Guards**: Protection against missing or invalid JSON data
- **Image Fallbacks**: Graceful handling of missing images
- **Self-Check Reports**: JSON reports for diagnostics

## Files Structure

### Data Files

- `data/space_routes.json`: Source of truth for all Space section routes
  - Contains list of all space pages
  - Maps each page to its required data files
  - Includes metadata (category, title, etc.)

### Components

- `components/space/SpaceDataGuard.tsx`: Wrapper component that protects against missing data
- `components/space/SafeImage.tsx`: Image component with automatic fallback support

### Pages

- `app/space/status/page.tsx`: Status monitoring dashboard

## Usage

### Status Page

Visit `/space/status` to:

1. **View all Space pages**: See complete list of space routes with their categories
2. **Check data files**: Monitor status of all JSON data files (OK/Failed)
3. **Run self-check**: Generate comprehensive JSON report
4. **Download reports**: Export diagnostic reports for analysis

### Data Guards

Wrap components that depend on JSON data:

```tsx
import SpaceDataGuard from '@/components/space/SpaceDataGuard'

export default function MyPage() {
  return (
    <SpaceDataGuard
      dataSource="myData.json"
      requiredFields={['items', 'metadata']}
    >
      {/* Your component content */}
    </SpaceDataGuard>
  )
}
```

**Props:**
- `dataSource`: Name of the data file (optional)
- `requiredFields`: Array of required field names (optional)
- `fallback`: Custom fallback component (optional)

**Behavior:**
- Shows loading state while checking
- Displays respectful empty state if data is missing
- Provides links to refresh or visit diagnostics page

### Safe Images

Use `SafeImage` component for images that might fail to load:

```tsx
import SafeImage from '@/components/space/SafeImage'

<SafeImage
  src="/path/to/image.jpg"
  alt="Description"
  fallbackSrc="/images/space-placeholder.png"
  className="w-full h-64 object-cover"
/>
```

**Props:**
- `src`: Primary image source
- `alt`: Alt text (required)
- `fallbackSrc`: Fallback image path (default: `/images/space-placeholder.png`)
- All standard `img` props are supported

**Behavior:**
- Automatically switches to fallback on load error
- Shows placeholder if no `src` provided
- Prevents infinite error loops

## Self-Check Report Format

The self-check generates a JSON report with:

```json
{
  "timestamp": "2024-12-19T10:30:00.000Z",
  "totalRoutes": 40,
  "routesWithData": 25,
  "dataFilesChecked": 30,
  "dataFilesOk": 28,
  "dataFilesFailed": 2,
  "fileStatuses": [
    {
      "file": "spaceGuide.json",
      "status": "ok",
      "size": 15234
    },
    {
      "file": "missing.json",
      "status": "failed",
      "error": "HTTP 404: Not Found"
    }
  ],
  "routes": [...]
}
```

## Best Practices

### 1. Always Use Guards for Data-Dependent Components

```tsx
// ✅ Good
<SpaceDataGuard dataSource="myData.json">
  <MyComponent data={myData} />
</SpaceDataGuard>

// ❌ Bad
<MyComponent data={myData} /> // Will crash if myData is undefined
```

### 2. Provide Safe Defaults

```tsx
// ✅ Good
const items = (data?.items || []) as Item[]
const title = data?.title || 'Default Title'

// ❌ Bad
const items = data.items // Will crash if data is undefined
```

### 3. Use SafeImage for External Images

```tsx
// ✅ Good
<SafeImage src={nasaImageUrl} alt="Space image" />

// ❌ Bad
<img src={nasaImageUrl} alt="Space image" /> // Will show broken image icon
```

### 4. Check Status Page Regularly

- Run self-check after adding new data files
- Review failed files and fix issues
- Download reports for documentation

## Troubleshooting

### Data File Shows as Failed

1. Check file exists in `data/` directory
2. Verify JSON syntax is valid
3. Check file permissions
4. Review error message in status page

### Component Shows Empty State

1. Verify data file is listed in `space_routes.json`
2. Check `SpaceDataGuard` is properly configured
3. Verify data structure matches expected format
4. Check browser console for errors

### Images Not Loading

1. Verify image path is correct
2. Check `SafeImage` fallback is working
3. Ensure placeholder image exists
4. Review network tab for 404 errors

## Maintenance

### Adding New Space Pages

1. Add route to `data/space_routes.json`
2. List required data files
3. Wrap page component with `SpaceDataGuard`
4. Update this documentation if needed

### Adding New Data Files

1. Create file in `data/` directory
2. Add to appropriate route in `space_routes.json`
3. Test with status page self-check
4. Update guards if needed

## Related Files

- `data/space_routes.json`: Route definitions
- `components/space/SpaceDataGuard.tsx`: Data protection
- `components/space/SafeImage.tsx`: Image fallback
- `app/space/status/page.tsx`: Status dashboard
- `app/space/layout.tsx`: Space section layout

## Version History

- **v1.0.0** (2024-12-19): Initial implementation
  - Status page with self-check
  - Data guards for JSON protection
  - Image fallback component
  - Comprehensive documentation
