# 📦 Space Assets Directory

هذا المجلد يحتوي على أصول الموقع الفضائي (صور، فيديوهات، textures).

## 📁 الهيكل

```
space/
├── images/          # الصور
│   ├── hero/       # صور الهيرو
│   ├── planets/    # صور الكواكب
│   ├── stars/      # صور النجوم
│   ├── galaxies/   # صور المجرات
│   ├── missions/   # صور المهمات
│   └── nebulae/    # صور السدم
├── videos/         # الفيديوهات
│   ├── hero/       # فيديوهات الهيرو
│   ├── animations/ # Animations
│   └── backgrounds/# فيديوهات خلفية
└── textures/       # Textures
    ├── starfield/  # Textures النجوم
    ├── nebula/     # Textures السدم
    └── planets/    # Textures الكواكب
```

## 📝 Naming Convention

راجع `docs/ASSETS_GUIDE.md` للتفاصيل الكاملة.

**الصور:** `{category}-{name}-{size}.{ext}`
**الفيديوهات:** `{category}-{name}-{duration}.{ext}`
**Textures:** `{type}-{name}-{size}.{ext}`

## 🎯 الاستخدام

```tsx
// صور محلية
<Image src="/space/images/hero/hero-space.jpg" />

// فيديوهات
<video src="/space/videos/hero/intro.mp4" />

// Textures
<div style={{ backgroundImage: 'url(/space/textures/starfield.png)' }} />
```

## ⚠️ ملاحظات

- لا ترفع ملفات كبيرة (>10MB) على Git
- استخدم Git LFS للأصول الكبيرة
- أو ارفع على CDN
- راجع `docs/ASSETS_GUIDE.md` للتفاصيل
