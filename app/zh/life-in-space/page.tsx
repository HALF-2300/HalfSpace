import PageTemplate from '@/components-ar/PageTemplate'

export default function LifeInSpacePage() {
  return (
    <PageTemplate
      title="Life in Space"
      subtitle="Adapting to the Final Frontier"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Life in Space"
      didYouKnow={[
        "Astronauts can grow 2 inches taller in space due to spinal decompression!",
        "Astronauts must exercise 2.5 hours daily to prevent muscle and bone loss.",
        "Food tastes different in space - astronauts prefer spicy foods!",
        "Astronauts see 16 sunrises and sunsets every day on the ISS!",
      ]}
      sections={[
        {
          title: "Microgravity Effects",
          content: (
            <div className="space-y-4">
              <p>Living in space affects the human body in many ways:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Bone Loss:</strong> Astronauts lose 1-2% of bone mass per month</li>
                <li><strong className="text-white">Muscle Atrophy:</strong> Muscles weaken without gravity's resistance</li>
                <li><strong className="text-white">Fluid Shifts:</strong> Body fluids move upward, causing facial puffiness</li>
                <li><strong className="text-white">Vision Changes:</strong> Some astronauts experience vision problems</li>
                <li><strong className="text-white">Radiation Exposure:</strong> Higher risk from cosmic radiation</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Daily Life",
          content: "Astronauts follow strict routines to maintain health and productivity. They exercise for 2.5 hours daily using specialized equipment. Meals are carefully planned and packaged. Sleep requires being strapped down in sleeping bags. Personal hygiene uses no-rinse products and special equipment. Despite challenges, astronauts describe the experience as transformative, with stunning views of Earth.",
        },
        {
          title: "Future Habitats",
          content: "Future space habitats must be self-sustaining, with closed-loop life support systems that recycle air, water, and waste. They'll need radiation shielding, artificial gravity (possibly through rotation), and the ability to grow food. These habitats will be essential for long-term space missions and eventual colonization of Mars and beyond. 3D printing could build habitats using local materials.",
        }
      ]}
      facts={[
        { fact: "Astronauts exercise 2.5 hours daily", icon: "💪" },
        { fact: "Food must be specially prepared for space", icon: "🍽️" },
        { fact: "Sleep requires being strapped down", icon: "😴" },
        { fact: "Water is recycled from air and waste", icon: "💧" },
      ]}
      relatedLinks={[
        { name: "Astronauts", href: "/zh/astronauts" },
        { name: "Space Stations", href: "/zh/space-stations" },
        { name: "Mars", href: "/zh/mars" },
        { name: "Future Missions", href: "/zh/future-missions" }
      ]}
    />
  )
}

