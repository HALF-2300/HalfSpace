# Space Theme System

نظام Theme موحّد لصفحات Space - تصميم فضائي جمالي موحّد

## الملفات المضافة

### 1. `space-theme.css`
نظام Design Tokens شامل:
- **Color Tokens**: ألوان موحّدة (backgrounds, primary colors, text colors)
- **Glow Tokens**: تأثيرات التوهج (purple, blue, cyan, pink)
- **Fog Tokens**: تأثيرات الضباب/الضبابية
- **Shadow Tokens**: ظلال موحّدة (sm, md, lg, xl, glow)
- **Spacing Tokens**: فواصل موحّدة (xs, sm, md, lg, xl, 2xl, 3xl)
- **Border Tokens**: حدود موحّدة
- **Transition Tokens**: انتقالات موحّدة
- **Utility Classes**: كلاسات جاهزة للاستخدام

### 2. `space-micro-interactions.css`
تأثيرات تفاعلية دقيقة:
- Card hover lift
- Button glow effects
- Section transitions
- Link hover glow
- Input focus glow
- Image hover scale
- Glass card hover
- Pulse & Shimmer animations

### 3. Components

#### `SpaceHeroOverlay.tsx`
Hero overlay سينمائي قابل لإعادة الاستخدام:
```tsx
<SpaceHeroOverlay
  title="Page Title"
  titleAr="عنوان الصفحة"
  subtitle="Subtitle text"
  variant="cinematic" // 'default' | 'minimal' | 'cinematic'
>
  {/* Your content */}
</SpaceHeroOverlay>
```

#### `SpaceSectionSeparator.tsx`
فواصل أقسام فضائية خفيفة:
```tsx
<SpaceSectionSeparator variant="subtle" /> // 'subtle' | 'glow' | 'gradient' | 'stars'
```

#### `SpaceStarfieldToggle.tsx`
خلفية Starfield اختيارية مع toggle للكثافة:
```tsx
<SpaceStarfieldToggle
  defaultIntensity="medium" // 'off' | 'low' | 'medium' | 'high'
  showToggle={true}
/>
```

## كيفية الاستخدام

### في صفحات Space الجديدة:

```tsx
'use client'

import SpaceHeroOverlay from '@/components/space/theme/SpaceHeroOverlay'
import SpaceSectionSeparator from '@/components/space/theme/SpaceSectionSeparator'
import SpaceStarfieldToggle from '@/components/space/theme/SpaceStarfieldToggle'

export default function MySpacePage() {
  return (
    <div className="min-h-screen relative">
      {/* Optional Starfield */}
      <SpaceStarfieldToggle defaultIntensity="medium" />
      
      {/* Hero Section */}
      <SpaceHeroOverlay
        title="My Page"
        titleAr="صفحتي"
        variant="cinematic"
      >
        <p>Hero content here</p>
      </SpaceHeroOverlay>

      {/* Content Section */}
      <section className="space-section relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-glass-card p-6">
            <h2 className="space-text-gradient">Section Title</h2>
            <p>Content here</p>
          </div>
        </div>
      </section>

      {/* Separator */}
      <SpaceSectionSeparator variant="glow" />

      {/* Another Section */}
      <section className="space-section relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-card space-glass p-6">
                <h3>Card {i}</h3>
                <p>Card content</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Utility Classes المتاحة:

#### Glass Morphism
```tsx
<div className="space-glass">Glass card</div>
<div className="space-glass space-glass-hover">Hoverable glass</div>
```

#### Text Gradient
```tsx
<h1 className="space-text-gradient">Gradient Text</h1>
```

#### Glow Effects
```tsx
<div className="space-glow-purple">Purple glow</div>
<div className="space-glow-blue">Blue glow</div>
<div className="space-glow-cyan">Cyan glow</div>
```

#### Card Hover Lift
```tsx
<div className="space-card space-glass">Card with hover lift</div>
```

#### Button Glow
```tsx
<button className="space-btn space-button-glow">Glowing Button</button>
```

#### Section Transitions
```tsx
<section className="space-section">Animated section</section>
```

## التكامل مع الصفحات الحالية

الـ Theme System مرتبط تلقائياً في `app/space/layout.tsx`، لذا جميع صفحات Space يمكنها استخدام:
- CSS Variables (tokens)
- Utility Classes
- Components الجديدة

**ملاحظة مهمة**: لا تغيّر الصفحات القديمة - فقط استخدم الـ theme في الصفحات الجديدة أو عند إضافة ميزات جديدة.

## Design Tokens

جميع الـ tokens متاحة كـ CSS Variables:

```css
/* Colors */
var(--space-bg-deep)
var(--space-purple)
var(--space-blue)

/* Glow */
var(--space-glow-purple)
var(--space-glow-soft)

/* Shadows */
var(--space-shadow-glow)
var(--space-shadow-xl)

/* Spacing */
var(--space-spacing-lg)
var(--space-spacing-xl)

/* Transitions */
var(--space-transition-smooth)
```

## Accessibility

- يدعم `prefers-reduced-motion` لإيقاف الحركات
- جميع الألوان تتبع معايير Contrast Ratio
- Focus states واضحة ومحددة
