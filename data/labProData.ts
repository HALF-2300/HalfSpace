export type StellarStage = {
  name: string
  duration: string
  description: string
}

export type StellarMassProfile = {
  id: string
  label: string
  massRange: string
  lifetime: string
  stages: StellarStage[]
  note: string
}

export const stellarMassProfiles: StellarMassProfile[] = [
  {
    id: 'red-dwarf',
    label: 'Red Dwarf',
    massRange: '0.1–0.5 M☉',
    lifetime: '100–1000+ billion years',
    note: 'Slow-burning and incredibly stable; these make up most of the Milky Way.',
    stages: [
      {
        name: 'Protostar',
        duration: '50–200 Myr',
        description: 'Cold molecular cloud collapses and spins up; jets clear the polar regions.'
      },
      {
        name: 'Main Sequence',
        duration: '100–1000+ Gyr',
        description: 'Hydrogen fusion dominates with efficient convection keeping the star mixed.'
      },
      {
        name: 'Helium Fusion',
        duration: 'Several Gyr',
        description: 'Core contracts and heats, burning helium without reaching dramatic red giant sizes.'
      },
      {
        name: 'White Dwarf',
        duration: 'Trillions of years (cooling)',
        description: 'Ends as a slowly cooling helium or carbon white dwarf with no supernova.'
      }
    ]
  },
  {
    id: 'sun-like',
    label: 'Sun-like Star',
    massRange: '0.8–1.2 M☉',
    lifetime: '8–12 billion years',
    note: 'Stable main sequence followed by a dramatic giant phase and planetary nebula.',
    stages: [
      {
        name: 'Protostar',
        duration: '10–50 Myr',
        description: 'Accretion disk and jets shape the young star; planets begin to coalesce.'
      },
      {
        name: 'Main Sequence',
        duration: '~10 Gyr',
        description: 'Hydrogen fusion in the core keeps the star balanced and bright.'
      },
      {
        name: 'Red Giant',
        duration: '1–2 Gyr',
        description: 'Outer layers expand as the core contracts and helium fusion begins.'
      },
      {
        name: 'Planetary Nebula',
        duration: '~10 kyr',
        description: 'Outer layers are shed, forming glowing shells while the core is exposed.'
      },
      {
        name: 'White Dwarf',
        duration: 'Billions of years (cooling)',
        description: 'Dense carbon–oxygen core cools and dims without further fusion.'
      }
    ]
  },
  {
    id: 'massive',
    label: 'Massive Star',
    massRange: '8–25 M☉',
    lifetime: '10–40 million years',
    note: 'Short, brilliant lives ending in core-collapse supernovae and neutron stars.',
    stages: [
      {
        name: 'Protostar',
        duration: '0.1–1 Myr',
        description: 'Rapid accretion builds mass; intense stellar winds begin early.'
      },
      {
        name: 'Main Sequence',
        duration: '5–20 Myr',
        description: 'Fuses hydrogen at a furious rate, shining tens of thousands of times brighter than the Sun.'
      },
      {
        name: 'Supergiant',
        duration: '1–3 Myr',
        description: 'Helium, carbon, and heavier fusion shells build onion-like layers.'
      },
      {
        name: 'Core-Collapse Supernova',
        duration: 'Seconds (event)',
        description: 'Iron core implodes, then rebounds, blasting outer layers into space.'
      },
      {
        name: 'Neutron Star',
        duration: 'Billions of years',
        description: 'City-sized remnant with ultra-dense matter and strong magnetic fields.'
      }
    ]
  },
  {
    id: 'supermassive',
    label: 'Supermassive Star',
    massRange: '25–150+ M☉',
    lifetime: '3–10 million years',
    note: 'Unstable giants that may collapse directly to black holes or produce hypernovae.',
    stages: [
      {
        name: 'Protostar',
        duration: '<0.1 Myr',
        description: 'Extreme radiation pressure shapes the infalling gas and can halt accretion.'
      },
      {
        name: 'Main Sequence',
        duration: '2–5 Myr',
        description: 'Blazing luminosity drives powerful winds; heavy element production begins early.'
      },
      {
        name: 'Wolf–Rayet Phase',
        duration: '0.5–2 Myr',
        description: 'Outer hydrogen envelope is stripped, exposing hot helium-burning layers.'
      },
      {
        name: 'Hypernova / Direct Collapse',
        duration: 'Seconds (event)',
        description: 'Either collapses straight into a black hole or explodes as a gamma-ray burst.'
      },
      {
        name: 'Black Hole',
        duration: 'Effectively permanent',
        description: 'Accretes nearby gas and can power energetic jets if fed.'
      }
    ]
  }
]

