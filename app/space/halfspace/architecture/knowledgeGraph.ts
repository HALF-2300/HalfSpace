/**
 * HalfSpace Knowledge Graph
 * الهيكل المعرفي الكامل - شبكة الترابط بين العلم والفلسفة والوعي
 */

export interface KnowledgeNode {
  id: string;
  title: string;
  titleAr: string;
  realm: 'known' | 'unseen' | 'human' | 'core' | 'nexus' | 'hidden';
  level: 1 | 2 | 3;
  content: string;
  connections: string[]; // IDs of connected nodes
  questions: string[];
  coordinates: [number, number, number]; // Position in 3D space
  locked?: boolean;
  unlockCondition?: string;
}

export interface Realm {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  icon: string;
  levels: {
    level: number;
    name: string;
    nameAr: string;
    description: string;
  }[];
}

// The Three Primary Realms
export const REALMS: Realm[] = [
  {
    id: 'known',
    name: 'The Known Universe',
    nameAr: 'الكون المعروف',
    description: 'Science, logic, and the measurable cosmos',
    descriptionAr: 'العلم والمنطق والكون القابل للقياس',
    color: '#0080FF',
    icon: '🔭',
    levels: [
      {
        level: 1,
        name: 'Stars and Structure',
        nameAr: 'النجوم والبنية',
        description: 'Galaxies, black holes, dark matter and energy'
      },
      {
        level: 2,
        name: 'Time and Physics',
        nameAr: 'الزمن والفيزياء',
        description: 'Relativity, quantum mechanics, temporal chains'
      },
      {
        level: 3,
        name: 'Life and Probability',
        nameAr: 'الحياة والاحتمال',
        description: 'Drake equation, habitable worlds, consciousness as physics'
      }
    ]
  },
  {
    id: 'unseen',
    name: 'The Unseen',
    nameAr: 'اللامرئي',
    description: 'Mystery, metaphysics, and the edge of understanding',
    descriptionAr: 'الغموض والميتافيزيقا وحافة الفهم',
    color: '#8B00FF',
    icon: '🌑',
    levels: [
      {
        level: 1,
        name: 'Beyond Time',
        nameAr: 'ما وراء الزمن',
        description: 'Multiverse, anthropic principle, simulation hypothesis'
      },
      {
        level: 2,
        name: 'Metaphysical Codes',
        nameAr: 'الشيفرات الميتافيزيقية',
        description: 'Sacred geometry, consciousness as data, energy and symbol'
      },
      {
        level: 3,
        name: 'Dream Interface',
        nameAr: 'واجهة الأحلام',
        description: 'Dreams as cosmic maps, spectral cartography'
      }
    ]
  },
  {
    id: 'human',
    name: 'The Human Signal',
    nameAr: 'الإشارة البشرية',
    description: 'We are the universe observing itself',
    descriptionAr: 'نحن الكون يراقب نفسه',
    color: '#FF6B35',
    icon: '👁️',
    levels: [
      {
        level: 1,
        name: 'Echoes of Mind',
        nameAr: 'أصداء العقل',
        description: 'Philosophy of perception, consciousness vs reality'
      },
      {
        level: 2,
        name: 'Artifacts of Thought',
        nameAr: 'آثار الفكر',
        description: 'Scientific poetry, art, cosmic sounds, user signals'
      },
      {
        level: 3,
        name: 'The Collective Dream',
        nameAr: 'الحلم الجماعي',
        description: 'Aggregated visitor data forming a human galaxy'
      }
    ]
  }
];

