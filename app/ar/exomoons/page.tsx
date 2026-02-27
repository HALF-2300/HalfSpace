import PageTemplate from '@/components-ar/PageTemplate'

export default function ExomoonsPage() {
  return (
    <PageTemplate
      title="Exomoons"
      subtitle="Moons Beyond Our Solar System"
      heroImage="https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg"
      heroImageAlt="Exomoons"
      didYouKnow={[
        "No exomoons have been confirmed yet, but many candidates exist!",
        "Exomoons could potentially harbor life!",
        "Some exomoons might be larger than Earth!",
        "Detecting exomoons is extremely challenging!",
      ]}
      sections={[
        {
          title: "What Are Exomoons?",
          content: "Exomoons are natural satellites that orbit exoplanets - planets outside our Solar System. While we haven't confirmed any exomoons yet, they're likely common given that moons are abundant in our Solar System. Some exomoons could be large, potentially habitable worlds. The search for exomoons is an active area of research, with several promising candidates identified.",
          image: "https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg",
          imageAlt: "Exomoon orbiting an exoplanet"
        },
        {
          title: "Detection Challenges",
          content: "Detecting exomoons is extremely difficult because their signals are tiny compared to their host planets. Methods include looking for timing variations in planetary transits, gravitational effects on the planet, and direct imaging. The James Webb Space Telescope may be able to detect exomoons around nearby exoplanets. Several candidates have been proposed, but none have been definitively confirmed yet.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg",
          imageAlt: "James Webb Space Telescope detecting exomoons"
        },
        {
          title: "Potential for Life",
          content: "Large exomoons around gas giant exoplanets in the habitable zone could potentially support life. These moons might have liquid water, atmospheres, and stable conditions. Jupiter's moon Europa shows that moons can have subsurface oceans, and exomoons might have similar features. Finding habitable exomoons would significantly expand the potential for life in the universe.",
          image: "https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg",
          imageAlt: "Habitable exomoon with potential for life"
        }
      ]}
      facts={[
        { fact: "No exomoons have been confirmed yet", icon: "🔍" },
        { fact: "Exomoons could be larger than Earth", icon: "📏" },
        { fact: "Some exomoons might have oceans", icon: "🌊" },
        { fact: "James Webb may detect the first exomoons", icon: "🔭" },
      ]}
      relatedLinks={[
        { name: "Exoplanets", href: "/ar/exoplanets" },
        { name: "Moon", href: "/ar/moon" },
        { name: "Jupiter", href: "/ar/jupiter" }
      ]}
    />
  )
}

