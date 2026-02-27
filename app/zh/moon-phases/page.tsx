import PageTemplate from '@/components-ar/PageTemplate'

export default function MoonPhasesPage() {
  return (
    <PageTemplate
      title="Moon Phases"
      subtitle="The Changing Face of the Moon"
      heroImage="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920"
      heroImageAlt="Moon Phases"
      didYouKnow={[
        "The Moon completes a full cycle of phases in 29.5 days!",
        "Moon phases are caused by the Moon's orbit around Earth!",
        "The same side of the Moon always faces Earth!",
        "Moon phases have been used for calendars for thousands of years!",
      ]}
      sections={[
        {
          title: "What Are Moon Phases?",
          content: "Moon phases are the changing appearances of the Moon as seen from Earth, caused by the relative positions of the Sun, Earth, and Moon. As the Moon orbits Earth, different portions of its sunlit side are visible to us. The cycle includes new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third quarter, and waning crescent phases.",
          image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
          imageAlt: "Moon Phases"
        },
        {
          title: "The Cycle",
          content: "The complete cycle of moon phases, called a synodic month, takes 29.5 days. During a new moon, the Moon is between Earth and the Sun, so its dark side faces us. As the Moon moves in its orbit, we see more of its sunlit side until full moon, when Earth is between the Sun and Moon. Then the cycle reverses.",
        },
        {
          title: "Cultural Significance",
          content: "Moon phases have been important to human cultures for thousands of years. They've been used for calendars, navigation, and religious observances. Many cultures have myths and stories about the Moon's changing appearance. The phases also affect tides on Earth, with spring tides occurring during new and full moons.",
        }
      ]}
      facts={[
        { fact: "A full moon cycle takes 29.5 days", icon: "📅" },
        { fact: "Moon phases affect ocean tides", icon: "🌊" },
        { fact: "The same side always faces Earth", icon: "🌙" },
        { fact: "Moon phases have been used for timekeeping", icon: "⏰" },
      ]}
      relatedLinks={[
        { name: "Moon", href: "/zh/moon" },
        { name: "Earth", href: "/zh/earth" },
        { name: "Solar System", href: "/zh/solar-system" }
      ]}
    />
  )
}

