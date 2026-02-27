import PageTemplate from '@/components-ar/PageTemplate'

export default function FutureMissionsPage() {
  return (
    <PageTemplate
      title="Future Missions"
      subtitle="The Next Frontier"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Future Missions"
      didYouKnow={[
        "NASA's Artemis program aims to return humans to the Moon by 2025!",
        "The Europa Clipper will search for signs of life on Jupiter's moon Europa!",
        "Mars sample return missions will bring Martian rocks to Earth for analysis!",
        "Future telescopes will directly image Earth-like exoplanets!",
      ]}
      sections={[
        {
          title: "Artemis Program",
          content: "NASA's Artemis program aims to return humans to the Moon by 2025 and establish a sustainable lunar presence. The program will land the first woman and first person of color on the Moon, build the Gateway space station in lunar orbit, and develop technologies for future Mars missions. Artemis will use the Space Launch System (SLS) rocket and Orion spacecraft, with plans for a lunar base by the 2030s. This will serve as a stepping stone to Mars.",
        },
        {
          title: "Mars Exploration",
          content: "Multiple missions are planned for Mars exploration. NASA's Mars Sample Return mission will bring Martian rocks to Earth for analysis. SpaceX is developing Starship for crewed missions to Mars. The European Space Agency's ExoMars rover will search for signs of life. These missions will pave the way for eventual human settlement on the Red Planet. The first humans could land on Mars in the 2030s or 2040s.",
        },
        {
          title: "Europa Clipper",
          content: "NASA's Europa Clipper mission will explore Jupiter's moon Europa, which has a subsurface ocean that may harbor life. The spacecraft will perform multiple flybys, studying the moon's ice shell, ocean, and composition. This mission could provide evidence of life beyond Earth and revolutionize our understanding of habitable worlds. Europa's ocean may contain twice as much water as all of Earth's oceans combined.",
        },
        {
          title: "Next-Generation Telescopes",
          content: "Future space telescopes will expand our capabilities. The Habitable Worlds Observatory will search for signs of life on exoplanets. The Nancy Grace Roman Space Telescope will study dark energy and exoplanets. The LUVOIR telescope concept could directly image Earth-like planets around nearby stars. These telescopes will help answer fundamental questions about the universe and the possibility of life elsewhere.",
        }
      ]}
      facts={[
        { fact: "Artemis will land the first woman on the Moon", icon: "👩‍🚀" },
        { fact: "Europa Clipper launches in 2024", icon: "🛰️" },
        { fact: "Mars sample return planned for 2030s", icon: "📦" },
        { fact: "Future telescopes will search for alien life", icon: "🔭" },
      ]}
      relatedLinks={[
        { name: "Missions", href: "/ar/missions" },
        { name: "Mars", href: "/ar/mars" },
        { name: "Moon", href: "/ar/moon" },
        { name: "Telescopes", href: "/ar/telescopes" }
      ]}
    />
  )
}

