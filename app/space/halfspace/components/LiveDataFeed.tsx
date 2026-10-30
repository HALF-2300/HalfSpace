'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveMetric {
  label: string;
  value: string | number;
  source?: string;
  trend?: 'up' | 'down' | 'stable';
  updated?: string;
}

export default function LiveDataFeed() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMetrics([
      { label: 'Gaia DR3 catalogue sources', value: '1,811,709,771', source: 'ESA Gaia DR3 · 2022 release', updated: '2022-06-13' },
    ]);
  }, []);

  useEffect(() => {
    // Rotate through metrics
    if (metrics.length === 0) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % metrics.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [metrics]);

  if (metrics.length === 0) return null;

  const currentMetric = metrics[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="live-data-feed"
    >
      <div className="feed-header">
        <span className="feed-icon">📡</span>
        <span className="feed-title">DATED CATALOGUE RECORD</span>
      </div>
      
      <AnimatePresence mode="wait">
        {isVisible && currentMetric && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="metric-display"
          >
            <div className="metric-label">{currentMetric.label}</div>
            <div className="metric-value">{currentMetric.value}</div>
            {currentMetric.source && (
              <div className="metric-source">Source: <a href="https://www.cosmos.esa.int/web/gaia/dr3" target="_blank" rel="noreferrer">{currentMetric.source} ↗</a></div>
            )}
            {currentMetric.updated && (
              <div className="metric-updated">Release date: {currentMetric.updated} · Static record</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="feed-dots">
        {metrics.map((_, index) => (
          <button
            type="button"
            aria-label={`Show record ${index + 1}`}
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsVisible(true);
              }, 300);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
