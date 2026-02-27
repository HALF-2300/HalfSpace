import PageTemplate from '@/components-ar/PageTemplate'

export default function MultiversePage() {
  return (
    <PageTemplate
      title="Multiverse"
      subtitle="Multiple Universes"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Multiverse"
      didYouKnow={[
        "The multiverse theory suggests there may be infinite universes!",
        "Different universes might have different physical laws!",
        "The multiverse is a theoretical concept, not proven!",
        "Some theories suggest our universe is just one bubble in a multiverse!",
      ]}
      sections={[
        {
          title: "What is the Multiverse?",
          content: "The multiverse is a theoretical concept suggesting that our universe might be just one of many universes that exist. Different versions of the multiverse theory propose different mechanisms: some suggest infinite universes with different physical constants, others propose parallel universes in higher dimensions, and some theories suggest our universe is one bubble in a larger 'foam' of universes.",
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
          imageAlt: "Multiverse"
        },
        {
          title: "Theories",
          content: (
            <div className="space-y-4">
              <p>Several theories propose different types of multiverses:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Inflationary Multiverse:</strong> Eternal inflation creates bubble universes</li>
                <li><strong className="text-white">Many-Worlds:</strong> Quantum mechanics suggests all possible outcomes occur in parallel universes</li>
                <li><strong className="text-white">Brane Multiverse:</strong> Our universe exists on a membrane in higher-dimensional space</li>
                <li><strong className="text-white">Mathematical Multiverse:</strong> All mathematically possible universes exist</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Scientific Status",
          content: "The multiverse remains a highly speculative concept. While some theories in physics naturally lead to multiverse scenarios, there's no direct observational evidence for other universes. The multiverse is difficult or impossible to test, which makes it controversial in physics. Some scientists see it as a natural extension of our theories, while others consider it untestable and therefore unscientific.",
        }
      ]}
      facts={[
        { fact: "The multiverse is purely theoretical", icon: "🧮" },
        { fact: "Different universes might have different laws", icon: "⚖️" },
        { fact: "The multiverse is difficult to test", icon: "🔍" },
        { fact: "Some theories naturally predict multiverses", icon: "📊" },
      ]}
      relatedLinks={[
        { name: "Cosmology", href: "/zh/cosmology" },
        { name: "Big Bang", href: "/zh/big-bang" },
        { name: "Dark Energy", href: "/zh/dark-energy" }
      ]}
    />
  )
}

