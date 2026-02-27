import PageTemplate from '@/components-ar/PageTemplate'

export default function HabitableZonePage() {
  return (
    <PageTemplate
      title="Habitable Zone"
      subtitle="The Goldilocks Zone"
      heroImage="https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg"
      heroImageAlt="Habitable Zone"
      didYouKnow={[
        "The habitable zone is where liquid water can exist on a planet's surface!",
        "Earth is in the Sun's habitable zone!",
        "The habitable zone depends on the star's size and temperature!",
        "Some moons might be habitable even if their planets aren't!",
      ]}
      sections={[
        {
          title: "What is the Habitable Zone?",
          content: "The habitable zone, also called the Goldilocks zone, is the region around a star where conditions might be right for liquid water to exist on a planet's surface - a key requirement for life as we know it. It's called the Goldilocks zone because conditions are 'just right' - not too hot, not too cold. The zone's location depends on the star's size and temperature.",
          image: "https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg",
          imageAlt: "Habitable zone around a star"
        },
        {
          title: "Earth's Position",
          content: "Earth is located in the Sun's habitable zone, which extends from about 0.95 to 1.37 astronomical units (AU). Venus is too close (too hot), and Mars is on the outer edge (too cold, though it may have been warmer in the past). The habitable zone isn't fixed - as stars age and change, their habitable zones shift.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg",
          imageAlt: "Earth in the habitable zone"
        },
        {
          title: "Search for Life",
          content: "Finding planets in habitable zones is a major focus of exoplanet research. The James Webb Space Telescope can analyze the atmospheres of exoplanets in habitable zones, searching for biosignatures - chemical signs of life. However, being in the habitable zone doesn't guarantee a planet is habitable - other factors like atmosphere, magnetic field, and geological activity also matter.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg",
          imageAlt: "James Webb Space Telescope searching for life"
        }
      ]}
      facts={[
        { fact: "The habitable zone varies with star type", icon: "⭐" },
        { fact: "Earth is perfectly positioned in the habitable zone", icon: "🌍" },
        { fact: "Some exoplanets are in habitable zones", icon: "🪐" },
        { fact: "Moons can be habitable even if planets aren't", icon: "🌙" },
      ]}
      relatedLinks={[
        { name: "Exoplanets", href: "/es/exoplanets" },
        { name: "Earth", href: "/es/earth" },
        { name: "Mars", href: "/es/mars" }
      ]}
    />
  )
}

