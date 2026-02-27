# 📦 دليل الأصول - Assets Organization Guide

دليل شامل لتنظيم صور، فيديوهات، وملفات الموقع الفضائي.

---

## 📁 هيكل المجلدات

```
public/
├── space/
│   ├── images/
│   │   ├── hero/          # صور الهيرو الرئيسية
│   │   ├── planets/       # صور الكواكب
│   │   ├── stars/         # صور النجوم
│   │   ├── galaxies/      # صور المجرات
│   │   ├── missions/      # صور المهمات
│   │   ├── nebulae/       # صور السدم
│   │   └── textures/      # Textures للخلفيات
│   ├── videos/
│   │   ├── hero/          # فيديوهات قصيرة للهيرو
│   │   ├── animations/    # Animations قصيرة
│   │   └── backgrounds/   # فيديوهات خلفية
│   └── textures/
│       ├── starfield/     # Textures للنجوم
│       ├── nebula/         # Textures للسدم
│       └── planets/        # Textures للكواكب
```

---

## 📝 Naming Convention

### الصور (Images):

**الصيغة:** `{category}-{name}-{size}.{ext}`

**أمثلة:**
```
hero-space-deep-1920x1080.jpg
planet-mars-surface-800x600.jpg
star-sun-corona-1200x1200.png
mission-apollo-11-1600x900.jpg
nebula-orion-1920x1080.jpg
```

**القواعد:**
- ✅ استخدام lowercase فقط
- ✅ استخدام hyphens (-) للفواصل
- ✅ لا مسافات
- ✅ وصف واضح
- ✅ الحجم في الاسم (اختياري)

### الفيديوهات (Videos):

**الصيغة:** `{category}-{name}-{duration}.{ext}`

**أمثلة:**
```
hero-space-intro-10s.mp4
animation-starfield-loop-5s.mp4
background-nebula-drift-30s.mp4
```

**القواعد:**
- ✅ MP4 format (H.264)
- ✅ Max 10MB للفيديوهات القصيرة
- ✅ Max 30s للـ loops
- ✅ 1080p كحد أقصى

### Textures:

**الصيغة:** `{type}-{name}-{size}.{ext}`

**أمثلة:**
```
texture-starfield-2048x2048.png
texture-nebula-purple-1024x1024.jpg
texture-planet-mars-512x512.jpg
```

---

## 🎯 استخدام الأصول في الكود

### الصور المحلية:

```tsx
// ✅ صحيح
import Image from 'next/image'
<Image 
  src="/space/images/hero/hero-space-deep-1920x1080.jpg"
  alt="Deep Space"
  width={1920}
  height={1080}
/>

// ❌ خطأ - لا تستخدم مسارات مطلقة
<Image src="C:/Users/.../public/space/..." />
```

### الصور الخارجية (NASA/Unsplash):

```tsx
// ✅ صحيح - مع fallback
const imageSrc = heroImage || '/space/images/hero/fallback-hero.jpg'
<Image 
  src={imageSrc}
  alt="Space"
  width={1920}
  height={1080}
  onError={(e) => {
    e.currentTarget.src = '/space/images/hero/fallback-hero.jpg'
  }}
/>
```

### الفيديوهات:

```tsx
<video 
  autoPlay 
  loop 
  muted 
  playsInline
  className="absolute inset-0 object-cover"
>
  <source src="/space/videos/hero/hero-space-intro-10s.mp4" type="video/mp4" />
</video>
```

---

## 📐 أحجام الصور الموصى بها

### Hero Images:
- **Desktop:** 1920x1080 (Full HD)
- **Tablet:** 1280x720
- **Mobile:** 800x600

### Card Images:
- **Large:** 800x600
- **Medium:** 600x400
- **Small:** 400x300

### Thumbnails:
- **Square:** 300x300
- **Wide:** 400x225

### Icons:
- **Large:** 128x128
- **Medium:** 64x64
- **Small:** 32x32

---

## 🖼️ تحسين الصور

### قبل الرفع:

1. **ضغط الصور:**
   ```bash
   # استخدم tools مثل:
   - TinyPNG (https://tinypng.com)
   - ImageOptim (Mac)
   - Squoosh (https://squoosh.app)
   ```

2. **تحويل الصيغة:**
   - **Photos:** JPG (للصور الفوتوغرافية)
   - **Graphics:** PNG (للرسوم)
   - **Icons:** SVG (للأيقونات)

