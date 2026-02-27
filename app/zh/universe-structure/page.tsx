import PageTemplate from '@/components-ar/PageTemplate'

export default function UniverseStructurePage() {
  return (
    <PageTemplate
      title="Universe Structure"
      subtitle="The Cosmic Web"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Universe Structure"
      didYouKnow={[
        "The universe has a web-like structure called the cosmic web!",
        "Galaxies form clusters, which form superclusters!",
        "The largest structures are hundreds of millions of light-years across!",
        "Vast cosmic voids separate the filaments of the cosmic web!",
      ]}
      sections={[
        {
          title: "The Cosmic Web",
          content: "The universe has a hierarchical structure that forms a cosmic web. At the smallest scale are stars, which form galaxies. Galaxies group into clusters, clusters into superclusters, and superclusters form filaments that span hundreds of millions of light-years. Between these filaments are vast cosmic voids, regions nearly empty of matter. This structure formed from tiny density fluctuations in the early universe.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Cosmic Web"
        },
        {
          title: "Formation",
          content: "The cosmic web structure formed from quantum fluctuations in the early universe, amplified by gravity over billions of years. Dark matter played a crucial role, providing the gravitational scaffolding around which normal matter collected. As the universe expanded, gravity pulled matter into dense regions (filaments and clusters) while leaving voids nearly empty.",
        },
        {
          title: "Scale",
          content: "The cosmic web spans the observable universe. Filaments can be hundreds of millions of light-years long, while voids can be hundreds of millions of light-years across. The largest known structure, the Hercules-Corona Borealis Great Wall, is about 10 billion light-years across. Understanding this structure helps us understand the universe's evolution and composition.",
        }
      ]}
      facts={[
        { fact: "The cosmic web is the largest known structure", icon: "🌌" },
        { fact: "Voids are nearly empty of matter", icon: "🕳️" },
        { fact: "Filaments contain most of the universe's galaxies", icon: "⭐" },
        { fact: "Dark matter shapes the cosmic web", icon: "🌑" },
      ]}
      relatedLinks={[
        { name: "Galaxies", href: "/zh/galaxies" },
        { name: "Cosmology", href: "/zh/cosmology" },
        { name: "Dark Matter", href: "/zh/dark-matter" }
      ]}
    />
  )
}

