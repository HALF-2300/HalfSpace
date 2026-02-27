import PageTemplate from '@/components-ar/PageTemplate'

export default function InterstellarMediumPage() {
  return (
    <PageTemplate
      title="Interstellar Medium"
      subtitle="The Space Between Stars"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Interstellar Medium"
      didYouKnow={[
        "The space between stars is not empty - it's filled with gas and dust!",
        "The interstellar medium is where new stars are born!",
        "The interstellar medium contains 99% of the visible matter in galaxies!",
        "Voyager spacecraft have entered the interstellar medium!",
      ]}
      sections={[
        {
          title: "What is the Interstellar Medium?",
          content: "The interstellar medium (ISM) is the matter and radiation that exists in the space between stars within a galaxy. It's composed of gas (mostly hydrogen and helium), dust, cosmic rays, and magnetic fields. Despite appearing empty, the ISM contains about 99% of the visible matter in galaxies. It's the material from which new stars form and where old stars return their material.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Interstellar Medium"
        },
        {
          title: "Composition",
          content: "The ISM is about 99% gas and 1% dust by mass. The gas is mostly hydrogen (about 70%) and helium (about 28%), with trace amounts of heavier elements. The dust consists of tiny solid particles, including silicates, carbon, and ice. These particles are crucial for star formation as they help cool the gas, allowing it to collapse into stars.",
        },
        {
          title: "Star Formation",
          content: "The ISM is where stars are born. When regions of the ISM become dense enough, gravity causes them to collapse, forming new stars. After stars die, they return material to the ISM through stellar winds, planetary nebulae, and supernovae. This creates a cycle of star birth and death, enriching the ISM with heavy elements over time.",
        }
      ]}
      facts={[
        { fact: "The ISM is mostly hydrogen and helium", icon: "⚛️" },
        { fact: "Dust grains are smaller than a micron", icon: "🌫️" },
        { fact: "The ISM has different phases: cold, warm, and hot", icon: "🌡️" },
        { fact: "Voyager 1 entered the ISM in 2012", icon: "🚀" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/ar/stars" },
        { name: "Nebulae", href: "/ar/nebulae" },
        { name: "Galaxies", href: "/ar/galaxies" }
      ]}
    />
  )
}

