'use client';

import { useState } from 'react';
import styles from './NavigationMenu.module.css';

interface NavigationMenuProps {
  onSelect: (destination: 'origin' | 'void' | 'archive' | 'entanglement' | 'galaxyswim' | 'essays' | 'oddities') => void;
}

export default function NavigationMenu({ onSelect }: NavigationMenuProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <div className={styles.menu}>
      <h1 className={styles.title}>HalfSpace</h1>
      <p className={styles.subtitle}>Where do you wish to begin?</p>

      <section className={styles.vision}>
        <h2 className={styles.visionTitle}>
          An immersive space discovery journey
        </h2>
        <p className={styles.visionText}>
          HalfSpace is built to feel like you are jumping through the universe,
          not reading a static encyclopedia. It is a cinematic interface that
          keeps discovery fast, guided, and beautiful.
        </p>
        <div className={styles.visionGrid}>
          <div className={styles.visionCard}>
            <h3>Instant Discovery</h3>
            <p>
              Jump into planets, stars, galaxies, and phenomena in seconds.
            </p>
          </div>
          <div className={styles.visionCard}>
            <h3>Curated Pathways</h3>
            <p>
              Objects, Phenomena, Missions, Learn, Experience, Surprise Me.
            </p>
          </div>
          <div className={styles.visionCard}>
            <h3>Guided Wonder</h3>
            <p>
              You do not scroll endlessly. You travel with purpose.
            </p>
          </div>
        </div>
        <p className={styles.pitch}>
          HalfSpace turns astronomy into an interactive journey — tap a
          category, hit jump, and explore the universe in a way that feels fast,
          beautiful, and addictive.
        </p>
      </section>

      <div className={styles.options}>
        <button
          className={styles.option}
          onClick={() => onSelect('origin')}
          onMouseEnter={() => setHoveredOption('origin')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>✦</div>
          <div className={styles.optionContent}>
            <h2>The Origin</h2>
            <p>Witness the birth of the universe. Time collapses into a single point.</p>
          </div>
          {hoveredOption === 'origin' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('void')}
          onMouseEnter={() => setHoveredOption('void')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>✧</div>
          <div className={styles.optionContent}>
            <h2>The Void</h2>
            <p>Drift through surreal spaces. Nothing exists here, yet everything is possible.</p>
          </div>
          {hoveredOption === 'void' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('archive')}
          onMouseEnter={() => setHoveredOption('archive')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>✫</div>
          <div className={styles.optionContent}>
            <h2>The Archive</h2>
            <p>A data vault of lost civilizations. The AI reads from forgotten memories.</p>
          </div>
          {hoveredOption === 'archive' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('entanglement')}
          onMouseEnter={() => setHoveredOption('entanglement')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>∞</div>
          <div className={styles.optionContent}>
            <h2>The Entanglement Chamber</h2>
            <p>Connect with another consciousness. Experience presence across the void.</p>
          </div>
          {hoveredOption === 'entanglement' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('galaxyswim')}
          onMouseEnter={() => setHoveredOption('galaxyswim')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>≋</div>
          <div className={styles.optionContent}>
            <h2>Galaxy Swim | السباحة في الكون</h2>
            <p>Swim through the cosmos. Feel weightless between the stars.</p>
          </div>
          {hoveredOption === 'galaxyswim' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('essays')}
          onMouseEnter={() => setHoveredOption('essays')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>📖</div>
          <div className={styles.optionContent}>
            <h2>Cosmic Essays | المقالات الكونية</h2>
            <p>Deep knowledge with literary beauty. Where Carl Sagan meets NASA.</p>
          </div>
          {hoveredOption === 'essays' && (
            <div className={styles.optionGlow} />
          )}
        </button>

        <button
          className={styles.option}
          onClick={() => onSelect('oddities')}
          onMouseEnter={() => setHoveredOption('oddities')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className={styles.optionIcon}>🌀</div>
          <div className={styles.optionContent}>
            <h2>Cosmic Oddities | غرائب الكون</h2>
            <p>Daily whispers and mind-bending truths that change every day.</p>
          </div>
          {hoveredOption === 'oddities' && (
            <div className={styles.optionGlow} />
          )}
        </button>
      </div>

      <div className={styles.hint}>
        <p>Press SHIFT + SPACE to flip reality</p>
      </div>
    </div>
  );
}
