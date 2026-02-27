import PageTemplate from '@/components-ar/PageTemplate'

export default function OortCloudPage() {
  return (
    <PageTemplate
      title="Oort Cloud"
      subtitle="The Solar System's Outer Edge"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Oort Cloud"
      didYouKnow={[
        "The Oort Cloud may contain trillions of icy objects!",
        "The Oort Cloud extends up to 100,000 AU from the Sun!",
        "Long-period comets come from the Oort Cloud!",
        "No spacecraft has ever reached the Oort Cloud - it's too far!",
      ]}
      sections={[
        {
          title: "The Distant Cloud",
          content: "The Oort Cloud is a theoretical spherical shell of icy objects surrounding the Solar System at distances from 2,000 to 100,000 astronomical units (AU) from the Sun. It's named after Dutch astronomer Jan Oort, who first proposed its existence. The Oort Cloud is so far away that it's never been directly observed, but its existence is inferred from the orbits of long-period comets.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Oort Cloud"
        },
        {
          title: "Comet Source",
          content: "The Oort Cloud is the source of long-period comets that take thousands or millions of years to orbit the Sun. When gravitational perturbations from passing stars or the galactic tide disturb objects in the Oort Cloud, some fall inward toward the Sun, becoming comets. These comets can have highly elliptical orbits that bring them from the outer Solar System to close encounters with the Sun.",
        },
        {
          title: "Size and Composition",
          content: "The Oort Cloud is thought to contain trillions of icy objects, mostly composed of water, methane, and ammonia ices. These objects are remnants from the early Solar System that were scattered outward by the gravity of the giant planets. The outer edge of the Oort Cloud marks the boundary of the Sun's gravitational influence.",
        }
      ]}
      facts={[
        { fact: "The Oort Cloud is 1,000 times farther than the Kuiper Belt", icon: "📏" },
        { fact: "It takes light 1.5 years to travel from the Sun to the Oort Cloud", icon: "💫" },
        { fact: "The Oort Cloud may extend halfway to the nearest star", icon: "⭐" },
        { fact: "Objects in the Oort Cloud are loosely bound to the Sun", icon: "🌌" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/zh/solar-system" },
        { name: "Comets", href: "/zh/comets" },
        { name: "Kuiper Belt", href: "/zh/kuiper-belt" }
      ]}
    />
  )
}

