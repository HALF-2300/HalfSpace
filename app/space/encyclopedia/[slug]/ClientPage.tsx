"use client";

import { useEffect, useState } from "react";

import EncyclopediaArticle from "@/components/encyclopedia/EncyclopediaArticle";
import SpaceFactsWidget from "@/components/SpaceFactsWidget";
import { RelatedContent } from "@/components/SpaceSearch";

// Import all encyclopedia data
import beginningsData from "@/data/encyclopedia/beginnings.json";
import starsData from "@/data/encyclopedia/stars.json";
import galaxiesData from "@/data/encyclopedia/galaxies.json";
import blackHolesData from "@/data/encyclopedia/black-holes.json";
import planetsData from "@/data/encyclopedia/planets.json";
// Extended articles (ADDITIONS ONLY)
import beginningsExtended from "@/data/encyclopedia/beginnings-extended.json";
import starsExtended from "@/data/encyclopedia/stars-extended.json";
import galaxiesExtended from "@/data/encyclopedia/galaxies-extended.json";
import blackHolesExtended from "@/data/encyclopedia/black-holes-extended.json";
import planetsExtended from "@/data/encyclopedia/planets-extended.json";
import telescopesExtended from "@/data/encyclopedia/telescopes-extended.json";

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  icon: string;
  category: string;
  summary_en: string;
  summary_ar: string;
  content_en: string;
  content_ar: string;
}

export default function ClientPage({ slug }: { slug: string }) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Search for article by slug in all categories (including extended)
    const allArticles = [
      ...beginningsData.articles,
      ...beginningsExtended.articles,
      ...starsData.articles,
      ...starsExtended.articles,
      ...galaxiesData.articles,
      ...galaxiesExtended.articles,
      ...blackHolesData.articles,
      ...blackHolesExtended.articles,
      ...planetsData.articles,
      ...planetsExtended.articles,
      ...telescopesExtended.articles,
    ];

    const found = allArticles.find((a) => a.slug === slug);
    if (found) {
      // Add category based on which file it came from
      let category = "";
      if (
        beginningsData.articles.find((a) => a.id === found.id) ||
        beginningsExtended.articles.find((a) => a.id === found.id)
      )
        category = beginningsData.category_en;
      else if (
        starsData.articles.find((a) => a.id === found.id) ||
        starsExtended.articles.find((a) => a.id === found.id)
      )
        category = starsData.category_en;
      else if (
        galaxiesData.articles.find((a) => a.id === found.id) ||
        galaxiesExtended.articles.find((a) => a.id === found.id)
      )
        category = galaxiesData.category_en;
      else if (
        blackHolesData.articles.find((a) => a.id === found.id) ||
        blackHolesExtended.articles.find((a) => a.id === found.id)
      )
        category = blackHolesData.category_en;
      else if (
        planetsData.articles.find((a) => a.id === found.id) ||
        planetsExtended.articles.find((a) => a.id === found.id)
      )
        category = planetsData.category_en;
      else if (telescopesExtended.articles.find((a) => a.id === found.id))
        category = telescopesExtended.category_en;

      setArticle({
        ...found,
        category,
        content_ar: (found as Partial<Article>).content_ar ?? "",
      });
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen pt-20 px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            {lang === "ar" ? "المقال غير موجود" : "Article Not Found"}
          </h1>
          <a
            href="/space/encyclopedia"
            className="text-purple-400 hover:text-purple-300"
          >
            {lang === "ar" ? "العودة إلى الموسوعة" : "Back to Encyclopedia"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article - Takes 3 columns */}
          <div className="lg:col-span-3">
            <EncyclopediaArticle article={article} lang={lang} />
            <RelatedContent
              id={article.id}
              type="article"
              title={lang === "ar" ? "محتوى مرتبط" : "Related content"}
            />
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            <SpaceFactsWidget lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