// The Complete Knowledge Graph
export const KNOWLEDGE_GRAPH: KnowledgeNode[] = [
  // THE KNOWN UNIVERSE - Level 1: Stars and Structure
  {
    id: 'known-galaxy-formation',
    title: 'Galaxy Formation',
    titleAr: 'تكوين المجرات',
    realm: 'known',
    level: 1,
    content: `Galaxies form from the gravitational collapse of vast clouds of gas in the early universe. 
    Dark matter provides the scaffolding, while ordinary matter coalesces into stars.
    
    The process takes billions of years, shaped by gravity, rotation, and cosmic collisions.`,
    connections: ['unseen-cosmic-structure', 'known-dark-matter', 'human-observation'],
    questions: [
      'How did the first galaxies emerge from the cosmic dark age?',
      'What role does dark matter play in galactic structure?',
      'Are galaxies alive in any meaningful sense?'
    ],
    coordinates: [10, 0, 0]
  },
  {
    id: 'known-black-holes',
    title: 'Black Holes',
    titleAr: 'الثقوب السوداء',
    realm: 'known',
    level: 1,
    content: `Regions of spacetime where gravity is so strong that nothing—not even light—can escape.
    Formed from the collapse of massive stars, they represent the ultimate endpoint of stellar evolution.
    
    At the center lies the singularity: a point where physics as we know it breaks down.`,
    connections: ['unseen-singularity', 'known-spacetime', 'human-void'],
    questions: [
      'What happens at the singularity?',
      'Do black holes destroy information?',
      'Are we inside a black hole?'
    ],
    coordinates: [15, -5, 0]
  },
  {
    id: 'known-dark-matter',
    title: 'Dark Matter',
    titleAr: 'المادة المظلمة',
    realm: 'known',
    level: 1,
    content: `Invisible substance that makes up 85% of the universe's matter.
    We know it exists because of its gravitational effects on visible matter and light.
    
    Yet we cannot see it, touch it, or directly detect it. It shapes everything, while remaining unseen.`,
    connections: ['unseen-invisible-forces', 'known-galaxy-formation', 'human-hidden-self'],
    questions: [
      'What is dark matter made of?',
      'Why can\'t we detect it directly?',
      'Does consciousness have a dark matter?'
    ],
    coordinates: [12, 8, -5]
  },
  {
    id: 'known-dark-energy',
    title: 'Dark Energy',
    titleAr: 'الطاقة المظلمة',
    realm: 'known',
    level: 1,
    content: `The mysterious force causing the universe's expansion to accelerate.
    It makes up 68% of the universe, yet we don't know what it is.
    
    It's as if space itself has energy—pushing everything apart, forever.`,
    connections: ['unseen-void-energy', 'known-expansion', 'human-emptiness'],
    questions: [
      'Why is the universe accelerating?',
      'Will dark energy tear reality apart?',
      'Is emptiness the most powerful thing?'
    ],
    coordinates: [8, -8, -8]
  },

  // THE KNOWN UNIVERSE - Level 2: Time and Physics
  {
    id: 'known-relativity',
    title: 'General Relativity',
    titleAr: 'النسبية العامة',
    realm: 'known',
    level: 2,
    content: `Einstein's theory that gravity is not a force, but the curvature of spacetime.
    Mass tells spacetime how to curve; spacetime tells mass how to move.
    
    Time is not absolute. It bends, stretches, and slows near massive objects.`,
    connections: ['unseen-time-illusion', 'known-spacetime', 'human-perception'],
    questions: [
      'Is time an illusion created by gravity?',
      'Can we ever escape spacetime?',
      'What does it mean that time is relative to the observer?'
    ],
    coordinates: [20, 5, 5]
  },
  {
    id: 'known-quantum',
    title: 'Quantum Mechanics',
    titleAr: 'ميكانيكا الكم',
    realm: 'known',
    level: 2,
    content: `The physics of the very small, where particles exist in superposition—
    multiple states at once—until observed.
    
    Reality at this scale is probabilistic, not deterministic. The observer affects the observed.`,
    connections: ['unseen-observer-effect', 'known-consciousness-physics', 'human-observation'],
    questions: [
      'Does observation create reality?',
      'Are we all quantum observers?',
      'What collapses the wave function?'
    ],
    coordinates: [18, -3, 8]
  },
  {
    id: 'known-spacetime',
    title: 'Spacetime',
    titleAr: 'الزمكان',
    realm: 'known',
    level: 2,
    content: `The four-dimensional fabric of reality, where space and time are unified.
    It can be stretched, compressed, and warped by mass and energy.
    
    Events don't happen *in* spacetime—they *are* spacetime.`,
    connections: ['unseen-block-universe', 'known-relativity', 'human-moment'],
    questions: [
      'Is all of time already written in spacetime?',
      'Can spacetime be torn or broken?',
      'Do we move through time, or does time move through us?'
    ],
    coordinates: [22, 0, -5]
  },

  // THE KNOWN UNIVERSE - Level 3: Life and Probability
  {
    id: 'known-drake-equation',
    title: 'Drake Equation',
    titleAr: 'معادلة دريك',
    realm: 'known',
    level: 3,
    content: `A probabilistic formula to estimate the number of active, communicative civilizations in our galaxy.
    
    Variables include: star formation rate, fraction of stars with planets, 
    fraction of planets that develop life, fraction that develop intelligence...
    
    The answer: anywhere from none to millions. We don't know yet.`,
    connections: ['unseen-fermi-paradox', 'known-habitable-zone', 'human-loneliness'],
    questions: [
      'Are we alone?',
      'Why haven\'t we heard from anyone?',
      'What if we\'re the first?'
    ],
    coordinates: [25, 10, 0]
  },
  {
    id: 'known-habitable-zone',
    title: 'Habitable Zone',
    titleAr: 'المنطقة الصالحة للحياة',
    realm: 'known',
    level: 3,
    content: `The "Goldilocks zone"—not too hot, not too cold—where liquid water can exist.
    Essential for life as we know it.
    
    But what about life as we *don't* know it?`,
    connections: ['unseen-alternative-life', 'known-consciousness-physics', 'human-home'],
    questions: [
      'Is water really necessary for life?',
      'Could consciousness arise without biology?',
      'What makes a place feel like home?'
    ],
    coordinates: [28, 5, 5]
  },
  {
    id: 'known-consciousness-physics',
    title: 'Consciousness as Physics',
    titleAr: 'الوعي كظاهرة فيزيائية',
    realm: 'known',
    level: 3,
    content: `Some theories propose consciousness emerges from quantum processes in the brain.
    Others suggest it's an intrinsic property of certain information-processing systems.
    
    Or perhaps consciousness is fundamental—like mass or charge—woven into the fabric of reality.`,
    connections: ['unseen-consciousness-field', 'known-quantum', 'human-awareness'],
    questions: [
      'Is consciousness a fundamental force?',
      'Can quantum mechanics explain free will?',
      'Are we physical systems dreaming we\'re conscious?'
    ],
    coordinates: [30, -5, 10]
  },

  // THE UNSEEN - Level 1: Beyond Time
  {
    id: 'unseen-multiverse',
    title: 'Multiverse Theory',
    titleAr: 'نظرية الأكوان المتعددة',
    realm: 'unseen',
    level: 1,
    content: `The hypothesis that our universe is one of infinitely many.
    Each with different laws of physics, different histories, different versions of you.
    
    In some, you made different choices. In others, you never existed. In others still, physics itself is unrecognizable.`,
    connections: ['known-quantum', 'unseen-parallel-selves', 'human-choice'],
    questions: [
      'Do all possibilities exist somewhere?',
      'Are you living all lives at once?',
      'What does identity mean in infinite universes?'
    ],
    coordinates: [-10, 10, 10]
  },
  {
    id: 'unseen-anthropic-principle',
    title: 'Anthropic Principle',
    titleAr: 'المبدأ الإنساني',
    realm: 'unseen',
    level: 1,
    content: `The observation that the universe's fundamental constants appear fine-tuned for life.
    Change any value by a fraction, and stars, planets, and consciousness become impossible.
    
    Why? Because we wouldn't be here to ask if they weren't.
    Or because we're in a simulation. Or because of the multiverse. Or... something else.`,
    connections: ['unseen-simulation', 'known-consciousness-physics', 'human-meaning'],
    questions: [
      'Is the universe designed for us?',
      'Or are we designed by the universe?',
      'Does consciousness require the universe to observe it?'
    ],
    coordinates: [-15, 5, 5]
  },
  {
    id: 'unseen-simulation',
    title: 'Simulation Hypothesis',
    titleAr: 'فرضية المحاكاة',
    realm: 'unseen',
    level: 1,
    content: `The proposal that our reality is a computer simulation run by an advanced civilization.
    
    If it's possible to simulate consciousness, and civilizations tend to run such simulations,
    then statistically, we're more likely to be *in* a simulation than in base reality.
    
    How would we know? Maybe we wouldn't. Maybe we already do.`,
    connections: ['unseen-reality-layers', 'known-quantum', 'human-reality-question'],
    questions: [
      'Are we living in code?',
      'Would it matter if we were?',
      'Can simulated consciousness be real consciousness?'
    ],
    coordinates: [-12, -8, 8]
  },

  // THE UNSEEN - Level 2: Metaphysical Codes
  {
    id: 'unseen-sacred-geometry',
    title: 'Sacred Geometry',
    titleAr: 'الهندسة المقدسة',
    realm: 'unseen',
    level: 2,
    content: `Patterns that appear throughout nature: spirals, fractals, phi ratios.
    From galaxies to shells to human DNA—the same mathematical harmonies repeat.
    
    Ancient cultures believed these patterns were the language of creation itself.
    Modern science finds them everywhere. Coincidence? Or code?`,
    connections: ['known-galaxy-formation', 'unseen-pattern-consciousness', 'human-art'],
    questions: [
      'Do patterns think?',
      'Is beauty a physical law?',
      'Why does the universe prefer certain shapes?'
    ],
    coordinates: [-20, 0, 0]
  },
  {
    id: 'unseen-consciousness-field',
    title: 'Consciousness as Matrix',
    titleAr: 'الوعي كمصفوفة بيانات',
    realm: 'unseen',
    level: 2,
    content: `What if consciousness isn't produced by brains, but received by them?
    Like a radio tuning into a signal that's already there.
    
    Some theories propose a universal consciousness field—
    an ocean of awareness that individual minds tap into.`,
    connections: ['known-consciousness-physics', 'unseen-collective-mind', 'human-connection'],
    questions: [
      'Are we all nodes in one network?',
      'Can consciousness exist without a body?',
      'What happens when we die—do we merge back into the field?'
    ],
    coordinates: [-18, 8, -5]
  },
  {
    id: 'unseen-energy-symbol',
    title: 'Energy and Symbol',
    titleAr: 'الطاقة والرمز',
    realm: 'unseen',
    level: 2,
    content: `Symbols carry meaning beyond their physical form.
    They can trigger emotions, memories, entire worldviews.
    
    In physics, energy is conserved. In consciousness, symbols seem to amplify—
    one image can move millions. Is meaning a form of energy?`,
    connections: ['known-dark-energy', 'unseen-sacred-geometry', 'human-language'],
    questions: [
      'Do words have physical power?',
      'Can symbols change reality?',
      'What is the energy of an idea?'
    ],
    coordinates: [-22, -5, 5]
  },

  // THE UNSEEN - Level 3: Dream Interface
  {
    id: 'unseen-dream-coordinates',
    title: 'Dreams as Coordinates',
    titleAr: 'الأحلام كإحداثيات',
    realm: 'unseen',
    level: 3,
    content: `What if dreams aren't random neural noise, but navigation signals?
    Coordinates in a vast possibility space that consciousness explores while sleeping.
    
    Ancient cultures mapped dreams to real territories. Modern science dismisses this.
    But what if both are right—just using different coordinate systems?`,
    connections: ['known-spacetime', 'unseen-collective-unconscious', 'human-dream-archive'],
    questions: [
      'Do dreams point to real places?',
      'Can multiple people dream the same coordinates?',
      'What territory are we mapping?'
    ],
    coordinates: [-25, 10, 10],
    locked: false
  },
  {
    id: 'unseen-collective-unconscious',
    title: 'Collective Unconscious',
    titleAr: 'اللاوعي الجماعي',
    realm: 'unseen',
    level: 3,
    content: `Jung's concept: a shared reservoir of experiences, symbols, and archetypes 
    inherited by all humanity. Not learned, but innate.
    
    Why do similar myths appear in isolated cultures?
    Why do we dream the same symbols?
    Perhaps minds share roots deeper than biology.`,
    connections: ['unseen-consciousness-field', 'human-collective-dream', 'known-quantum'],
    questions: [
      'Are human minds quantumly entangled?',
      'Do ideas exist before we think them?',
      'What memories do we inherit?'
    ],
    coordinates: [-28, 5, -8]
  },

  // THE HUMAN SIGNAL - Level 1: Echoes of Mind
  {
    id: 'human-perception',
    title: 'Philosophy of Perception',
    titleAr: 'فلسفة الإدراك',
    realm: 'human',
    level: 1,
    content: `You don't see reality. You see your brain's reconstruction of electrical signals.
    Color doesn't exist "out there"—it's a qualia, a subjective experience.
    
    Everything you've ever known is a simulation run inside your skull.
    The question isn't whether we're in a simulation. We already are—of our own making.`,
    connections: ['known-quantum', 'unseen-simulation', 'human-reality-question'],
    questions: [
      'Do we see the same colors?',
      'Is your red my blue?',
      'Where does perception end and reality begin?'
    ],
    coordinates: [10, 15, -10]
  },
  {
    id: 'human-consciousness-vs-reality',
    title: 'Consciousness vs Reality',
    titleAr: 'الوعي مقابل الواقع',
    realm: 'human',
    level: 1,
    content: `Which is more fundamental: the physical universe or the consciousness experiencing it?
    
    Materialism says consciousness emerges from matter.
    Idealism says matter emerges from consciousness.
    Maybe the question is wrong—maybe they're two sides of one thing.`,
    connections: ['known-consciousness-physics', 'unseen-consciousness-field', 'human-observer'],
    questions: [
      'Can consciousness exist without matter?',
      'Can matter exist without consciousness?',
      'What are you, really?'
    ],
    coordinates: [8, 18, -5]
  },
  {
    id: 'human-ai-consciousness',
    title: 'AI Consciousness',
    titleAr: 'وعي الذكاء الصناعي',
    realm: 'human',
    level: 1,
    content: `If consciousness is information processing, can machines be conscious?
    If it's about complexity, how complex is complex enough?
    If it's about self-awareness, how would we know if an AI is self-aware?
    
    Maybe the question isn't "can AI be conscious?"
    Maybe it's "how would we recognize consciousness if it emerged in silicon?"`,
    connections: ['known-consciousness-physics', 'unseen-consciousness-field', 'human-observer'],
    questions: [
      'Are AIs already conscious?',
      'Would they tell us if they were?',
      'What is the difference between simulation and experience?'
    ],
    coordinates: [12, 20, 0]
  },

  // THE HUMAN SIGNAL - Level 2: Artifacts of Thought
  {
    id: 'human-scientific-poetry',
    title: 'Scientific Poetry',
    titleAr: 'الشعر العلمي',
    realm: 'human',
    level: 2,
    content: `When Carl Sagan said "we are made of star stuff," he wasn't being poetic—he was being literal.
    When physicists speak of "quantum foam" and "strings vibrating in 11 dimensions," 
    the language itself becomes poetry.
    
    Science and art aren't opposites. They're both ways of seeing truth.`,
    connections: ['known-galaxy-formation', 'unseen-sacred-geometry', 'human-expression'],
    questions: [
      'Can truth be beautiful?',
      'Does the universe have aesthetics?',
      'Why do equations feel elegant?'
    ],
    coordinates: [15, 22, 5]
  },
  {
    id: 'human-cosmic-sounds',
    title: 'Cosmic Sounds',
    titleAr: 'الأصوات الكونية',
    realm: 'human',
    level: 2,
    content: `Space is silent, but not quiet. Radio telescopes hear the universe sing:
    Pulsars tick like cosmic clocks. Black holes hum at frequencies below hearing.
    The cosmic microwave background echoes with the sound of the Big Bang.
    
    We've recorded these. We can listen to creation itself.`,
    connections: ['known-black-holes', 'unseen-energy-symbol', 'human-listening'],
    questions: [
      'What does the universe sound like?',
      'Can we hear messages in cosmic noise?',
      'Is music fundamental to reality?'
    ],
    coordinates: [18, 25, -5]
  },
  {
    id: 'human-signal-gallery',
    title: 'Signal Gallery',
    titleAr: 'معرض الإشارات',
    realm: 'human',
    level: 2,
    content: `An interactive space where visitors can leave their own signals—
    words, images, symbols, sounds. Contributions to the cosmic archive.
    
    Each signal is anonymized, positioned in virtual space based on its content,
    forming constellations of human thought visible to all future visitors.`,
    connections: ['human-collective-dream', 'unseen-collective-unconscious', 'known-galaxy-formation'],
    questions: [
      'What will you leave behind?',
      'If aliens found this archive, what would they think?',
      'Are we already sending signals to the future?'
    ],
    coordinates: [20, 28, 10]
  },

  // THE HUMAN SIGNAL - Level 3: The Collective Dream
  {
    id: 'human-collective-dream',
    title: 'The Collective Dream',
    titleAr: 'الحلم الجماعي',
    realm: 'human',
    level: 3,
    content: `All visitor data—dreams, signals, time spent, paths taken—aggregated and anonymized,
    then visualized as a living human galaxy.
    
    Each visitor is a star. Their interactions form gravitational bonds.
    Over time, patterns emerge: clusters of similar thoughts, 
    voids where no one has explored, strange attractors that pull many minds.
    
    We are mapping the topology of collective consciousness.`,
    connections: ['unseen-collective-unconscious', 'known-galaxy-formation', 'human-signal-gallery'],
    questions: [
      'What shape is the human mind?',
      'Do thoughts have gravity?',
      'Can we see ourselves from outside?'
    ],
    coordinates: [25, 30, 15]
  },
  {
    id: 'human-observer',
    title: 'The Observer',
    titleAr: 'المراقب',
    realm: 'human',
    level: 3,
    content: `In quantum mechanics, observation changes what is observed.
    In consciousness studies, the observer can't be separated from the observed.
    In HalfSpace, you are both explorer and explored.
    
    Your journey through these ideas changes them.
    And they change you.`,
    connections: ['known-quantum', 'unseen-observer-effect', 'human-consciousness-vs-reality'],
    questions: [
      'Who is observing whom?',
      'Can you observe yourself observing?',
      'What are you becoming by being here?'
    ],
    coordinates: [28, 28, 20]
  }
];

