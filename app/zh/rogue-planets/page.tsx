import PageTemplate from '@/components-ar/PageTemplate'

export default function RoguePlanetsPage() {
  return (
    <PageTemplate
      title="Rogue Planets"
      subtitle="Planets Without Stars"
      heroImage="https://images-assets.nasa.gov/image/PIA22094/PIA22094~orig.jpg"
      heroImageAlt="Rogue Planets"
      didYouKnow={[
        "Rogue planets drift through space without orbiting a star!",
        "There may be billions of rogue planets in our galaxy!",
        "Rogue planets can be ejected from their star systems!",
        "Some rogue planets may have formed independently in space!",
      ]}
      sections={[
        {
          title: "What Are Rogue Planets?",
          content: "Rogue planets, also called free-floating or orphan planets, are planetary-mass objects that don't orbit a star. They drift through interstellar space, untethered to any stellar system. Rogue planets can form in two ways: they may be ejected from their original star systems due to gravitational interactions, or they may form independently from collapsing clouds of gas and dust, similar to how stars form.",
          image: "https://images-assets.nasa.gov/image/PIA22094/PIA22094~orig.jpg",
          imageAlt: "Rogue Planet drifting through space"
        },
        {
          title: "Discovery",
          content: "Rogue planets are extremely difficult to detect because they don't emit much light and aren't near stars to illuminate them. They're typically discovered through gravitational microlensing, where the planet's gravity bends light from background stars. The first confirmed rogue planets were discovered in the 2010s. There may be billions of them in our galaxy alone.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg",
          imageAlt: "Gravitational microlensing detection"
        },
        {
          title: "Conditions",
          content: "Rogue planets would be extremely cold without a nearby star to warm them. However, some might retain heat from their formation or from internal processes. Large rogue planets might have thick atmospheres that trap heat, potentially maintaining liquid water on their surfaces. These could potentially harbor life, though detecting it would be extremely challenging.",
          image: "https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg",
          imageAlt: "Rogue planet conditions"
        }
      ]}
      facts={[
        { fact: "Rogue planets may outnumber stars in our galaxy", icon: "📊" },
        { fact: "Rogue planets are difficult to detect", icon: "🔍" },
        { fact: "Some rogue planets may have moons", icon: "🌙" },
        { fact: "Rogue planets travel through interstellar space", icon: "🌌" },
      ]}
      relatedLinks={[
        { name: "Exoplanets", href: "/zh/exoplanets" },
        { name: "Planets", href: "/zh/planets" },
        { name: "Solar System", href: "/zh/solar-system" }
      ]}
    />
  )
}

