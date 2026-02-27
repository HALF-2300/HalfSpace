# Space Health & Stability Pack

## نظرة عامة

حزمة "Space QA + Stability Pack" توفر نظام تشخيص ومراقبة شامل لضمان استقرار وثبات محتوى Space. تمنع هذه الحزمة اختفاء المحتوى أو انهيار الصفحات عند غياب ملفات البيانات.

## المكونات

### 1. صفحة التشخيص (`/space/health`)

صفحة تشخيصية شاملة تعرض:

- **قائمة Routes**: جميع Routes الخاصة بالفضاء المكتشفة من:
  - `data/spaceSitemap.json` (routes من sitemap)
  - `data/spaceSections.ts` (sections من space sections)
- **حالة ملفات البيانات**: حالة تحميل كل ملف بيانات (OK/Failed) مع رسائل واضحة
- **زر "Run Self-Check"**: يفحص:
  - وجود الملفات
  - صحة JSON (parse)
  - وجود حقول أساسية (id/title/tags/route)

#### الوصول

```
http://localhost:9200/space/health
```

### 2. SpaceDataGuard Component

Guard عام يحمي مكونات Space من ملفات البيانات المفقودة. يعرض Empty state محترم بدلاً من crash.

#### الاستخدام

```tsx
import SpaceDataGuard from '@/components/space/SpaceDataGuard'

// استخدام أساسي
<SpaceDataGuard>
  <YourComponent />
</SpaceDataGuard>

// مع تحديد مصدر البيانات
<SpaceDataGuard dataSource="spaceLibrary.json" requiredFields={['id', 'title']}>
  <LibraryComponent />
</SpaceDataGuard>

// مع fallback مخصص
<SpaceDataGuard 
  dataSource="atlas.json"
  fallback={<CustomEmptyState />}
>
  <AtlasComponent />
</SpaceDataGuard>
```

#### الميزات

- فحص تلقائي لوجود ملفات البيانات
- التحقق من صحة JSON
- التحقق من وجود الحقول المطلوبة
- عرض Empty state محترم عند فشل التحميل
- رابط مباشر لصفحة التشخيص

### 3. Health Report Generator

يتم توليد تقرير صحة تلقائي في:

```
data/space/healthReport.json
```

#### محتوى التقرير

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "overallStatus": "ok" | "warning" | "error",
  "dataFiles": [
    {
      "path": "data/spaceLibrary.json",
      "status": "ok" | "failed",
      "message": "OK",
      "errors": [],
      "hasRequiredFields": true
    }
  ],
  "routes": {
    "sitemap": [...],
    "sections": [...]
  },
  "errors": []
}
```

#### التوليد

- **تلقائي**: عند زيارة `/space/health` والضغط على "Run Self-Check"
- **يدوي**: عبر API endpoint `/api/space-health`

### 4. API Endpoint

```
GET /api/space-health
```

يقوم بفحص جميع ملفات البيانات وإرجاع تقرير صحة كامل.

## ملفات البيانات المفحوصة

الحزمة تفحص الملفات التالية:

### ملفات رئيسية
- `spaceSitemap.json`
- `spaceKnowledgeHub.json`
- `courseV2.json`
- `quizzes.json`
- `handbook.json`
- `atlas.json`
- `gallery.json`
- `spaceLibrary.json`
- `myths.json`
- `mythQuiz.json`
- `blackHoleLab.copy.json`
- `observatory2.json`
- `spaceWhatsNew.json`
- `spaceLabContent.json`
- `exploreStats.json`
- `spaceShowcaseGallery.json`
- `factOfDay.json`
- `glossaryMini.json`
- `timelineMini.json`
- `didYouKnowMini.json`
- `eras.json`
- `changelog.json`
- `news.json`
- `observatoryGallery.json`
- `universeMap.json`
- `glossary.json`
- `timeline.json`
- `facts.json`

### ملفات الموسوعة
- `encyclopedia/beginnings.json`
- `encyclopedia/stars.json`
- `encyclopedia/galaxies.json`
- `encyclopedia/black-holes.json`
- `encyclopedia/planets.json`
- `encyclopedia/beginnings-extended.json`
- `encyclopedia/stars-extended.json`
- `encyclopedia/galaxies-extended.json`
- `encyclopedia/black-holes-extended.json`
- `encyclopedia/planets-extended.json`
- `encyclopedia/telescopes-extended.json`

## الحقول المطلوبة

كل ملف بيانات يتم فحصه للتأكد من وجود الحقول الأساسية:

- **ملفات عامة**: `id`, `title`
- **spaceSitemap.json**: `version`, `routes`
- **exploreStats.json**: `facts`, `missions`

## التكامل

### في Layout

تم دمج `SpaceDataGuard` في `app/space/layout.tsx` بشكل minimal:

```tsx
<SpaceErrorBoundary>
  <SpaceDataGuard>{children}</SpaceDataGuard>
