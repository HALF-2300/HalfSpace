import PageTemplate from '@/components/PageTemplate'

export default function MoonPage() {
  return (
    <PageTemplate
      title="The Moon"
      subtitle="Earth's Celestial Companion"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Moon"
      didYouKnow={[
        "The Moon is slowly moving away from Earth at about 3.8 cm per year!",
        "You weigh about 16.5% less on the Moon than on Earth.",
        "The Moon has 'moonquakes' caused by Earth's gravitational pull.",
        "The dark side of the Moon isn't actually dark - it gets just as much sunlight!",
      ]}
      sections={[
        {
          title: "Our Nearest Neighbor",
          content: "The Moon is Earth's only natural satellite and our closest celestial neighbor, located about 384,400 kilometers away. It's the fifth-largest moon in the Solar System and plays a crucial role in stabilizing Earth's axial tilt, which helps maintain our planet's climate. The Moon's gravitational pull creates ocean tides and has influenced Earth's rotation over billions of years. Without the Moon, Earth would have a much more chaotic climate.",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Full moon"
        },
        {
          title: "Formation",
          content: "The leading theory for the Moon's formation is the Giant Impact Hypothesis. About 4.5 billion years ago, a Mars-sized object called Theia collided with early Earth. The impact ejected material into orbit around Earth, which eventually coalesced to form the Moon. This explains why the Moon's composition is similar to Earth's mantle and why it's relatively large compared to Earth. The Moon formed much closer to Earth and has been slowly drifting away ever since.",
        },
        {
          title: "Surface Features",
          content: "The Moon's surface is covered with craters, mountains, valleys, and vast plains called maria (seas). The dark maria are ancient lava flows from volcanic activity billions of years ago. The lighter highlands are older, heavily cratered terrain. The Moon has no atmosphere, so its surface experiences extreme temperature variations, from 127°C during the day to -173°C at night. There's no weather or erosion, so footprints from Apollo missions remain unchanged.",
        },
        {
          title: "Apollo Missions",
          content: "Between 1969 and 1972, NASA's Apollo program landed 12 astronauts on the Moon. Apollo 11 made history when Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface. The Apollo missions brought back 382 kilograms of lunar samples and left scientific instruments that continue to provide data today. These missions revolutionized our understanding of the Moon and the early Solar System.",
        }
      ]}
      facts={[
        { fact: "The Moon is 384,400 km from Earth", icon: "🌙" },
        { fact: "12 humans have walked on the Moon", icon: "👨‍🚀" },
        { fact: "The Moon takes 27.3 days to orbit Earth", icon: "🔄" },
        { fact: "The Moon has water ice at its poles", icon: "❄️" },
      ]}
      timeline={[
        { year: '1959', title: 'Luna 2', description: 'First spacecraft to reach the Moon', icon: '🛰️' },
        { year: '1969', title: 'Apollo 11', description: 'First humans land on the Moon', icon: '👨‍🚀' },
        { year: '2024', title: 'Artemis', description: 'Planned return to the Moon', icon: '🚀' },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Planets", href: "/planets" },
        { name: "Missions", href: "/missions" },
        { name: "Future Missions", href: "/future-missions" }
      ]}
    />
  )
}

