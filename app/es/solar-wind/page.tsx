import PageTemplate from '@/components-ar/PageTemplate'

export default function SolarWindPage() {
  return (
    <PageTemplate
      title="Solar Wind"
      subtitle="The Sun's Outflow"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Solar Wind"
      didYouKnow={[
        "Solar wind travels at speeds of 400-800 km/s!",
        "Solar wind extends far beyond Pluto's orbit!",
        "Solar wind creates the heliosphere around our Solar System!",
        "Solar wind causes auroras when it interacts with Earth's magnetic field!",
      ]}
      sections={[
        {
          title: "What is Solar Wind?",
          content: "Solar wind is a continuous stream of charged particles (mostly electrons and protons) flowing outward from the Sun. It extends throughout the Solar System and beyond, creating a bubble called the heliosphere. Solar wind is created when the Sun's extremely hot corona expands into space. The wind carries the Sun's magnetic field with it, influencing the entire Solar System.",
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Solar Wind"
        },
        {
          title: "Effects on Planets",
          content: "Solar wind interacts with planetary magnetic fields, creating beautiful auroras on Earth and other planets. It also shapes planetary magnetospheres and can strip away atmospheres from planets without strong magnetic fields. Mars, for example, lost much of its atmosphere over billions of years due to solar wind. Earth's magnetic field protects us from most of the solar wind's effects.",
        },
        {
          title: "Heliosphere",
          content: "The heliosphere is the vast bubble of space dominated by the Sun's influence, created by solar wind pushing against the interstellar medium. The boundary of the heliosphere, called the heliopause, is where the solar wind's pressure equals that of interstellar space. Voyager 1 and 2 have crossed this boundary, entering interstellar space.",
        }
      ]}
      facts={[
        { fact: "Solar wind density decreases with distance from the Sun", icon: "📉" },
        { fact: "The heliosphere extends about 100 AU from the Sun", icon: "📏" },
        { fact: "Solar wind speed varies with solar activity", icon: "🌊" },
        { fact: "The Parker Solar Probe studies solar wind up close", icon: "🛰️" },
      ]}
      relatedLinks={[
        { name: "The Sun", href: "/es/sun" },
        { name: "Space Weather", href: "/es/space-weather" },
        { name: "Solar System", href: "/es/solar-system" }
      ]}
    />
  )
}

