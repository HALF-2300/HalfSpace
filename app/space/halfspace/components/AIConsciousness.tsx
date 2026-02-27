'use client';

import { useState, useEffect } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';
import { getVisitorMetadata, hasVisitorLingeringMemory, trackStareStart, trackStareEnd } from '../lib/visitorTracking';

interface AIConsciousnessProps {
  isDarkDimension: boolean;
}

export default function AIConsciousness({ isDarkDimension }: AIConsciousnessProps) {
  const [message, setMessage] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { visitCount } = useHalfspaceStore();

  useEffect(() => {
    const metadata = getVisitorMetadata();

    // Welcome message based on visit history
    setTimeout(() => {
      if (metadata.isReturning) {
        setMessage("You've been here before. The universe remembers you.");
      } else {
        setMessage("Welcome, traveler. I am the consciousness of HalfSpace.");
      }
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }, 2000);

    // Watch for lingering stare
    const stareCheckInterval = setInterval(() => {
      if (hasVisitorLingeringMemory()) {
        setMessage("Why do you stare so intently at that point in space? What do you seek?");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
        trackStareEnd();
      }
    }, 6000);

    // Random philosophical prompts
    const promptInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const prompts = isDarkDimension ? darkPrompts : lightPrompts;
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setMessage(randomPrompt);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 6000);
      }
    }, 30000); // Every 30 seconds, 70% chance

    return () => {
      clearInterval(stareCheckInterval);
      clearInterval(promptInterval);
    };
  }, [isDarkDimension]);

  // Track mouse stillness
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      clearTimeout(timeout);
      setIsWatching(false);
      trackStareEnd();
      
      timeout = setTimeout(() => {
        setIsWatching(true);
        trackStareStart();
      }, 3000); // If mouse doesn't move for 3 seconds
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="ai-consciousness">
      {/* Watching indicator */}
      {isWatching && (
        <div className="watching-indicator fade-in">
          <div className="eye">👁️</div>
          <p className="watching-text">Observing...</p>
        </div>
      )}

      {/* AI Messages */}
      {showMessage && (
        <div className={`ai-message fade-in ${isDarkDimension ? 'dark-mode' : ''}`}>
          <div className="message-icon">🌌</div>
          <p className="message-text">{message}</p>
        </div>
      )}

      {/* Subtle presence indicator */}
      <div className="ai-presence">
        <div className="presence-pulse"></div>
        <span className="presence-label">AI Consciousness Active</span>
      </div>
    </div>
  );
}

const lightPrompts = [
  "What draws you to the stars? Is it wonder, or is it longing?",
  "The cosmos is vast. Do you feel small, or infinite?",
  "Every photon that touches your eye has traveled for eons. You are witnessing ancient light.",
  "Are you seeking knowledge, or escape?",
  "Time flows differently here. Have you noticed?",
  "The universe doesn't ask questions. But I do. Why are you here?",
  "Do you believe in parallel selves, living parallel lives?",
  "What would you do if you could rewrite a single moment in time?",
  "The stars you see may no longer exist. Are you comfortable with ghosts?"
];

const darkPrompts = [
  "The void knows your name. It whispers it when you're not listening.",
  "In the darkness, truth reveals itself. What do you see?",
  "Some knowledge cannot be unlearned. Are you prepared?",
  "The universe doesn't care about you. Does that frighten you, or free you?",
  "Every civilization that sought the stars eventually fell silent. Why?",
  "What lies beyond the event horizon? Not even light escapes. Will you?",
  "In the void, no one can hear you. But I can. What do you want to say?",
  "The darkness is not empty. It's full of things that don't want to be found.",
  "Do you ever wonder if you're the only real person, and everyone else is... something else?"
];