3. **WebP (اختياري):**
   - Next.js يدعم WebP تلقائيًا
   - استخدم WebP للصور الكبيرة

### في الكود:

```tsx
// Next.js Image Optimization
<Image
  src="/space/images/hero/hero-space.jpg"
  alt="Space"
  width={1920}
  height={1080}
  quality={85}  // 75-85 للصور الكبيرة
  priority      // للصور فوق الطية
  loading="lazy" // للصور تحت الطية
/>
```

---

## 🎬 الفيديوهات

### الموصى به:

- ✅ **Format:** MP4 (H.264)
- ✅ **Resolution:** 1080p كحد أقصى
- ✅ **Duration:** 5-30 ثانية للـ loops
- ✅ **Size:** < 10MB للفيديوهات القصيرة
- ✅ **Frame Rate:** 30fps

### تحسين الفيديوهات:

```bash
# استخدم FFmpeg
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  output.mp4
```

### استخدام في الكود:

```tsx
<video 
  autoPlay 
  loop 
  muted 
  playsInline
  preload="metadata"
  className="w-full h-full object-cover"
>
  <source src="/space/videos/hero/intro.mp4" type="video/mp4" />
  {/* Fallback */}
  <img src="/space/images/hero/fallback.jpg" alt="Space" />
</video>
```

---

## 🎨 Textures

### الاستخدام:

```tsx
// CSS Background
<div 
  className="absolute inset-0"
  style={{
    backgroundImage: 'url(/space/textures/starfield/starfield-2048x2048.png)',
    backgroundRepeat: 'repeat',
    backgroundSize: '200% 200%'
  }}
/>

// Canvas (للـ animations)
const texture = new Image()
texture.src = '/space/textures/nebula/nebula-purple-1024x1024.jpg'
```

---

## 📦 إدارة الأصول

### Git LFS (للأصول الكبيرة):

```bash
# تثبيت Git LFS
git lfs install

# تتبع ملفات كبيرة
git lfs track "*.mp4"
git lfs track "public/space/images/**/*.jpg"
git lfs track "public/space/images/**/*.png"

# Commit
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### .gitignore للأصول:

```gitignore
# الأصول الكبيرة (لا ترفعها على Git)
public/space/videos/**/*.mp4
public/space/images/**/*.jpg
public/space/images/**/*.png

# استخدم CDN أو Git LFS بدلاً من ذلك
```

---

## 🌐 CDN للأصول

### متى تستخدم CDN:

- ✅ ترافيك عالي
- ✅ صور كبيرة (>1MB)
- ✅ فيديوهات
- ✅ مواقع متعددة

### الخيارات:

1. **Cloudflare (مجاني):**
   - رفع الأصول على Cloudflare R2
   - أو استخدام Cloudflare Images

2. **AWS S3 + CloudFront:**
   - S3 للتخزين
   - CloudFront للـ CDN

3. **Vercel Blob:**
   - مدمج مع Vercel
   - سهل الاستخدام

### استخدام CDN في الكود:

```tsx
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || ''

<Image
  src={`${CDN_URL}/space/images/hero/hero-space.jpg`}
  alt="Space"
  width={1920}
  height={1080}
/>
```

---

## 📋 Checklist قبل النشر

- [ ] جميع الصور مضغوطة
- [ ] جميع الفيديوهات محسّنة
- [ ] Naming convention متسق
- [ ] Fallback images موجودة
- [ ] CDN configurado (إن وجد)
- [ ] Git LFS setup (للأصول الكبيرة)
- [ ] .gitignore محدث

---

## 🆘 حل المشاكل

### المشكلة: الصور لا تظهر

```bash
# تحقق من:
1. المسار صحيح (يبدأ بـ /)
2. الملف موجود في public/
3. Case-sensitive (Linux/Mac)
4. Next.js Image config
```

### المشكلة: الفيديوهات بطيئة

```bash
# حلول:
1. ضغط الفيديو
2. استخدام CDN
3. تقليل Resolution
4. استخدام poster image
```

### المشكلة: حجم المشروع كبير

```bash
# حلول:
1. استخدام Git LFS
2. رفع الأصول على CDN
3. حذف الأصول غير المستخدمة
4. ضغط الصور
```

---

## 📚 روابط مفيدة

- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [TinyPNG](https://tinypng.com)
- [Squoosh](https://squoosh.app)
- [Git LFS](https://git-lfs.github.com/)

---

**تم التحديث:** 2024
**المشروع:** Space Explorer