export type CosmologyEra = {
  id: string
  millionYears: number
  title: string
  subtitle: string
  description: string
  image: string
}

export const cosmologyTimeline: CosmologyEra[] = [
  {
    id: 'planck',
    millionYears: 0,
    title: 'Quantum Beginnings',
    subtitle: 'Planck era to inflation',
    description:
      'Physics as we know it breaks down; quantum gravity and inflation stretch space faster than light.',
    image:
      'https://images.unsplash.com/photo-1447433819943-74a20887a81e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'recombination',
    millionYears: 0.38,
    title: 'Recombination & CMB',
    subtitle: '380,000 years',
    description:
      'Electrons and protons form neutral atoms, letting photons stream freely — the cosmic microwave background.',
    image:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'dark-ages',
    millionYears: 50,
    title: 'Cosmic Dark Ages',
    subtitle: '0.05–0.2 billion years',
    description:
      'No stars yet; hydrogen fog slowly collapses into the first gravitational wells.',
    image:
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'first-light',
    millionYears: 300,
    title: 'First Light & Reionization',
    subtitle: '0.3–1 billion years',
    description:
      'The first stars and galaxies ignite, flooding space with UV light that reionizes hydrogen.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'galaxy-assembly',
    millionYears: 2000,
    title: 'Galaxy Assembly',
    subtitle: '2–6 billion years',
    description:
      'Major mergers and active black holes sculpt spiral arms, bulges, and stellar halos.',
    image:
      'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'solar-system',
    millionYears: 9300,
    title: 'Solar System Forms',
    subtitle: '9.3 billion years',
    description:
      'A giant molecular cloud collapses to form the Sun, planets, asteroids, and comets.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'modern',
    millionYears: 13800,
    title: 'Present Day',
    subtitle: '13.8 billion years',
    description:
      'Structured cosmic web with accelerating expansion driven by dark energy.',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80'
  }
]

export type ExoplanetRecord = {
  name: string
  sizeCategory: 'Sub-Earth' | 'Earth-like' | 'Super-Earth' | 'Neptune-like' | 'Jupiter-like'
  distanceLy: number
  detectionMethod: 'Transit' | 'Radial Velocity' | 'Direct Imaging' | 'Microlensing'
  hostStar: string
  highlight: string
}