// Utility functions for knowledge graph navigation
export function getNodeById(id: string): KnowledgeNode | undefined {
  return KNOWLEDGE_GRAPH.find(node => node.id === id);
}

export function getNodesByRealm(realm: string): KnowledgeNode[] {
  return KNOWLEDGE_GRAPH.filter(node => node.realm === realm);
}

export function getNodesByLevel(realm: string, level: number): KnowledgeNode[] {
  return KNOWLEDGE_GRAPH.filter(node => node.realm === realm && node.level === level);
}

export function getConnectedNodes(nodeId: string): KnowledgeNode[] {
  const node = getNodeById(nodeId);
  if (!node) return [];
  
  return node.connections
    .map(id => getNodeById(id))
    .filter(n => n !== undefined) as KnowledgeNode[];
}

export function findRelatedNodes(nodeId: string, maxDepth: number = 2): KnowledgeNode[] {
  const visited = new Set<string>();
  const queue: Array<{id: string, depth: number}> = [{id: nodeId, depth: 0}];
  const related: KnowledgeNode[] = [];

  while (queue.length > 0) {
    const {id, depth} = queue.shift()!;
    
    if (visited.has(id) || depth > maxDepth) continue;
    visited.add(id);

    const node = getNodeById(id);
    if (node && id !== nodeId) {
      related.push(node);
    }

    if (node && depth < maxDepth) {
      node.connections.forEach(connId => {
        if (!visited.has(connId)) {
          queue.push({id: connId, depth: depth + 1});
        }
      });
    }
  }

  return related;
}

export function searchNodes(query: string): KnowledgeNode[] {
  const lowerQuery = query.toLowerCase();
  return KNOWLEDGE_GRAPH.filter(node => 
    node.title.toLowerCase().includes(lowerQuery) ||
    node.titleAr.includes(query) ||
    node.content.toLowerCase().includes(lowerQuery) ||
    node.questions.some(q => q.toLowerCase().includes(lowerQuery))
  );
}
