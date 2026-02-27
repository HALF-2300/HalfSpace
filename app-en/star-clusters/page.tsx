import PageTemplate from '@/components/PageTemplate'

export default function StarClustersPage() {
  return (
    <PageTemplate
      title="Star Clusters"
      subtitle="Stellar Families"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Star Clusters"
      didYouKnow={[
        "Globular clusters can contain millions of stars!",
        "Star clusters are born from the same nebula!",
        "The Pleiades is a famous open cluster visible to the naked eye!",
        "Globular clusters are among the oldest objects in the universe!",
      ]}
      sections={[
        {
          title: "What Are Star Clusters?",
          content: "Star clusters are groups of stars that formed together from the same molecular cloud. They're held together by gravity and provide valuable insights into stellar evolution. There are two main types: open clusters, which are loose groups of young stars, and globular clusters, which are dense, spherical collections of old stars. Studying clusters helps astronomers understand how stars form and evolve.",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Star Cluster"
        },
        {
          title: "Open Clusters",
          content: "Open clusters contain dozens to thousands of relatively young stars, typically less than a few hundred million years old. They're found in the spiral arms of galaxies and are loosely bound by gravity. Famous examples include the Pleiades (Seven Sisters) and the Hyades. Over time, open clusters gradually disperse as stars drift apart due to gravitational interactions.",
        },
        {
          title: "Globular Clusters",
          content: "Globular clusters are spherical collections of hundreds of thousands to millions of old stars, tightly bound by gravity. They orbit galaxies in a halo around the galactic center. Globular clusters are among the oldest objects in the universe, with ages of 10-13 billion years. They provide crucial information about the early universe and galaxy formation.",
        }
      ]}
      facts={[
        { fact: "The Milky Way has about 150 globular clusters", icon: "🌌" },
        { fact: "Some globular clusters are 13 billion years old", icon: "⏰" },
        { fact: "The Pleiades contains about 1,000 stars", icon: "⭐" },
        { fact: "Globular clusters can be 100 light-years across", icon: "📏" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/stars" },
        { name: "Galaxies", href: "/galaxies" },
        { name: "Nebulae", href: "/nebulae" }
      ]}
    />
  )
}

