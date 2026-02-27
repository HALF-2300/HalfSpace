import PageTemplate from '@/components-ar/PageTemplate'

export default function DarkEnergyPage() {
  return (
    <PageTemplate
      title="Dark Energy"
      subtitle="The Accelerating Universe"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Dark Energy"
      didYouKnow={[
        "Dark energy makes up 68% of the universe!",
        "Dark energy is causing the universe to expand faster and faster!",
        "Dark energy was discovered in 1998 through supernova observations!",
        "We don't know what dark energy is - it's one of the biggest mysteries in physics!",
      ]}
      sections={[
        {
          title: "What is Dark Energy?",
          content: "Dark energy is a mysterious form of energy that makes up about 68% of the universe and is causing the universe's expansion to accelerate. Unlike dark matter, dark energy doesn't clump together but is uniformly distributed throughout space. We can't see or directly detect dark energy, but we know it exists from its effects on the universe's expansion. It's one of the greatest unsolved mysteries in physics.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Dark Energy"
        },
        {
          title: "Discovery",
          content: "Dark energy was discovered in 1998 when astronomers observed distant supernovae and found that the universe's expansion was accelerating, not slowing down as expected. This discovery was completely unexpected and earned the researchers the 2011 Nobel Prize in Physics. The acceleration suggests that something is counteracting gravity on the largest scales.",
        },
        {
          title: "The Cosmological Constant",
          content: "One explanation for dark energy is Einstein's cosmological constant - a form of energy inherent to space itself. As space expands, more space is created, and with it more dark energy. This would cause the expansion to accelerate. However, the value of this energy density is puzzling - it's much smaller than theoretical predictions, leading to what's called the 'cosmological constant problem.'",
        }
      ]}
      facts={[
        { fact: "Dark energy is 68% of the universe", icon: "🌑" },
        { fact: "Dark energy's density appears constant", icon: "📊" },
        { fact: "Dark energy will determine the universe's ultimate fate", icon: "🔮" },
        { fact: "Understanding dark energy is a major goal of cosmology", icon: "🎯" },
      ]}
      relatedLinks={[
        { name: "Cosmology", href: "/cosmology" },
        { name: "Dark Matter", href: "/dark-matter" },
        { name: "Big Bang", href: "/big-bang" }
      ]}
    />
  )
}

