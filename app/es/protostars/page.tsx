import PageTemplate from '@/components-ar/PageTemplate'

export default function ProtostarsPage() {
  return (
    <PageTemplate
      title="Protostars"
      subtitle="Stars in the Making"
      heroImage="https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1920"
      heroImageAlt="Protostars"
      didYouKnow={[
        "Protostars form from collapsing clouds of gas and dust!",
        "It takes millions of years for a protostar to become a star!",
        "Protostars are hidden inside dense clouds of gas!",
        "Protostars generate heat through gravitational contraction!",
      ]}
      sections={[
        {
          title: "What Are Protostars?",
          content: "Protostars are young stellar objects in the early stages of star formation. They form when dense regions within molecular clouds collapse under gravity. As the cloud collapses, it fragments into smaller clumps, each potentially becoming a star. During this phase, the object is not yet hot enough at its core to sustain nuclear fusion, so it's called a protostar rather than a true star.",
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Protostar"
        },
        {
          title: "Formation Process",
          content: "Star formation begins when a molecular cloud becomes unstable and starts to collapse. As gravity pulls material inward, the cloud fragments into smaller pieces. Each fragment continues collapsing, heating up due to gravitational compression. The protostar phase lasts until the core reaches about 10 million degrees Celsius, when hydrogen fusion begins and the object becomes a true star.",
        },
        {
          title: "Observation",
          content: "Protostars are difficult to observe because they're embedded in dense clouds of gas and dust that block visible light. However, they emit infrared and radio radiation that can penetrate these clouds. Space telescopes like Spitzer and James Webb can observe protostars in various stages of formation, revealing the process of star birth.",
        }
      ]}
      facts={[
        { fact: "Protostars can take 100,000 to 10 million years to form", icon: "⏰" },
        { fact: "Protostars are surrounded by accretion disks", icon: "💿" },
        { fact: "Protostars can have powerful jets of material", icon: "🚀" },
        { fact: "Most stars form in clusters from the same cloud", icon: "⭐" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/es/stars" },
        { name: "Nebulae", href: "/es/nebulae" },
        { name: "Star Clusters", href: "/es/star-clusters" }
      ]}
    />
  )
}

