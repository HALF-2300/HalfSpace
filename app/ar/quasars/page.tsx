import PageTemplate from '@/components-ar/PageTemplate'

export default function QuasarsPage() {
  return (
    <PageTemplate
      title="Quasars"
      subtitle="The Brightest Objects in the Universe"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Quasars"
      didYouKnow={[
        "Quasars can outshine entire galaxies by 1,000 times!",
        "Quasars are powered by supermassive black holes!",
        "The most distant quasar is 13 billion light-years away!",
        "A single quasar can emit more energy than 1,000 galaxies!",
      ]}
      sections={[
        {
          title: "What Are Quasars?",
          content: "Quasars (quasi-stellar radio sources) are the most luminous objects in the universe. They appear as star-like points of light but are actually the extremely bright centers of distant galaxies. Quasars are powered by supermassive black holes at the centers of galaxies, surrounded by accretion disks of hot gas and dust. As matter falls into the black hole, it releases enormous amounts of energy.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Quasar"
        },
        {
          title: "Discovery",
          content: "Quasars were discovered in the 1960s when astronomers noticed objects that looked like stars but emitted radio waves and had unusual spectra. They were initially mysterious because they appeared to be moving away from us at incredible speeds, indicated by their extreme redshift. We now know quasars are very distant, very bright galactic nuclei from the early universe.",
        },
        {
          title: "Early Universe",
          content: "Most quasars existed in the early universe, when galaxies were still forming and supermassive black holes were actively feeding. As galaxies matured and black holes consumed available matter, quasars became less common. Today, we see fewer quasars because most supermassive black holes have consumed the nearby matter. Quasars provide a window into the universe's youth.",
        }
      ]}
      facts={[
        { fact: "Quasars can be 100 billion times brighter than the Sun", icon: "☀️" },
        { fact: "The most distant quasar is from when the universe was 670 million years old", icon: "⏰" },
        { fact: "Quasars can have jets extending millions of light-years", icon: "🌌" },
        { fact: "Over 750,000 quasars have been discovered", icon: "🔭" },
      ]}
      relatedLinks={[
        { name: "Black Holes", href: "/ar/black-holes" },
        { name: "Galaxies", href: "/ar/galaxies" },
        { name: "Cosmology", href: "/ar/cosmology" }
      ]}
    />
  )
}

