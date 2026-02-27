import PageTemplate from '@/components/PageTemplate'

export default function EarthPage() {
  return (
    <PageTemplate
      title="Earth"
      subtitle="Our Home Planet"
      heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg"
      heroImageAlt="Earth from space"
      didYouKnow={[
        "Earth is the only known planet with life in the universe!",
        "71% of Earth's surface is covered by water!",
        "Earth's atmosphere protects us from harmful radiation!",
        "Earth is the densest planet in our Solar System!",
      ]}
      sections={[
        {
          title: "The Blue Planet",
          content: "Earth is the third planet from the Sun and the only known planet with life. It's called the Blue Planet because 71% of its surface is covered by water. Earth has a protective atmosphere that shields us from harmful solar radiation and provides the air we breathe. Our planet is located in the habitable zone, where temperatures allow liquid water to exist.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg",
          imageAlt: "Earth from space - the Blue Planet"
        },
        {
          title: "Unique Features",
          content: "Earth has several unique features that make it suitable for life: liquid water, a protective magnetic field, plate tectonics that recycle nutrients, and an atmosphere with the right composition. The Moon stabilizes Earth's axial tilt, preventing extreme climate variations. Earth's distance from the Sun provides the perfect temperature for life as we know it.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg",
          imageAlt: "Earth and Moon from space"
        },
        {
          title: "Life on Earth",
          content: "Earth is teeming with life - from the deepest oceans to the highest mountains. Scientists estimate there are 8.7 million species on Earth, though most haven't been discovered yet. Life has existed on Earth for at least 3.5 billion years, evolving from simple single-celled organisms to the complex diversity we see today. Earth is the only place in the universe where we know life exists.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg",
          imageAlt: "Earth - the only known planet with life"
        }
      ]}
      facts={[
        { fact: "Earth is 4.5 billion years old", icon: "⏰" },
        { fact: "Earth has one natural satellite: the Moon", icon: "🌙" },
        { fact: "Earth's core is as hot as the Sun's surface", icon: "🔥" },
        { fact: "Earth travels 584 million miles around the Sun each year", icon: "🌍" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Solar System", href: "/solar-system" },
        { name: "Moon", href: "/moon" }
      ]}
    />
  )
}

