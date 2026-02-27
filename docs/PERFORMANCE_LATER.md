# ⚡ دليل التحسين لاحقًا - Performance Optimization Guide

دليل شامل لتحسين أداء الموقع بعد الاستقرار.

---

## 📊 قياس الأداء الحالي

### أدوات القياس:

1. **Lighthouse (Chrome DevTools):**
   ```bash
   # افتح Chrome DevTools
   # Tab: Lighthouse
   # Run audit
   ```

2. **Next.js Analytics:**
   ```bash
   # في next.config.js
   const nextConfig = {
     experimental: {
       instrumentationHook: true
     }
   }
   ```

3. **Web Vitals:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## 🎯 أولويات التحسين

### 1. **الصور** (الأهم) 🖼️

#### المشكلة:
- صور كبيرة غير محسّنة
- صور خارجية بدون CDN
- عدم استخدام WebP

#### الحلول:

**أ) تحسين الصور:**
```bash
# استخدم Next.js Image Optimization
# تلقائيًا يحول إلى WebP
<Image
  src="/space/images/hero.jpg"
  width={1920}
  height={1080}
  quality={75}  # بدلاً من 85
  priority={false}  # فقط للصور فوق الطية
/>
```

**ب) استخدام CDN:**
```typescript
// next.config.js
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.js'
  }
}

// lib/imageLoader.js
export default function cloudinaryLoader({ src, width, quality }) {
  return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality}/${src}`
}
```

**ج) Lazy Loading:**
```tsx
// فقط للصور تحت الطية
<Image
  src="/space/images/planet.jpg"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**النتيجة المتوقعة:**
- ⬇️ -50% حجم الصور
- ⬆️ +30% سرعة التحميل

---

### 2. **JavaScript Bundle** 📦

#### المشكلة:
- Bundle كبير
- Code غير مستخدم
- عدم استخدام Code Splitting

#### الحلول:

**أ) Dynamic Imports:**
```tsx
// بدلاً من
import HeavyComponent from '@/components/HeavyComponent'

// استخدم
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false  // إذا كان client-only
})
```

**ب) Tree Shaking:**
```typescript
// استخدم named imports
import { specificFunction } from 'large-library'
// بدلاً من
import * as library from 'large-library'
```

**ج) Bundle Analyzer:**
```bash
# تثبيت
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# تشغيل
ANALYZE=true npm run build
```

**النتيجة المتوقعة:**
- ⬇️ -40% حجم Bundle
- ⬆️ +25% سرعة التحميل الأولي

---

### 3. **CSS** 🎨

#### المشكلة:
- CSS غير مستخدم
- عدم استخدام Critical CSS
- Tailwind CSS كبير

#### الحلول:

**أ) PurgeCSS (Tailwind تلقائي):**
```javascript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Tailwind يحذف CSS غير المستخدم تلقائيًا
}
```

**ب) Critical CSS:**
```tsx
// في _document.tsx أو layout.tsx
<style dangerouslySetInnerHTML={{
  __html: `
    /* Critical CSS هنا */
    .hero { ... }
  `
}} />
```

**النتيجة المتوقعة:**
- ⬇️ -60% حجم CSS
- ⬆️ +20% سرعة التحميل

---

### 4. **API Routes & Data Fetching** 🔄

#### المشكلة:
- Fetching غير محسّن
- عدم استخدام Caching
- Re-fetching غير ضروري

#### الحلول:

**أ) ISR (Incremental Static Regeneration):**
```tsx
// في getStaticProps أو generateStaticParams
export async function generateStaticParams() {
  return [
    { slug: 'earth' },
    { slug: 'mars' },
    // ...
  ]
}

export const revalidate = 3600 // Revalidate كل ساعة
```

**ب) SWR أو React Query:**
```bash
npm install swr
```

```tsx
import useSWR from 'swr'

function SpaceData() {
  const { data, error } = useSWR('/api/space-data', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000 // Cache لمدة دقيقة
  })
  
  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>
  
  return <div>{data}</div>
}
```

**ج) API Route Caching:**
```typescript
// app/api/space/route.ts
export async function GET() {
  const data = await fetchSpaceData()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

**النتيجة المتوقعة:**
- ⬇️ -70% API calls
- ⬆️ +40% سرعة التحميل

---

### 5. **Third-Party Scripts** 📜

#### المشكلة:
- Analytics scripts تبطئ الموقع
- Social media widgets ثقيلة
- Ads scripts

#### الحلول:

**أ) Lazy Load Scripts:**
```tsx
// استخدم next/script
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="lazyOnload"  // أو "afterInteractive"
  onLoad={() => {
    // Initialize
  }}
