import PageTemplate from '@/components-ar/PageTemplate'

export default function SpaceTechnologyPage() {
  return (
    <PageTemplate
      title="Space Technology"
      subtitle="Innovations for Exploration"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space Technology"
      didYouKnow={[
        "Ion propulsion is 10 times more efficient than chemical rockets!",
        "3D printing in space could build structures on Mars!",
        "Solar sails use light pressure for propulsion - no fuel needed!",
        "Reusable rockets have reduced launch costs by 90%!",
      ]}
      sections={[
        {
          title: "Rocket Technology",
          content: (
            <div className="space-y-4">
              <p>Modern rockets use advanced propulsion systems:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Chemical Rockets:</strong> Use liquid or solid propellants for thrust - most common today</li>
                <li><strong className="text-white">Ion Propulsion:</strong> More efficient for long missions, used by deep space probes - 10x more efficient</li>
                <li><strong className="text-white">Reusable Rockets:</strong> SpaceX's Falcon 9 and Starship reduce launch costs by 90%</li>
                <li><strong className="text-white">Nuclear Propulsion:</strong> Being developed for faster interplanetary travel</li>
              </ul>
            </div>
          ),
        },
        {
          title: "In-Situ Resource Utilization",
          content: "ISRU technology allows future missions to use resources found in space rather than bringing everything from Earth. This includes extracting water from lunar ice, producing oxygen from Martian atmosphere, and using 3D printing to build structures from local materials. ISRU is essential for sustainable space exploration and colonization. It could enable permanent settlements on the Moon and Mars.",
        },
        {
          title: "Future Technologies",
          content: "Emerging technologies promise to revolutionize space travel. Solar sails use light pressure for propulsion. Space elevators could provide cheap access to orbit. Fusion rockets could enable fast travel throughout the Solar System. Quantum communication could provide secure, instant communication across vast distances. These technologies may make space travel as routine as air travel is today.",
        }
      ]}
      facts={[
        { fact: "Ion engines can run for years", icon: "⚡" },
        { fact: "3D printing works in microgravity", icon: "🖨️" },
        { fact: "Solar sails need no fuel", icon: "⛵" },
        { fact: "Reusable rockets land themselves", icon: "🚀" },
      ]}
      relatedLinks={[
        { name: "Missions", href: "/missions" },
        { name: "Future Missions", href: "/future-missions" },
        { name: "Space Stations", href: "/space-stations" }
      ]}
    />
  )
}

