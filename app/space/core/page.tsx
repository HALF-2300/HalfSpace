import { Suspense } from 'react';
import { Metadata } from 'next';
import CoreClient from './CoreClient';

export const metadata: Metadata = {
  title: 'العقل الكوني | Cosmic Mind',
  description: 'نظام المعرفة الكونية المترابط - استكشف، تعلم، وابنِ رحلتك الشخصية عبر الكون',
};

/**
 * صفحة العقل الكوني - /space/core
 * نظام فهم وترابط ورحلة شخصية داخل الموقع
 */
export default function CosmicCorePage() {
  return (
    <Suspense fallback={<CoreLoadingFallback />}>
      <CoreClient />
    </Suspense>
  );
}

/**
 * Fallback أثناء التحميل
 */
function CoreLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🧠</div>
        <h2 className="text-2xl font-bold text-white mb-2">جاري تحميل العقل الكوني...</h2>
        <p className="text-gray-400">Loading Cosmic Mind...</p>
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