/>
```

**ب) Self-Host Analytics:**
```bash
# استخدم Plausible أو Umami
# Self-hosted = أسرع
```

**ج) Remove Unused Scripts:**
```bash
# تحقق من جميع <script> tags
# احذف ما لا تحتاجه
```

**النتيجة المتوقعة:**
- ⬇️ -30% JavaScript execution time
- ⬆️ +15% سرعة التحميل

---

### 6. **Fonts** 🔤

#### المشكلة:
- Fonts كبيرة
- عدم استخدام font-display
- تحميل fonts غير مستخدمة

#### الحلول:

**أ) Next.js Font Optimization:**
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // مهم!
  preload: true,
})

// في layout.tsx
<body className={inter.className}>
```

**ب) Self-Host Fonts:**
```tsx
// public/fonts/inter.woff2
import localFont from 'next/font/local'

const inter = localFont({
  src: './fonts/inter.woff2',
  display: 'swap',
})
```

**النتيجة المتوقعة:**
- ⬇️ -50% font loading time
- ⬆️ +10% سرعة التحميل

---

### 7. **Database & API** 🗄️

#### المشكلة:
- Queries غير محسّنة
- عدم استخدام Indexing
- N+1 queries

#### الحلول:

**أ) Database Indexing:**
```sql
-- أضف indexes للـ queries الشائعة
CREATE INDEX idx_planet_name ON planets(name);
CREATE INDEX idx_mission_year ON missions(year);
```

**ب) Query Optimization:**
```typescript
// بدلاً من
const planets = await db.planets.findMany()
for (const planet of planets) {
  const missions = await db.missions.findMany({ where: { planetId: planet.id } })
}

// استخدم
const planets = await db.planets.findMany({
  include: {
    missions: true  // Single query
  }
})
```

**ج) Connection Pooling:**
```typescript
// استخدم Prisma أو Drizzle
// مع connection pooling
```

**النتيجة المتوقعة:**
- ⬇️ -80% database query time
- ⬆️ +50% API response time

---

## 🚀 تحسينات متقدمة

### 1. **Edge Functions**

```typescript
// app/api/route.ts
export const runtime = 'edge'  // أسرع!

export async function GET() {
  return Response.json({ data: 'fast' })
}
```

### 2. **Service Worker (PWA)**

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig)
```

### 3. **HTTP/2 Server Push**

```nginx
# nginx.conf
location / {
    http2_push /_next/static/css/main.css;
    http2_push /_next/static/js/main.js;
}
```

### 4. **Preconnect & DNS Prefetch**

```tsx
// في _document.tsx
<Head>
  <link rel="preconnect" href="https://images-assets.nasa.gov" />
  <link rel="dns-prefetch" href="https://images-assets.nasa.gov" />
</Head>
```

---

## 📊 Checklist التحسين

### Priority 1 (High Impact):
- [ ] تحسين الصور (WebP, CDN)
- [ ] Code Splitting
- [ ] Bundle Analysis
- [ ] Remove unused CSS

### Priority 2 (Medium Impact):
- [ ] API Caching
- [ ] Font Optimization
- [ ] Lazy Load Scripts
- [ ] ISR للصفحات

### Priority 3 (Low Impact):
- [ ] Edge Functions
- [ ] Service Worker
- [ ] HTTP/2 Push
- [ ] Database Optimization

---

## 🎯 أهداف الأداء

### Target Metrics:

- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **TTFB:** < 600ms
- **Bundle Size:** < 200KB (gzipped)
- **Images:** < 100KB per image

### قبل التحسين:
- LCP: ~4s
- Bundle: ~500KB
- Images: ~2MB total

### بعد التحسين:
- LCP: ~1.5s ✅
- Bundle: ~150KB ✅
- Images: ~500KB total ✅

---

## 🛠️ أدوات مفيدة

1. **Lighthouse CI:**
   ```bash
   npm install -g @lhci/cli
   lhci autorun
   ```

2. **WebPageTest:**
   - https://www.webpagetest.org

3. **Bundle Analyzer:**
   - `@next/bundle-analyzer`

4. **Chrome DevTools:**
   - Performance tab
   - Coverage tab

---

## 📚 روابط مفيدة

- [Web.dev Performance](https://web.dev/fast/)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
- [Web Vitals](https://web.dev/vitals/)

---

**ملاحظة:** لا تحسّن كل شيء دفعة واحدة. ابدأ بالأولويات العالية وقيّس النتائج.

---

**تم التحديث:** 2024
**المشروع:** Space Explorer
