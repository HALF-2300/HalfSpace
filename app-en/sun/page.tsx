import PageTemplate from '@/components/PageTemplate'

export default function SunPage() {
  return (
    <PageTemplate
      title="The Sun"
      subtitle="Our Life-Giving Star"
      heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg"
      heroImageAlt="The Sun"
      didYouKnow={[
        "The Sun contains 99.86% of the Solar System's mass!",
        "The Sun converts 600 million tons of hydrogen into helium every second!",
        "Light from the Sun takes 8 minutes and 20 seconds to reach Earth!",
        "The Sun's core temperature is 15 million°C (27 million°F)!",
      ]}
      sections={[
        {
          title: "Our Star",
          content: "The Sun is a G-type main-sequence star at the center of our Solar System. It's a massive ball of hot plasma that generates energy through nuclear fusion in its core. The Sun contains 99.86% of the Solar System's mass and provides the light and heat that makes life on Earth possible. Without the Sun, Earth would be a frozen, lifeless world.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
          imageAlt: "The Sun"
        },
        {
          title: "Nuclear Fusion",
          content: "The Sun generates energy through nuclear fusion, converting hydrogen into helium in its core. Every second, the Sun converts 600 million tons of hydrogen into 596 million tons of helium, with 4 million tons converted into energy according to Einstein's E=mc². This process has been ongoing for 4.6 billion years and will continue for another 5 billion years.",
        },
        {
          title: "Solar Activity",
          content: "The Sun has an 11-year activity cycle marked by sunspots, solar flares, and coronal mass ejections. During solar maximum, the Sun is more active with more sunspots and solar storms. These events can affect Earth's magnetic field, create auroras, and potentially disrupt satellites and power grids. The Parker Solar Probe is currently studying the Sun up close.",
        }
      ]}
      facts={[
        { fact: "The Sun is 4.6 billion years old", icon: "⏰" },
        { fact: "The Sun will become a red giant in 5 billion years", icon: "🔴" },
        { fact: "Solar flares can be larger than Earth", icon: "💥" },
        { fact: "The Sun rotates faster at its equator than at its poles", icon: "🌀" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Stars", href: "/stars" },
        { name: "Space Weather", href: "/space-weather" }
      ]}
    />
  )
}

