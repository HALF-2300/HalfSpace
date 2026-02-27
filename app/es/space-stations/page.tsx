import PageTemplate from '@/components-ar/PageTemplate'

export default function SpaceStationsPage() {
  return (
    <PageTemplate
      title="Space Stations"
      subtitle="Human Outposts in Space"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space Station"
      didYouKnow={[
        "The ISS travels at 17,500 mph and completes an orbit every 90 minutes!",
        "Astronauts see 16 sunrises and sunsets every day on the ISS!",
        "The ISS has been continuously occupied since 2000 - over 24 years!",
        "The ISS is the largest human-made object in space, about the size of a football field!",
      ]}
      sections={[
        {
          title: "International Space Station",
          content: "The ISS is a modular space station in low Earth orbit, a joint project of NASA, Roscosmos, ESA, JAXA, and CSA. It has been continuously occupied since 2000 and serves as a microgravity laboratory where astronauts conduct research in biology, physics, astronomy, and other sciences. The station orbits Earth every 90 minutes at an altitude of approximately 400 kilometers. It's the largest human-made object in space.",
        },
        {
          title: "Research and Experiments",
          content: "Space stations provide unique environments for scientific research. Experiments in microgravity help us understand fundamental physics, develop new materials, study biological processes, and test technologies for future space missions. Research on the ISS has led to advances in medicine, materials science, and our understanding of how the human body adapts to space. Over 3,000 experiments have been conducted on the ISS.",
        },
        {
          title: "Future Space Stations",
          content: "Plans are underway for new space stations. China's Tiangong space station is operational, and private companies are developing commercial space stations. NASA's Gateway will orbit the Moon, serving as a staging point for lunar and Mars missions. These stations will support long-duration spaceflight and prepare humans for missions deeper into space. The future of space stations includes tourism, manufacturing, and scientific research.",
        }
      ]}
      facts={[
        { fact: "ISS has been occupied for 24+ years", icon: "🛰️" },
        { fact: "Over 3,000 experiments conducted on ISS", icon: "🔬" },
        { fact: "ISS travels 5 miles per second", icon: "🚀" },
        { fact: "More than 260 people have visited the ISS", icon: "👨‍🚀" },
      ]}
      relatedLinks={[
        { name: "Astronauts", href: "/es/astronauts" },
        { name: "Life in Space", href: "/es/life-in-space" },
        { name: "Missions", href: "/es/missions" },
        { name: "Future Missions", href: "/es/future-missions" }
      ]}
    />
  )
}

