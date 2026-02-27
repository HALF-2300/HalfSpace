import PageTemplate from '@/components-ar/PageTemplate'

export default function DarkMatterPage() {
  return (
    <PageTemplate
      title="Dark Matter"
      subtitle="The Invisible Universe"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Dark Matter"
      didYouKnow={[
        "Dark matter makes up 27% of the universe - 5 times more than ordinary matter!",
        "We can't see dark matter, but we know it exists from its gravitational effects!",
        "Dark matter doesn't interact with light at all - it's completely invisible!",
        "Without dark matter, galaxies wouldn't have enough mass to hold together!",
      ]}
      sections={[
        {
          title: "What is Dark Matter?",
          content: "Dark matter is a mysterious substance that makes up about 27% of the universe. It doesn't emit, absorb, or reflect light, making it invisible to telescopes. We know it exists because of its gravitational effects on visible matter, light, and the structure of the universe. Without dark matter, galaxies wouldn't have enough mass to hold together, and the universe wouldn't have the structure we observe. It's one of the greatest mysteries in physics.",
        },
        {
          title: "Evidence for Dark Matter",
          content: (
            <div className="space-y-4">
              <p>Multiple lines of evidence point to dark matter's existence:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Galaxy Rotation Curves:</strong> Stars orbit galaxies faster than expected based on visible matter</li>
                <li><strong className="text-white">Gravitational Lensing:</strong> Light bends around invisible mass</li>
                <li><strong className="text-white">Cosmic Microwave Background:</strong> Patterns in the early universe require dark matter</li>
                <li><strong className="text-white">Galaxy Clusters:</strong> Need dark matter to explain their structure and motion</li>
              </ul>
            </div>
          ),
        },
        {
          title: "The Search Continues",
          content: "Detecting dark matter directly is extremely challenging because it barely interacts with normal matter. Experiments in deep underground laboratories search for rare interactions. Particle accelerators try to create dark matter particles. Space telescopes map dark matter's distribution. Solving the dark matter mystery could revolutionize our understanding of physics and the universe.",
        }
      ]}
      facts={[
        { fact: "Dark matter is 27% of the universe", icon: "🌑" },
        { fact: "We can't see or detect it directly", icon: "👻" },
        { fact: "It holds galaxies together", icon: "🌌" },
        { fact: "Dark matter doesn't interact with light", icon: "🚫" },
      ]}
      relatedLinks={[
        { name: "Cosmology", href: "/cosmology" },
        { name: "Galaxies", href: "/galaxies" },
        { name: "Black Holes", href: "/black-holes" }
      ]}
    />
  )
}

