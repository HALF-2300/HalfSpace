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
    // Load live metrics from JSON
    fetch('/data/halfspace/deep-content.json')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.liveMetrics) {
          const metricsArray = Object.entries(data.data.liveMetrics).map(([key, value]: [string, any]) => ({
            label: value.label,
            value: value.current,
            source: value.source,
            updated: value.updated,
          }));
          setMetrics(metricsArray);
        }
      })
      .catch(err => console.error('Failed to load live data:', err));
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
        <span className="feed-title">LIVE FROM THE COSMOS</span>
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
              <div className="metric-source">Source: {currentMetric.source}</div>
            )}
            {currentMetric.updated && (
              <div className="metric-updated">Updated: {currentMetric.updated}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="feed-dots">
        {metrics.map((_, index) => (
          <span
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
