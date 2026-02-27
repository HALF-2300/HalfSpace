import PageTemplate from '@/components/PageTemplate'

export default function RelativityPage() {
  return (
    <PageTemplate
      title="Relativity"
      subtitle="Einstein's Revolutionary Theory"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Relativity"
      didYouKnow={[
        "Einstein published special relativity in 1905 and general relativity in 1915!",
        "Relativity explains how gravity works as the curvature of spacetime!",
        "Relativity predicts black holes, time dilation, and gravitational waves!",
        "GPS wouldn't work without accounting for relativity!",
      ]}
      sections={[
        {
          title: "Special Relativity",
          content: "Einstein's special theory of relativity, published in 1905, revolutionized our understanding of space and time. It's based on two principles: the laws of physics are the same for all observers in uniform motion, and the speed of light is constant for all observers. This leads to remarkable consequences: time dilation, length contraction, and the equivalence of mass and energy (E=mc²).",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Relativity"
        },
        {
          title: "General Relativity",
          content: "Einstein's general theory of relativity, published in 1915, describes gravity not as a force but as the curvature of spacetime caused by mass and energy. Massive objects like stars and planets warp spacetime, and other objects follow these curves. This theory predicts black holes, gravitational waves, time dilation, and the bending of light by gravity - all of which have been confirmed by observations.",
        },
        {
          title: "Impact",
          content: "Relativity has had profound impacts on physics and technology. It's essential for GPS satellites, which must account for time dilation effects. It explains the behavior of black holes and the evolution of the universe. Relativity has been tested countless times and always confirmed. It remains one of the most successful theories in physics.",
        }
      ]}
      facts={[
        { fact: "E=mc² is the most famous equation from relativity", icon: "⚛️" },
        { fact: "Relativity predicts black holes exist", icon: "🕳️" },
        { fact: "Gravitational waves confirm general relativity", icon: "🌊" },
        { fact: "Relativity is used in GPS and particle accelerators", icon: "🔬" },
      ]}
      relatedLinks={[
        { name: "Black Holes", href: "/black-holes" },
        { name: "Gravitational Waves", href: "/gravitational-waves" },
        { name: "Time Dilation", href: "/time-dilation" }
      ]}
    />
  )
}

