import PageTemplate from '@/components-ar/PageTemplate'

export default function CometsPage() {
  return (
    <PageTemplate
      title="Comets"
      subtitle="Icy Visitors from the Outer Solar System"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Comet"
      didYouKnow={[
        "Comets are called 'dirty snowballs' because they're made of ice, dust, and rock!",
        "Halley's Comet returns every 76 years - next appearance: 2061!",
        "A comet's tail always points away from the Sun due to solar wind.",
        "Comets may have brought water and organic molecules to early Earth.",
      ]}
      sections={[
        {
          title: "What Are Comets?",
          content: "Comets are icy bodies that orbit the Sun, often called 'dirty snowballs' because they're composed of ice, dust, and rocky material. When comets approach the Sun, the heat causes their ices to vaporize, creating spectacular tails that can stretch millions of kilometers. Comets are remnants from the formation of the Solar System and provide clues about its early history. They preserve material from 4.6 billion years ago.",
        },
        {
          title: "Comet Structure",
          content: "A comet consists of a nucleus (the solid core), a coma (the cloud of gas and dust around the nucleus), and tails. Comets have two types of tails: a dust tail that follows the comet's path, and an ion tail that points away from the Sun due to the solar wind. The nucleus is typically only a few kilometers across, but the coma and tails can be enormous. The Rosetta mission landed a probe on comet 67P/Churyumov-Gerasimenko in 2014.",
        },
        {
          title: "Where Comets Come From",
          content: "Most comets originate from two regions: the Kuiper Belt, a disk of icy objects beyond Neptune, and the Oort Cloud, a spherical shell of comets surrounding the Solar System at distances up to 100,000 astronomical units. When gravitational perturbations send these objects toward the Sun, they become comets. Short-period comets come from the Kuiper Belt, while long-period comets come from the Oort Cloud.",
        }
      ]}
      facts={[
        { fact: "Halley's Comet is visible every 76 years", icon: "☄️" },
        { fact: "Comet tails can be millions of kilometers long", icon: "💫" },
        { fact: "The Oort Cloud may contain trillions of comets", icon: "☁️" },
        { fact: "Comets have two tails: dust and ion", icon: "🌠" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/zh/solar-system" },
        { name: "Asteroids", href: "/zh/asteroids" },
        { name: "Planets", href: "/zh/planets" }
      ]}
    />
  )
}

