import PageTemplate from '@/components/PageTemplate'

export default function TelescopesPage() {
  return (
    <PageTemplate
      title="Telescopes"
      subtitle="Windows to the Universe"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Telescope"
      didYouKnow={[
        "The James Webb Space Telescope can see objects 13.6 billion light-years away!",
        "Hubble has made over 1.5 million observations since 1990.",
        "The largest ground-based telescope has a mirror 39 meters across!",
        "Space telescopes avoid Earth's atmosphere, which distorts and blocks light.",
      ]}
      sections={[
        {
          title: "Space Telescopes",
          content: "Space telescopes avoid Earth's atmosphere, which distorts and blocks light. The Hubble Space Telescope has revolutionized astronomy since 1990, capturing stunning images and making groundbreaking discoveries. The James Webb Space Telescope, launched in 2021, observes in infrared and can see the earliest galaxies. Other space telescopes like Chandra (X-rays), Spitzer (infrared), and Fermi (gamma rays) observe different wavelengths of light, revealing different aspects of the universe.",
        },
        {
          title: "James Webb Space Telescope",
          content: "The JWST is the most powerful space telescope ever built. Located at the L2 Lagrange point, it can observe the universe in infrared light, allowing it to see through dust clouds and detect the first galaxies that formed after the Big Bang. Its discoveries are reshaping our understanding of star formation, exoplanet atmospheres, and the early universe. The telescope's 6.5-meter mirror is made of 18 hexagonal segments coated in gold.",
        },
        {
          title: "Ground-Based Telescopes",
          content: "Earth-based observatories use advanced technology to peer into the cosmos. The Keck Observatory in Hawaii has twin 10-meter telescopes. The Very Large Telescope (VLT) in Chile has four 8.2-meter telescopes. The Gran Telescopio Canarias is the world's largest single-aperture optical telescope. These telescopes use adaptive optics to correct for atmospheric distortion, allowing them to see almost as clearly as space telescopes.",
        }
      ]}
      facts={[
        { fact: "Hubble orbits Earth at 340 miles altitude", icon: "🛰️" },
        { fact: "JWST is 1 million miles from Earth", icon: "🌌" },
        { fact: "The largest telescope mirror is 39 meters", icon: "🔭" },
        { fact: "Space telescopes can observe 24/7", icon: "⏰" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/stars" },
        { name: "Galaxies", href: "/galaxies" },
        { name: "Exoplanets", href: "/exoplanets" },
        { name: "Dark Matter", href: "/dark-matter" }
      ]}
    />
  )
}

