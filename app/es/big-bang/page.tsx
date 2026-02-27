import PageTemplate from '@/components-ar/PageTemplate'

export default function BigBangPage() {
  return (
    <PageTemplate
      title="The Big Bang"
      subtitle="The Origin of Everything"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Big Bang"
      didYouKnow={[
        "The Big Bang occurred 13.8 billion years ago!",
        "The universe was smaller than an atom at the moment of the Big Bang!",
        "The cosmic microwave background is leftover radiation from the Big Bang!",
        "The universe expanded faster than light in the first fraction of a second!",
      ]}
      sections={[
        {
          title: "The Beginning",
          content: "The Big Bang theory describes how the universe began as an extremely hot, dense point about 13.8 billion years ago and has been expanding ever since. At the moment of the Big Bang, the entire universe was compressed into a singularity - a point of infinite density. In the first fraction of a second, the universe expanded faster than the speed of light in an event called inflation.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Big Bang"
        },
        {
          title: "Evidence",
          content: "Multiple lines of evidence support the Big Bang theory: the cosmic microwave background radiation (leftover heat from the Big Bang), the observed expansion of the universe, the abundance of light elements (hydrogen and helium), and the large-scale structure of the universe. The cosmic microwave background, discovered in 1965, is considered the 'smoking gun' evidence for the Big Bang.",
        },
        {
          title: "Timeline",
          content: (
            <div className="space-y-4">
              <p>Key moments in the Big Bang timeline:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">0 seconds:</strong> Big Bang - universe begins</li>
                <li><strong className="text-white">10⁻³⁶ seconds:</strong> Inflation - rapid expansion</li>
                <li><strong className="text-white">3 minutes:</strong> First atoms form (hydrogen, helium)</li>
                <li><strong className="text-white">380,000 years:</strong> Universe becomes transparent - light can travel</li>
                <li><strong className="text-white">200 million years:</strong> First stars form</li>
                <li><strong className="text-white">9 billion years:</strong> Our Solar System forms</li>
              </ul>
            </div>
          ),
        }
      ]}
      facts={[
        { fact: "The universe is 13.8 billion years old", icon: "⏰" },
        { fact: "The cosmic microwave background is 2.7 K", icon: "🌡️" },
        { fact: "The universe is still expanding today", icon: "📈" },
        { fact: "The Big Bang created space and time", icon: "🌌" },
      ]}
      timeline={[
        { year: '0', title: 'Big Bang', description: 'Universe begins from a singularity', icon: '💥' },
        { year: '10⁻³⁶ s', title: 'Inflation', description: 'Universe expands faster than light', icon: '📈' },
        { year: '3 min', title: 'Nucleosynthesis', description: 'First atoms form', icon: '⚛️' },
        { year: '380,000 yr', title: 'Recombination', description: 'Universe becomes transparent', icon: '💡' },
        { year: '200M yr', title: 'First Stars', description: 'Stars begin to form', icon: '⭐' },
      ]}
      relatedLinks={[
        { name: "Cosmology", href: "/es/cosmology" },
        { name: "Dark Energy", href: "/es/dark-energy" },
        { name: "Dark Matter", href: "/es/dark-matter" }
      ]}
    />
  )
}

