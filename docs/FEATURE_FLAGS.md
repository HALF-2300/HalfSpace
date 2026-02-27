# 🚩 Feature Flags Guide

دليل استخدام Feature Flags في المشروع.

---

## 📋 ما هي Feature Flags؟

Feature Flags تسمح لك بتفعيل/تعطيل ميزات بدون تغيير الكود أو إعادة النشر.

---

## 🎯 Feature Flags المتاحة

### SPACE_SITE_MODE

**الوصف:** إذا `true`، يوجّه الصفحة الرئيسية (`/`) إلى `/space` (إذا كان موجود).

**القيمة:** `true` أو `false`

**Default:** `false`

**الاستخدام:**

```bash
# في .env
SPACE_SITE_MODE=true
```

**في الكود:**

```typescript
import { isSpaceSiteMode, getHomeRedirect } from '@/utils/featureFlags'

// التحقق من الحالة
if (isSpaceSiteMode()) {
  // Space mode مفعّل
}

// الحصول على redirect path
const redirectPath = getHomeRedirect()
if (redirectPath) {
  redirect(redirectPath)  // يوجّه لـ /space
}
```

---

## 🔧 إضافة Feature Flag جديد

### 1. أضف في `.env.example`:

```bash
# Feature Flag جديد
NEW_FEATURE_ENABLED=false
```

### 2. أضف في `utils/featureFlags.ts`:

```typescript
export function isNewFeatureEnabled(): boolean {
  return process.env.NEW_FEATURE_ENABLED === 'true'
}
```

### 3. استخدم في الكود:

```typescript
import { isNewFeatureEnabled } from '@/utils/featureFlags'

if (isNewFeatureEnabled()) {
  // الميزة الجديدة
} else {
  // الكود القديم
}
```

---

## 📝 Best Practices

1. **استخدم Default Values:**
   ```typescript
   // ✅ صحيح
   return process.env.FEATURE_FLAG === 'true'
   
   // ❌ خطأ - قد يكون undefined
   return process.env.FEATURE_FLAG
   ```

2. **Document في `.env.example`:**
   ```bash
   # Feature Flag: وصف واضح
   FEATURE_FLAG=false
   ```

3. **لا ترفع `.env` على Git:**
   - استخدم `.env.example` فقط
   - في Production، استخدم Environment Variables في منصة الاستضافة

---

## 🚀 في Production

### Vercel:
1. Settings → Environment Variables
2. أضف: `SPACE_SITE_MODE=true`
3. Redeploy

### Netlify:
1. Site settings → Environment variables
2. أضف: `SPACE_SITE_MODE=true`
3. Redeploy

### VPS:
```bash
# في .env على الخادم
SPACE_SITE_MODE=true

# إعادة تشغيل
pm2 restart space-explorer
```

---

## 🆘 Troubleshooting

### المشكلة: Feature Flag لا يعمل

```bash
# تحقق من:
1. Environment variable موجودة
2. القيمة صحيحة (true/false)
3. إعادة تشغيل الخادم بعد التغيير
4. في Next.js، تحتاج rebuild
```

### المشكلة: لا يمكن قراءة Environment Variable

```typescript
// في Next.js:
// - NEXT_PUBLIC_* متاحة في Client
// - بدون NEXT_PUBLIC_ متاحة فقط في Server

// ✅ Server Component
export default function ServerComponent() {
  const flag = process.env.SPACE_SITE_MODE
}

// ❌ Client Component (يحتاج NEXT_PUBLIC_)
'use client'
export default function ClientComponent() {
  const flag = process.env.NEXT_PUBLIC_SPACE_SITE_MODE
}
```

---

## 📚 روابط مفيدة

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Feature Flags Best Practices](https://www.martinfowler.com/articles/feature-toggles.html)

---

**تم التحديث:** 2024
**المشروع:** Space Explorer
