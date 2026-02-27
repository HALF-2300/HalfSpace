import PageTemplate from '@/components/PageTemplate'

export default function ExoplanetsPage() {
  return (
    <PageTemplate
      title="Exoplanets"
      subtitle="Worlds Beyond Our Solar System"
      heroImage="https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg"
      heroImageAlt="Exoplanet"
      didYouKnow={[
        "Over 5,000 exoplanets have been confirmed, with thousands more candidates!",
        "Some exoplanets orbit their stars in just a few hours!",
        "The first exoplanet was discovered in 1992, orbiting a pulsar.",
        "Some exoplanets are made of diamond or have glass rain!",
      ]}
      sections={[
        {
          title: "Discovering Exoplanets",
          content: "Exoplanets are planets that orbit stars outside our Solar System. The first confirmed exoplanet was discovered in 1992, and since then, thousands have been found. Scientists use various methods to detect them, including the transit method (observing dimming when a planet passes in front of its star), the radial velocity method (detecting star wobble), and direct imaging. The Kepler Space Telescope discovered over 2,600 exoplanets during its mission.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg",
          imageAlt: "Kepler Space Telescope discovering exoplanets"
        },
        {
          title: "Types of Exoplanets",
          content: (
            <div className="space-y-4">
              <p>Exoplanets come in many varieties:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Hot Jupiters:</strong> Gas giants orbiting very close to their stars</li>
                <li><strong className="text-white">Super-Earths:</strong> Planets larger than Earth but smaller than Neptune</li>
                <li><strong className="text-white">Mini-Neptunes:</strong> Smaller versions of Neptune</li>
                <li><strong className="text-white">Earth-like Planets:</strong> Rocky planets in the habitable zone where liquid water could exist</li>
                <li><strong className="text-white">Rogue Planets:</strong> Planets not bound to any star, drifting through space</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA22094/PIA22094~orig.jpg",
          imageAlt: "Different types of exoplanets"
        },
        {
          title: "The Habitable Zone",
          content: "The habitable zone, or 'Goldilocks zone,' is the region around a star where conditions might be right for liquid water to exist on a planet's surface—a key ingredient for life as we know it. Finding Earth-like planets in habitable zones is a major focus of exoplanet research, as these worlds might potentially host life. The James Webb Space Telescope is analyzing exoplanet atmospheres for biosignatures.",
          image: "https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg",
          imageAlt: "Habitable zone around a star"
        }
      ]}
      facts={[
        { fact: "Over 5,000 exoplanets confirmed", icon: "🪐" },
        { fact: "Some exoplanets have two suns", icon: "☀️" },
        { fact: "The closest exoplanet is 4.2 light-years away", icon: "📍" },
        { fact: "Some exoplanets are tidally locked - one side always faces their star", icon: "🔒" },
      ]}
      quiz={[
        {
          question: "What was the first method used to discover exoplanets?",
          options: ["Direct imaging", "Transit method", "Radial velocity", "Gravitational microlensing"],
          correct: 2,
          explanation: "The radial velocity method, which detects the wobble of stars caused by orbiting planets, was one of the first successful methods for discovering exoplanets."
        }
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Stars", href: "/stars" },
        { name: "Telescopes", href: "/telescopes" }
      ]}
    />
  )
}

