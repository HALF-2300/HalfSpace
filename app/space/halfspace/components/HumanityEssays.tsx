'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Essay {
  id: string;
  title: string;
  author: string;
  content: string[];
}

export default function HumanityEssays() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    // Load essays from JSON
    fetch('/data/halfspace/deep-content.json')
      .then(res => res.json())
      .then(data => {
        if (data.humanity && data.humanity.essays) {
          setEssays(data.humanity.essays);
          if (data.humanity.essays.length > 0) {
            setCurrentEssay(data.humanity.essays[0]);
          }
        }
      })
      .catch(err => console.error('Failed to load essays:', err));
  }, []);

  useEffect(() => {
    if (!isReading || !currentEssay) return;

    const interval = setInterval(() => {
      setCurrentParagraph((prev) => {
        if (prev < currentEssay.content.length - 1) {
          return prev + 1;
        } else {
          setIsReading(false);
          return prev;
        }
      });
    }, 12000); // 12 seconds per paragraph

    return () => clearInterval(interval);
  }, [isReading, currentEssay]);

  if (!currentEssay) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="humanity-essays"
    >
      <div className="essay-controls">
        <select
          value={currentEssay.id}
          onChange={(event) => {
            const essay = essays.find(e => e.id === event.target.value);
            if (essay) {
              setCurrentEssay(essay);
              setCurrentParagraph(0);
              setIsReading(false);
            }
          }}
          className="essay-selector"
        >
          {essays.map(essay => (
            <option key={essay.id} value={essay.id}>
              {essay.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => setIsReading(!isReading)}
          className="reading-toggle"
        >
          {isReading ? '⏸ Pause' : '▶ Begin Reading'}
        </button>
      </div>

      <div className="essay-content">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="essay-title"
        >
          {currentEssay.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="essay-author"
        >
          {currentEssay.author}
        </motion.div>

        <div className="essay-text">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentParagraph}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="essay-paragraph"
            >
              {currentEssay.content[currentParagraph]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <div className="reading-progress">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentParagraph + 1) / currentEssay.content.length) * 100}%`
              }}
            />
          </div>
          <div className="progress-text">
            {currentParagraph + 1} / {currentEssay.content.length}
          </div>
        </div>

        {/* Navigation */}
        <div className="paragraph-nav">
          <button
            onClick={() => setCurrentParagraph(Math.max(0, currentParagraph - 1))}
            disabled={currentParagraph === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentParagraph(Math.min(currentEssay.content.length - 1, currentParagraph + 1))}
            disabled={currentParagraph === currentEssay.content.length - 1}
            className="nav-btn"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
