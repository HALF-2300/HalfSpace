import PageTemplate from '@/components-ar/PageTemplate'

export default function AsteroidsPage() {
  return (
    <PageTemplate
      title="Asteroids"
      subtitle="Rocks from the Early Solar System"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Asteroid"
      didYouKnow={[
        "The largest asteroid, Ceres, is also classified as a dwarf planet!",
        "The asteroid belt is mostly empty space - asteroids are millions of kilometers apart.",
        "Some asteroids are worth trillions of dollars in precious metals!",
        "Asteroids may have brought water and organic molecules to early Earth.",
      ]}
      sections={[
        {
          title: "What Are Asteroids?",
          content: "Asteroids are rocky remnants from the early Solar System that never formed into planets. Most asteroids are found in the asteroid belt between Mars and Jupiter, though they can be found throughout the Solar System. They range in size from small boulders to objects hundreds of kilometers across. The largest asteroid, Ceres, is also classified as a dwarf planet. Asteroids are time capsules from the early Solar System.",
        },
        {
          title: "Asteroid Belt",
          content: "The main asteroid belt lies between Mars and Jupiter, containing millions of asteroids. Despite popular depictions, the belt is mostly empty space—asteroids are typically millions of kilometers apart. The total mass of all asteroids is less than that of Earth's Moon. The belt formed because Jupiter's gravity prevented planetesimals from coalescing into a planet. Some asteroids are rich in metals and could be valuable for future space mining.",
        },
        {
          title: "Near-Earth Asteroids",
          content: "Some asteroids have orbits that bring them close to Earth. These Near-Earth Asteroids (NEAs) are closely monitored because of their potential to impact Earth. While large impacts are rare, smaller objects enter Earth's atmosphere regularly as meteors. Programs like NASA's Planetary Defense Coordination Office track potentially hazardous asteroids and develop strategies to deflect them if necessary.",
        }
      ]}
      facts={[
        { fact: "Millions of asteroids exist in the Solar System", icon: "☄️" },
        { fact: "Ceres is the largest asteroid at 940 km across", icon: "🪨" },
        { fact: "Asteroids can contain water and organic compounds", icon: "💧" },
        { fact: "NASA's DART mission successfully deflected an asteroid", icon: "🎯" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/es/solar-system" },
        { name: "Comets", href: "/es/comets" },
        { name: "Planets", href: "/es/planets" }
      ]}
    />
  )
}

