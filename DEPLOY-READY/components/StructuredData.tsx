import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/seo'

/**
 * Structured Data component for SEO
 * Adds JSON-LD structured data to the page head
 * Note: JSON-LD is critical for SEO, loaded in head
 */
export default function StructuredData() {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()
  
  // Educational organization schema for space education content
  const educationalSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Space Explorer',
    description: 'Comprehensive space and astronomy education for kids, students, and researchers worldwide',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
    educationalLevel: ['Elementary', 'Middle School', 'High School', 'Undergraduate', 'Graduate', 'Professional'],
    knowsAbout: [
      'Astronomy', 'Astrophysics', 'Space Exploration', 'Planetary Science',
      'Cosmology', 'Astrobiology', 'Exoplanets', 'Black Holes', 'Galaxies'
    ],
  }

  return (
    <>
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        id="educational-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />
    </>
  )
}
