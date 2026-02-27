import PageTemplate from '@/components-ar/PageTemplate'

export default function KuiperBeltPage() {
  return (
    <PageTemplate
      title="Kuiper Belt"
      subtitle="The Outer Solar System"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Kuiper Belt"
      didYouKnow={[
        "The Kuiper Belt extends from Neptune's orbit to about 50 AU from the Sun!",
        "Pluto is the largest known object in the Kuiper Belt!",
        "The Kuiper Belt contains millions of icy objects!",
        "Short-period comets originate from the Kuiper Belt!",
      ]}
      sections={[
        {
          title: "What is the Kuiper Belt?",
          content: "The Kuiper Belt is a region of the Solar System beyond Neptune's orbit, extending from about 30 to 50 astronomical units (AU) from the Sun. It's similar to the asteroid belt but much larger and contains mostly icy objects rather than rocky ones. The Kuiper Belt is home to dwarf planets like Pluto, Eris, and Haumea, as well as millions of smaller icy bodies. It's a remnant from the early Solar System.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Kuiper Belt"
        },
        {
          title: "Discovery",
          content: "The Kuiper Belt was named after Dutch astronomer Gerard Kuiper, who predicted its existence in 1951. However, the first Kuiper Belt object (besides Pluto) wasn't discovered until 1992. Since then, over 2,000 objects have been identified. The belt is thought to contain hundreds of thousands of objects larger than 100 km across, and millions of smaller ones.",
        },
        {
          title: "Dwarf Planets",
          content: "The Kuiper Belt contains several dwarf planets, including Pluto, Eris (which is slightly larger than Pluto), Haumea, and Makemake. These objects are large enough to be rounded by their own gravity but haven't cleared their orbital neighborhood, which is why they're classified as dwarf planets rather than full planets.",
        }
      ]}
      facts={[
        { fact: "The Kuiper Belt is 20 times wider than the asteroid belt", icon: "📏" },
        { fact: "Objects in the Kuiper Belt are mostly ice and rock", icon: "❄️" },
        { fact: "New Horizons explored the Kuiper Belt", icon: "🛰️" },
        { fact: "The Kuiper Belt may extend to 100 AU", icon: "🌌" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/ar/solar-system" },
        { name: "Pluto", href: "/ar/pluto" },
        { name: "Comets", href: "/ar/comets" }
      ]}
    />
  )
}

