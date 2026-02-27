import PageTemplate from '@/components/PageTemplate'

export default function JupiterPage() {
  return (
    <PageTemplate
      title="Jupiter"
      subtitle="King of the Planets"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Jupiter"
      didYouKnow={[
        "Jupiter is so massive that all other planets could fit inside it!",
        "The Great Red Spot is a storm larger than Earth that's been raging for 400+ years!",
        "Jupiter has 95 known moons, including the four large Galilean moons.",
        "Jupiter acts as a 'cosmic vacuum cleaner,' protecting inner planets from asteroids!",
      ]}
      sections={[
        {
          title: "The Gas Giant",
          content: "Jupiter is the largest planet in our Solar System, a gas giant with a mass greater than all other planets combined. It's composed primarily of hydrogen and helium, similar to the Sun, but it's not massive enough to become a star. Jupiter's rapid rotation creates strong winds and massive storms, including the famous Great Red Spot—a storm larger than Earth that has been raging for at least 400 years. A day on Jupiter is only 10 hours long!",
        },
        {
          title: "Moons of Jupiter",
          content: "Jupiter has at least 95 known moons, including the four large Galilean moons: Io (volcanically active), Europa (with a subsurface ocean that might harbor life), Ganymede (the largest moon in the Solar System), and Callisto (heavily cratered). These moons are worlds in their own right and are targets for future exploration, especially Europa, which may have conditions suitable for life in its subsurface ocean.",
        },
        {
          title: "Jupiter's Role",
          content: "Jupiter acts as a 'cosmic vacuum cleaner,' using its massive gravity to capture or deflect comets and asteroids that might otherwise threaten inner planets like Earth. However, it can also fling objects toward the inner Solar System. Understanding Jupiter helps us learn about gas giants, planetary formation, and the early Solar System. The Juno mission is currently studying Jupiter's atmosphere, magnetic field, and interior structure.",
        }
      ]}
      facts={[
        { fact: "Jupiter has 95 known moons", icon: "🪐" },
        { fact: "The Great Red Spot is shrinking", icon: "🔴" },
        { fact: "Jupiter's magnetic field is 20,000 times stronger than Earth's", icon: "🧲" },
        { fact: "Europa may have a subsurface ocean", icon: "🌊" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Saturn", href: "/saturn" }
      ]}
    />
  )
}

