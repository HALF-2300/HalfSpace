# إعداد AI Gateway وموقع المفتاح

## 1) على السيرفر (nginx)

- نسخ الملف: `deploy/nginx/ai-gateway.conf` → `/etc/nginx/conf.d/ai-gateway.conf`
- **غيّر المفتاح** في السطر:
  ```nginx
  if ($http_x_site_key != "HSPS_ChangeMe_32chars") { return 401; }
  ```
  إلى نفس القيمة اللي تحطها في الموقع (انظر 2).
- ثم:
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

## 2) أين تحط المفتاح في الموقع؟

المفتاح **لا يُحفظ في الكود** بل في **متغير البيئة** حتى لا يظهر في الريبو.

### إذا الودجت داخل Next (أو Pages) ويستدعي الـ API من المتصفح (client):

1. في **Cloudflare Pages**:  
   **Settings → Environment variables**  
   أضف:
   - **Name:** `NEXT_PUBLIC_AI_SITE_KEY`  
   - **Value:** نفس المفتاح اللي في nginx (مثلاً `HSPS_ChangeMe_32chars` أو مفتاحك الحقيقي 32 حرف)

2. في **التطبيق/الودجت** استخدم المتغير عند الطلب:

```ts
// مثال من الودجت أو أي صفحة
const siteKey = process.env.NEXT_PUBLIC_AI_SITE_KEY;

fetch("https://ai.halfspeace.space/chat", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-site-key": siteKey || "",
  },
  body: JSON.stringify({ msg: "hi" }),
});
```

- `NEXT_PUBLIC_` يسمح لـ Next بدمج القيمة في الـ bundle عند البناء، لذلك **يجب** تعيين المتغير في Cloudflare قبل الـ build.
- الطلبات من غير دومينك (Origin غير halfspeace.space) أو بدون المفتاح الصحيح ترجع 401/403 من nginx.

### إذا عندك سيرفر Next (Node) أو استضافة تدعم API routes:

يمكنك استخدام مفتاح سري **بدون** `NEXT_PUBLIC_` في `.env.local`:

- **Name:** `AI_SITE_KEY`  
- استخدامه في API route يوجه الطلبات إلى `https://ai.halfspeace.space/chat` ويضيف الهيدر `x-site-key` من السيرفر فقط (المفتاح لا يصل للمتصفح).

## ملخص

| المكان              | ماذا تفعل |
|---------------------|-----------|
| السيرفر (nginx)     | نفس قيمة المفتاح في شرط `$http_x_site_key` |
| Cloudflare Pages    | متغير `NEXT_PUBLIC_AI_SITE_KEY` = نفس المفتاح |
| كود الودجت          | `x-site-key: process.env.NEXT_PUBLIC_AI_SITE_KEY` |

بعد أي تغيير في المتغيرات على Cloudflare: أعد **Build** ثم **Deploy**.
