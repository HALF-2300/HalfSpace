import PageTemplate from '@/components/PageTemplate'

export default function MarsPage() {
  return (
    <PageTemplate
      title="Mars"
      subtitle="The Red Planet"
      heroImage="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1920"
      heroImageAlt="Mars"
      didYouKnow={[
        "Mars has the largest volcano in the Solar System: Olympus Mons, which is 3 times taller than Mount Everest!",
        "A day on Mars is only 37 minutes longer than a day on Earth.",
        "Mars has polar ice caps made of water ice and frozen carbon dioxide.",
        "Evidence suggests Mars once had rivers, lakes, and possibly even oceans!",
      ]}
      sections={[
        {
          title: "The Red Planet",
          content: "Mars, the fourth planet from the Sun, is often called the Red Planet due to iron oxide (rust) on its surface. It's about half the size of Earth and has a thin atmosphere composed mostly of carbon dioxide. Mars has polar ice caps, seasons, volcanoes, canyons, and evidence of ancient water flows, making it one of the most Earth-like planets in our Solar System. It's the primary target for future human exploration.",
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "Mars surface"
        },
        {
          title: "Surface Features",
          content: (
            <div className="space-y-4">
              <p>Mars has dramatic surface features:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Olympus Mons:</strong> The largest volcano in the Solar System, three times taller than Mount Everest at 22 km (13.6 miles) high</li>
                <li><strong className="text-white">Valles Marineris:</strong> A canyon system 4,000 kilometers long and up to 7 kilometers deep - the largest canyon in the Solar System</li>
                <li><strong className="text-white">Polar Ice Caps:</strong> Made of water ice and frozen carbon dioxide, changing size with the seasons</li>
                <li><strong className="text-white">Ancient Riverbeds:</strong> Evidence that liquid water once flowed on Mars billions of years ago</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Search for Life",
          content: "Mars is a prime target in the search for past or present life. Rovers like Curiosity and Perseverance are analyzing the planet's geology and searching for biosignatures. Evidence suggests Mars once had a thicker atmosphere and liquid water on its surface, conditions that could have supported life. Future missions will collect samples to return to Earth for detailed analysis. The discovery of methane in Mars' atmosphere is particularly intriguing, as it could be produced by biological processes.",
        },
        {
          title: "Human Exploration",
          content: "Mars is the ultimate goal for human space exploration. NASA, SpaceX, and other organizations are developing technologies for crewed missions to Mars. Challenges include the 7-month journey, radiation exposure, landing on Mars, and surviving in its harsh environment. Plans include establishing a permanent settlement and making humanity a multi-planetary species. The first humans could land on Mars as early as the 2030s.",
        }
      ]}
      facts={[
        { fact: "Mars has two small moons: Phobos and Deimos", icon: "🌙" },
        { fact: "A year on Mars is 687 Earth days", icon: "📅" },
        { fact: "Mars' atmosphere is 100 times thinner than Earth's", icon: "💨" },
        { fact: "The Perseverance rover is searching for signs of ancient life", icon: "🔍" },
      ]}
      quiz={[
        {
          question: "What is the largest volcano on Mars?",
          options: ["Mount Everest", "Olympus Mons", "Valles Marineris", "Tharsis Montes"],
          correct: 1,
          explanation: "Olympus Mons is the largest volcano in the Solar System, standing 22 km (13.6 miles) tall - three times the height of Mount Everest."
        },
        {
          question: "Why is Mars called the Red Planet?",
          options: ["It's made of fire", "Iron oxide (rust) on its surface", "It's always sunset", "The atmosphere is red"],
          correct: 1,
          explanation: "Mars appears red due to iron oxide (rust) covering its surface, giving it its distinctive reddish color."
        }
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Missions", href: "/missions" },
        { name: "Future Missions", href: "/future-missions" }
      ]}
    />
  )
}