export const exoplanetCatalog: ExoplanetRecord[] = [
  {
    name: 'TRAPPIST-1e',
    sizeCategory: 'Earth-like',
    distanceLy: 39.5,
    detectionMethod: 'Transit',
    hostStar: 'TRAPPIST-1 (M dwarf)',
    highlight: 'Receives similar stellar flux to Earth; temperate zone candidate.'
  },
  {
    name: 'Kepler-186f',
    sizeCategory: 'Earth-like',
    distanceLy: 492,
    detectionMethod: 'Transit',
    hostStar: 'Kepler-186 (M dwarf)',
    highlight: 'First Earth-sized planet found in the habitable zone of another star.'
  },
  {
    name: 'Kepler-452b',
    sizeCategory: 'Super-Earth',
    distanceLy: 1400,
    detectionMethod: 'Transit',
    hostStar: 'Kepler-452 (G-type)',
    highlight: 'Often called an older cousin of Earth with a 385-day year.'
  },
  {
    name: '51 Pegasi b',
    sizeCategory: 'Jupiter-like',
    distanceLy: 50,
    detectionMethod: 'Radial Velocity',
    hostStar: '51 Pegasi (G-type)',
    highlight: 'The first exoplanet found around a Sun-like star; a hot Jupiter.'
  },
  {
    name: 'HR 8799e',
    sizeCategory: 'Jupiter-like',
    distanceLy: 129,
    detectionMethod: 'Direct Imaging',
    hostStar: 'HR 8799 (A-type)',
    highlight: 'Directly imaged in a multi-planet system with wide orbits.'
  },
  {
    name: 'GJ 1214 b',
    sizeCategory: 'Neptune-like',
    distanceLy: 48,
    detectionMethod: 'Transit',
    hostStar: 'GJ 1214 (M dwarf)',
    highlight: 'A warm sub-Neptune with a likely thick atmosphere and possible water vapor.'
  },
  {
    name: 'Proxima Centauri b',
    sizeCategory: 'Earth-like',
    distanceLy: 4.2,
    detectionMethod: 'Radial Velocity',
    hostStar: 'Proxima Centauri (M dwarf)',
    highlight: 'Closest known exoplanet; orbits within the habitable zone of its star.'
  },
  {
    name: 'K2-18 b',
    sizeCategory: 'Neptune-like',
    distanceLy: 124,
    detectionMethod: 'Transit',
    hostStar: 'K2-18 (M dwarf)',
    highlight: 'Hycean world candidate with hints of water vapor in its atmosphere.'
  },
  {
    name: 'OGLE-2005-BLG-390Lb',
    sizeCategory: 'Sub-Earth',
    distanceLy: 21500,
    detectionMethod: 'Microlensing',
    hostStar: 'Unknown (bulge star)',
    highlight: 'Detected via gravitational microlensing; a cold, distant super-Earth/sub-Neptune.'
  },
  {
    name: 'TOI-700 d',
    sizeCategory: 'Earth-like',
    distanceLy: 101.4,
    detectionMethod: 'Transit',
    hostStar: 'TOI-700 (M dwarf)',
    highlight: 'Earth-sized planet in the conservative habitable zone with a modest stellar flux.'
  }
]

export type MythFactCard = {
  id: string
  claim: string
  reality: string
  classification: 'Myth' | 'Fact'
  sourceNote: string
}

export const mythFactCards: MythFactCard[] = [
  {
    id: 'myth-black-holes',
    claim: 'Black holes act like cosmic vacuum cleaners that suck in everything nearby.',
    reality:
      'They attract objects just like any massive body; only crossing the event horizon makes escape impossible.',
    classification: 'Myth',
    sourceNote: 'Based on general relativity and observed stellar orbits near Sgr A*.'
  },
  {
    id: 'fact-expansion',
    claim: 'The universe is expanding faster today than in the past.',
    reality:
      'Dark energy drives an accelerating expansion, inferred from Type Ia supernovae and CMB measurements.',
    classification: 'Fact',
    sourceNote: 'Supported by multiple cosmological datasets.'
  },
  {
    id: 'myth-dark-side',
    claim: 'The Moon has a permanent “dark side.”',
    reality:
      'The Moon is tidally locked, so one face always points to Earth, but all sides get sunlight each orbit.',
    classification: 'Myth',
    sourceNote: 'Confirmed by lunar missions and illumination geometry.'
  },
  {
    id: 'fact-neutrinos',
    claim: 'Billions of solar neutrinos pass through your body every second.',
    reality:
      'Neutrinos interact weakly, so they stream through Earth and our bodies almost unimpeded.',
    classification: 'Fact',
    sourceNote: 'Measured by neutrino detectors like Super-Kamiokande and SNO.'
  },
  {
    id: 'myth-seasons',
    claim: 'Seasons are caused because Earth is closer to the Sun in summer.',
    reality:
      'Seasons come from Earth’s axial tilt; the Northern Hemisphere is actually farther from the Sun in July.',
    classification: 'Myth',
    sourceNote: 'Demonstrated by insolation models and orbital parameters.'
  }
]