</SpaceErrorBoundary>
```

هذا يوفر حماية عامة لجميع صفحات Space.

### في صفحات محددة

يمكن استخدام Guard في صفحات محددة للتحقق من ملفات بيانات معينة:

```tsx
// app/space/library/page.tsx
import SpaceDataGuard from '@/components/space/SpaceDataGuard'

export default function LibraryPage() {
  return (
    <SpaceDataGuard dataSource="spaceLibrary.json">
      <LibraryContent />
    </SpaceDataGuard>
  )
}
```

## الاختبار

### خطوات التشغيل السريعة

1. **تشغيل السيرفر**:
   ```bash
   npm run dev
   ```

2. **زيارة صفحة التشخيص**:
   ```
   http://localhost:9200/space/health
   ```

3. **تشغيل Self-Check**:
   - اضغط على زر "Run Self-Check"
   - انتظر النتائج
   - راجع حالة كل ملف بيانات

4. **فحص التقرير**:
   ```bash
   cat data/space/healthReport.json
   ```

5. **اختبار Guard**:
   - احذف ملف بيانات مؤقتًا (مثل `spaceLibrary.json`)
   - زر صفحة تستخدم هذا الملف
   - يجب أن ترى Empty state بدلاً من crash

### سيناريوهات الاختبار

#### ✅ حالة صحية
- جميع الملفات موجودة
- JSON صحيح
- الحقول المطلوبة موجودة
- الحالة: `ok`

#### ⚠️ حالة تحذير
- بعض الملفات مفقودة (< 50%)
- الحالة: `warning`

#### ❌ حالة خطأ
- أكثر من 50% من الملفات مفقودة
- أخطاء JSON متعددة
- الحالة: `error`

## الأمان والاستقرار

### الحماية من الاختفاء

- **Error Boundary**: يلتقط أخطاء JavaScript
- **Data Guard**: يفحص البيانات قبل التحميل
- **Empty State**: يعرض واجهة محترمة عند فشل التحميل

### عدم التأثير على الملفات القديمة

- جميع التعديلات داخل `space` فقط
- التعديلات على الملفات القديمة minimal (ربط فقط)
- لا حذف أو إعادة هيكلة

## الملفات المضافة

```
app/space/health/page.tsx          # صفحة التشخيص
app/api/space-health/route.ts       # API endpoint للفحص
components/space/SpaceDataGuard.tsx # Guard component
lib/space-health-checker.ts         # Utility types
data/space/healthReport.json        # تقرير الصحة (يتم توليده)
docs/SPACE_HEALTH.md                # هذا الملف
```

## الملفات المعدلة

```
app/space/layout.tsx                # إضافة SpaceDataGuard (minimal)
```

## الصيانة

### إضافة ملفات بيانات جديدة

عند إضافة ملف بيانات جديد، أضفه إلى:

1. `SPACE_DATA_FILES` في `app/api/space-health/route.ts`
2. `REQUIRED_FIELDS` إذا كان يحتاج حقول خاصة

### تحديث الحقول المطلوبة

عدّل `REQUIRED_FIELDS` في `app/api/space-health/route.ts`:

```typescript
const REQUIRED_FIELDS: Record<string, string[]> = {
  'yourFile.json': ['id', 'title', 'customField'],
}
```

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:

1. راجع صفحة التشخيص: `/space/health`
2. افحص `data/space/healthReport.json`
3. راجع console للأخطاء

---

**تم التطوير**: Space QA + Stability Pack  
**الهدف**: ثبات + حماية من الاختفاء  
**النطاق**: داخل `space` فقط
