"use client";
import { routes } from '@/core/lib/routes';
import { usePathname } from 'next/navigation';

const DynamicPageLabel = () => {
  const pathname = usePathname();

  const currentLabel = () => {
    // ۱. اول دقیق مطابقت کن
    const exactMatch = routes.find(r => r.path === pathname);
    if (exactMatch) return exactMatch.label;

    // ۲. بعد طولانی‌ترین مسیر رو پیدا کن
    const matches = routes
      .filter(route => pathname.startsWith(route.path))
      .sort((a, b) => b.path.length - a.path.length); // طولانی‌ترین اول

    return matches[0]?.label || "مسیر نامشخص";
  };

  return (
    <div>
      <h3 className="font-extrabold text-zinc-700 text-xl md:text-2xl">
        {currentLabel()}
      </h3>
    </div>
  );
};

export default DynamicPageLabel;