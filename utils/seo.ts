/**
 * SEO utilities for meta tags, OpenGraph, and structured data
 */

import type { Metadata } from 'next'

function getSiteUrl(): string | undefined {
  const v =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_URL;
  if (!v) return undefined;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
}

interface SEOConfig {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  siteName?: string
  locale?: string
  keywords?: string[]
}

/**
 * Generate default metadata with OpenGraph and Twitter cards
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    image = 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    url,
    type = 'website',
    siteName = 'Space Explorer',
    locale = 'en',
    keywords = []
  } = config

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const siteUrl = getSiteUrl()

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: 'Space Explorer Team' }],
    creator: 'Space Explorer',
    publisher: 'Space Explorer',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        'en': url || '/',
        'ar': url ? `${url}?lang=ar` : '/?lang=ar',
        'es': url ? `${url}?lang=es` : '/?lang=es',
        'fr': url ? `${url}?lang=fr` : '/?lang=fr',
        'de': url ? `${url}?lang=de` : '/?lang=de',
        'zh': url ? `${url}?lang=zh` : '/?lang=zh',
        'ja': url ? `${url}?lang=ja` : '/?lang=ja',
        'hi': url ? `${url}?lang=hi` : '/?lang=hi',
        'pt': url ? `${url}?lang=pt` : '/?lang=pt',
        'ru': url ? `${url}?lang=ru` : '/?lang=ru',
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@spaceexplorer',
    },
  }
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema(): object {
  const siteUrl = getSiteUrl() || 'https://example.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HalfSPACE',
    url: siteUrl,
    logo: `${siteUrl}/space-icon.svg`,
    description: 'Explore the vast universe, planets, stars, galaxies, and space missions. Interactive quizzes, timelines, facts, and cinematic visuals.',
    sameAs: [
      // Add social media links if available
    ],
  }
}

/**
 * Generate Website structured data (JSON-LD)
 */
export function generateWebsiteSchema(siteUrl?: string): object {
  const resolved = siteUrl || getSiteUrl() || 'https://example.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HalfSPACE',
    url: resolved,
    description: 'Your ultimate guide to space exploration',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${resolved}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Article structured data (for blog posts or detailed pages)
 */
export function generateArticleSchema(config: {
  title: string
  description: string
  image?: string
  url?: string
  author?: string
  datePublished?: string
  dateModified?: string
}): object {
  const {
    title,
    description,
    image = 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    url,
    author = 'HalfSPACE Team',
    datePublished,
    dateModified,
  } = config
  const siteUrl = getSiteUrl() || 'https://example.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HalfSPACE',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/space-icon.svg`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
  }
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