export type QuizQuestion = {
  id: string
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export const labProQuizBank: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What primarily determines how long a star stays on the main sequence?',
    choices: ['Its rotation speed', 'Its mass', 'Its magnetic field strength', 'The number of planets'],
    answerIndex: 1,
    explanation: 'Mass sets the core temperature and fuel consumption rate, dictating lifetime.'
  },
  {
    id: 'q2',
    question: 'Why do astronomers favor the transit method for finding small exoplanets?',
    choices: [
      'It works only for massive planets',
      'It can directly image atmospheres',
      'It measures tiny dips in starlight reliably across many stars',
      'It requires only radio telescopes'
    ],
    answerIndex: 2,
    explanation: 'High-precision photometry lets surveys monitor thousands of stars for small dips.'
  },
  {
    id: 'q3',
    question: 'What marks the end of the cosmic “dark ages”?',
    choices: [
      'Formation of the first atoms',
      'The first stars and galaxies reionizing hydrogen',
      'The birth of the Solar System',
      'Arrival of dark energy'
    ],
    answerIndex: 1,
    explanation: 'UV light from first stars and galaxies ionizes hydrogen, ending the dark ages.'
  },
  {
    id: 'q4',
    question: 'What is the likely remnant after a 15 M☉ star exhausts its fuel?',
    choices: ['White dwarf', 'Neutron star', 'Brown dwarf', 'Red dwarf'],
    answerIndex: 1,
    explanation: 'Stars above about 8 M☉ undergo core collapse and leave neutron stars or black holes.'
  },
  {
    id: 'q5',
    question: 'Which detection method excels at finding widely separated giant exoplanets?',
    choices: ['Transit', 'Microlensing', 'Direct Imaging', 'Radial Velocity'],
    answerIndex: 2,
    explanation: 'Direct imaging can capture light from young, wide-orbit giants that aren’t hidden in stellar glare.'
  },
  {
    id: 'q6',
    question: 'What does the cosmic microwave background represent?',
    choices: [
      'Radiation from black holes',
      'Afterglow from recombination when atoms first formed',
      'Light from the first stars',
      'Radio emissions from galaxies'
    ],
    answerIndex: 1,
    explanation: 'It is relic radiation from the recombination era, now cooled to microwave wavelengths.'
  },
  {
    id: 'q7',
    question: 'Why are red dwarfs considered excellent targets in habitable-zone searches?',
    choices: [
      'They lack flares',
      'Their habitable zones are close in, giving frequent transits',
      'They emit no radiation in infrared',
      'They all host Earth twins'
    ],
    answerIndex: 1,
    explanation: 'Short orbital periods make repeated transits easy to observe, though flares remain a consideration.'
  },
  {
    id: 'q8',
    question: 'What powers gamma-ray bursts linked to hypernovae?',
    choices: [
      'Planet collisions',
      'Rapidly spinning massive star cores collapsing to black holes',
      'Solar flares',
      'White dwarf cooling'
    ],
    answerIndex: 1,
    explanation: 'Collapsars channel energy into jets that produce intense gamma-ray emission.'
  },
  {
    id: 'q9',
    question: 'Which statement about myth vs fact best reflects scientific practice?',
    choices: [
      'Claims stay myths until proven true once',
      'Repeated evidence and predictive power elevate ideas to accepted facts',
      'Facts never change with new data',
      'Myths are simply unpopular facts'
    ],
    answerIndex: 1,
    explanation: 'Evidence, replication, and predictive success move ideas from speculation to accepted knowledge.'
  },
  {
    id: 'q10',
    question: 'How do microlensing discoveries differ from transit finds?',
    choices: [
      'They require the planet to orbit a pulsar',
      'They catch temporary brightening when a lens star aligns with a background source',
      'They only work for planets within 10 light-years',
      'They directly image the planet'
    ],
    answerIndex: 1,
    explanation: 'Microlensing uses gravitational lensing events during chance alignments to infer planets.'
  }
]
