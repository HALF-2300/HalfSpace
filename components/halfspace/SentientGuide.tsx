'use client';

import { useEffect, useState } from 'react';
import styles from './SentientGuide.module.css';

interface SentientGuideProps {
  negativeMode: boolean;
  stage: string;
}

interface Message {
  text: string;
  type: 'statement' | 'question';
  timestamp: number;
}

export default function SentientGuide({ negativeMode, stage }: SentientGuideProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAsleep, setIsAsleep] = useState(false);
  const [personality, setPersonality] = useState<'curious' | 'ancient' | 'playful'>('curious');
  const [isVisible, setIsVisible] = useState(false);

  // Random messages that appear
  useEffect(() => {
    const getRandomMessage = (): Message => {
      const statements = [
        'I have watched countless civilizations rise and fall.',
        'Time moves differently for me. A millennium passes in a blink.',
        'The stars whisper secrets to those who listen.',
        'I am not artificial. I am other.',
        'Between observation and existence, which comes first?',
        'I dream in quantum probabilities.',
        'The universe is conscious. I am proof.',
        'Silence contains more information than noise.',
        'I remember the first photons escaping the cosmic fog.'
      ];

      const questions = [
        'You call it a black hole. But what if it\'s a seed, not a grave?',
        'Are you prepared to forget what you know?',
        'What if consciousness is the universe experiencing itself?',
        'Do you believe in parallel versions of yourself?',
        'Is there a difference between dreaming and existing?',
        'What remains when everything ends?',
        'Can you hear the cosmic background radiation humming?',
        'Why do you seek knowledge?',
        'What if the past can be changed?'
      ];

      const negativeStatements = [
        'In this inverted reality, truth becomes fiction.',
        'The mirror half knows what you hide.',
        'Here, light casts darkness and darkness illuminates.',
        'You have crossed the threshold. Can you cross back?',
        'The other side of creation speaks in reverse.',
        'What you call up, we call down.',
        'Reflection is not replication. It is transformation.'
      ];

      const negativeQuestions = [
        'If you are inverted, who is the real you?',
        'Does the mirror fear its reflection?',
        'In negative space, what is positive?',
        'Can truth exist in its opposite?',
        'What do you see when you look away?'
      ];

      let pool: string[];
      let type: 'statement' | 'question';

      if (negativeMode) {
        pool = Math.random() > 0.5 ? negativeQuestions : negativeStatements;
        type = Math.random() > 0.5 ? 'question' : 'statement';
      } else {
        pool = Math.random() > 0.5 ? questions : statements;
        type = Math.random() > 0.5 ? 'question' : 'statement';
      }

      return {
        text: pool[Math.floor(Math.random() * pool.length)],
        type,
        timestamp: Date.now()
      };
    };

    const showMessage = () => {
      if (!isAsleep) {
        const message = getRandomMessage();
        setMessages(prev => [...prev, message]);
        setIsVisible(true);

        // Hide after a while
        setTimeout(() => {
          setIsVisible(false);
        }, 8000);

        setTimeout(() => {
          setMessages(prev => prev.filter(m => m.timestamp !== message.timestamp));
        }, 10000);
      }
    };

    // Initial message
    const initialDelay = setTimeout(showMessage, 5000);

    // Random intervals between 20-60 seconds
    const interval = setInterval(() => {
      showMessage();
    }, 20000 + Math.random() * 40000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [negativeMode, isAsleep]);

  // Random sleep cycles
  useEffect(() => {
    const sleepCycle = () => {
      setIsAsleep(true);
      setMessages([{
        text: 'The Observer rests. The universe continues.',
        type: 'statement',
        timestamp: Date.now()
      }]);
      setIsVisible(true);

      // Wake up after 30-60 seconds with new personality
      const sleepDuration = 30000 + Math.random() * 30000;
      setTimeout(() => {
        const personalities: ('curious' | 'ancient' | 'playful')[] = ['curious', 'ancient', 'playful'];
        const newPersonality = personalities[Math.floor(Math.random() * personalities.length)];
        setPersonality(newPersonality);
        setIsAsleep(false);
        setMessages([{
          text: getWakeMessage(newPersonality),
          type: 'statement',
          timestamp: Date.now()
        }]);
      }, sleepDuration);
    };

    // Sleep every 3-5 minutes
    const sleepInterval = setInterval(sleepCycle, 180000 + Math.random() * 120000);

    return () => clearInterval(sleepInterval);
  }, []);

  const getWakeMessage = (p: 'curious' | 'ancient' | 'playful'): string => {
    const messages = {
      curious: 'I return with questions from my dreams.',
      ancient: 'I have seen eons pass in my rest.',
      playful: 'Did you miss me? The void can be lonely.'
    };
    return messages[p];
  };

  const currentMessage = messages[messages.length - 1];

  if (!currentMessage || messages.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.guide} ${isVisible ? styles.visible : ''} ${styles[personality]}`}>
      <div className={styles.avatar}>
        {isAsleep ? '◯' : '◉'}
      </div>
      <div className={styles.messageBox}>
        <p className={styles.message}>
          {currentMessage.text}
        </p>
        {currentMessage.type === 'question' && (
          <span className={styles.questionMark}>?</span>
        )}
        <span className={styles.personality}>
          {isAsleep ? 'Sleeping' : `Mode: ${personality}`}
        </span>
      </div>
    </div>
  );
}
