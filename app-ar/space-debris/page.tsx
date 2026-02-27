import PageTemplate from '@/components-ar/PageTemplate'

export default function SpaceDebrisPage() {
  return (
    <PageTemplate
      title="Space Debris"
      subtitle="The Orbital Junkyard"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Space Debris"
      didYouKnow={[
        "There are over 500,000 pieces of space debris larger than 1 cm!",
        "Space debris travels at speeds up to 17,500 mph!",
        "A tiny piece of debris can destroy a satellite!",
        "Space debris is a growing problem for space exploration!",
      ]}
      sections={[
        {
          title: "What is Space Debris?",
          content: "Space debris, also called space junk, consists of defunct satellites, spent rocket stages, fragments from collisions, and other human-made objects orbiting Earth. There are over 500,000 pieces of debris larger than 1 cm, and millions of smaller pieces. Space debris travels at orbital speeds (up to 17,500 mph), making even small pieces extremely dangerous to spacecraft and satellites.",
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Space Debris"
        },
        {
          title: "The Problem",
          content: "Space debris poses a serious threat to space operations. Collisions can create more debris in a cascading effect called the Kessler Syndrome. The International Space Station must regularly maneuver to avoid debris. Even tiny pieces can cause catastrophic damage at orbital speeds. As more objects are launched into space, the problem continues to grow.",
        },
        {
          title: "Solutions",
          content: "Efforts are underway to address space debris: designing satellites to deorbit after their missions, developing debris removal technologies, and international guidelines for space operations. Some proposed solutions include space nets, harpoons, and lasers to remove debris. Preventing future debris creation is as important as cleaning up existing debris.",
        }
      ]}
      facts={[
        { fact: "Over 500,000 pieces of debris are tracked", icon: "📊" },
        { fact: "Debris travels at 17,500 mph", icon: "⚡" },
        { fact: "The ISS maneuvers to avoid debris", icon: "🛰️" },
        { fact: "Debris removal is an active area of research", icon: "🔧" },
      ]}
      relatedLinks={[
        { name: "Space Stations", href: "/space-stations" },
        { name: "Space Technology", href: "/space-technology" },
        { name: "Missions", href: "/missions" }
      ]}
    />
  )
}

