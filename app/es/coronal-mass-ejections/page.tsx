import PageTemplate from '@/components-ar/PageTemplate'

export default function CoronalMassEjectionsPage() {
  return (
    <PageTemplate
      title="Coronal Mass Ejections"
      subtitle="Solar Storms"
      heroImage="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1920"
      heroImageAlt="Coronal Mass Ejections"
      didYouKnow={[
        "CMEs can contain billions of tons of solar material!",
        "CMEs travel at speeds up to 3,000 km/s!",
        "CMEs can cause geomagnetic storms on Earth!",
        "The largest CMEs can be larger than the Sun itself!",
      ]}
      sections={[
        {
          title: "What Are CMEs?",
          content: "Coronal Mass Ejections (CMEs) are massive clouds of charged particles and magnetic fields ejected from the Sun's corona. They're among the most powerful space weather events, containing billions of tons of solar material traveling at speeds up to 3,000 km/s. CMEs are often associated with solar flares but are separate phenomena. When a CME reaches Earth, it can cause geomagnetic storms.",
          image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800",
          imageAlt: "Coronal Mass Ejection"
        },
        {
          title: "Formation",
          content: "CMEs form when the Sun's magnetic field becomes twisted and stressed, eventually releasing enormous amounts of energy. This causes a massive bubble of plasma to be ejected from the Sun's corona. CMEs can occur several times a day during solar maximum but are less frequent during solar minimum. They're most common near sunspot regions.",
        },
        {
          title: "Impact on Earth",
          content: "When a CME reaches Earth, it can compress Earth's magnetosphere and cause geomagnetic storms. These storms can create beautiful auroras but also disrupt power grids, damage satellites, and affect communications. The Carrington Event of 1859, caused by a massive CME, would cause catastrophic damage to our technology-dependent society if it occurred today.",
        }
      ]}
      facts={[
        { fact: "CMEs can take 1-3 days to reach Earth", icon: "⏰" },
        { fact: "CMEs are often associated with solar flares", icon: "💥" },
        { fact: "The Parker Solar Probe studies CMEs up close", icon: "🛰️" },
        { fact: "CMEs can affect the entire Solar System", icon: "🌌" },
      ]}
      relatedLinks={[
        { name: "The Sun", href: "/es/sun" },
        { name: "Solar Flares", href: "/es/solar-flares" },
        { name: "Space Weather", href: "/es/space-weather" }
      ]}
    />
  )
}

