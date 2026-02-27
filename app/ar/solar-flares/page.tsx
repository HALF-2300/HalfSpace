import PageTemplate from '@/components-ar/PageTemplate'

export default function SolarFlaresPage() {
  return (
    <PageTemplate
      title="Solar Flares"
      subtitle="Explosions on the Sun"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Solar Flares"
      didYouKnow={[
        "Solar flares can release energy equivalent to millions of nuclear bombs!",
        "The largest solar flare ever recorded was in 2003!",
        "Solar flares can disrupt satellites and power grids!",
        "Solar flares travel at the speed of light!",
      ]}
      sections={[
        {
          title: "What Are Solar Flares?",
          content: "Solar flares are sudden, intense bursts of radiation from the Sun's surface, caused by the release of magnetic energy stored in the Sun's atmosphere. They're the most powerful explosions in our Solar System, releasing energy equivalent to millions of 100-megaton hydrogen bombs. Solar flares can last from minutes to hours and emit radiation across the electromagnetic spectrum, from radio waves to gamma rays.",
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Solar Flare"
        },
        {
          title: "Classification",
          content: "Solar flares are classified by their X-ray brightness: C-class (small), M-class (medium), and X-class (large). X-class flares are the most powerful. The largest flare ever recorded was an X28 flare in 2003, though it may have been even stronger as it saturated the detectors. Each class is 10 times more powerful than the previous one.",
        },
        {
          title: "Effects on Earth",
          content: "When solar flares reach Earth, they can cause various effects: beautiful auroras, disruption of radio communications, damage to satellites, and potential power grid failures. The radiation from flares can pose risks to astronauts and aircraft passengers. The most severe solar flare in recorded history, the Carrington Event of 1859, caused telegraph systems to fail worldwide.",
        }
      ]}
      facts={[
        { fact: "Solar flares occur more frequently during solar maximum", icon: "📈" },
        { fact: "Flares can reach Earth in 8 minutes", icon: "⚡" },
        { fact: "The Carrington Event was the largest known flare", icon: "💥" },
        { fact: "Flares are associated with sunspots", icon: "☀️" },
      ]}
      relatedLinks={[
        { name: "The Sun", href: "/ar/sun" },
        { name: "Space Weather", href: "/ar/space-weather" },
        { name: "Solar Wind", href: "/ar/solar-wind" }
      ]}
    />
  )
}

