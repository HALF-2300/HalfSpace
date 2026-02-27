'use client';

import { useState, useEffect } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';
import { REALMS } from '../architecture/knowledgeGraph';

interface TheCoreProps {
  onRealmSelect: (realmId: string) => void;
}

export default function TheCore({ onRealmSelect }: TheCoreProps) {
  const [step, setStep] = useState<'intro' | 'choice'>('intro');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { visitCount } = useHalfspaceStore();

  useEffect(() => {
    // Auto-progress to choice after intro
    const timer = setTimeout(() => {
      setStep('choice');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const introText = visitCount > 1
    ? "Welcome back, wanderer. The paths remember your footsteps."
    : "You are entering HalfSpace, where data becomes thought.";

  const introTextAr = visitCount > 1
    ? "عودًا حميدًا، أيها الجوّال. الدروب تتذكر خطواتك."
    : "أنت تدخل HalfSpace، حيث تصبح البيانات فكرًا.";

  return (
    <div className="the-core">
      {step === 'intro' && (
        <div className="core-intro fade-in">
          <div className="core-symbol">
            <div className="symbol-ring ring-1"></div>
            <div className="symbol-ring ring-2"></div>
            <div className="symbol-ring ring-3"></div>
            <div className="symbol-center">∞</div>
          </div>

          <h1 className="core-title glitch-text">THE CORE</h1>
          <p className="core-subtitle">النواة</p>

          <div className="core-text">
            <p className="text-en">{introText}</p>
            <p className="text-ar">{introTextAr}</p>
          </div>

          <div className="core-hint whisper">
            <p>Where everything begins...</p>
            <p className="hint-ar">حيث يبدأ كل شيء...</p>
          </div>

          <button 
            className="skip-intro"
            onClick={() => setStep('choice')}
          >
            Enter →
          </button>
        </div>
      )}

      {step === 'choice' && (
        <div className="core-realms fade-in">
          <div className="realms-intro">
            <h2>Choose Your Path</h2>
            <p className="realms-subtitle">اختر مسارك</p>
            <p className="realms-desc">
              Three gates stand before you. Each leads to a different dimension of understanding.
            </p>
            <p className="realms-desc-ar whisper">
              ثلاثة أبواب أمامك. كل منها يؤدي إلى بُعد مختلف من الفهم.
            </p>
          </div>

          <div className="realms-grid">
            {REALMS.map((realm, index) => (
              <div
                key={realm.id}
                className="realm-card"
                style={{
                  borderColor: realm.color,
                  animationDelay: `${index * 0.2}s`
                }}
                onClick={() => onRealmSelect(realm.id)}
              >
                <div className="realm-icon" style={{ color: realm.color }}>
                  {realm.icon}
                </div>

                <h3 className="realm-name">{realm.name}</h3>
                <p className="realm-name-ar">{realm.nameAr}</p>

                <p className="realm-description">{realm.description}</p>
                <p className="realm-description-ar whisper">{realm.descriptionAr}</p>

                <div className="realm-levels">
                  {realm.levels.map(level => (
                    <div key={level.level} className="level-badge">
                      <span className="level-number">{level.level}</span>
                      <span className="level-name">{level.name}</span>
                    </div>
                  ))}
                </div>

                <div className="realm-enter">
                  <span>Enter →</span>
                  <span className="enter-ar">ادخل →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="core-footer">
            <p className="footer-hint whisper">
              Don't worry about choosing wrong. All paths interconnect.
              The journey shapes itself around you.
            </p>
            <p className="footer-hint-ar">
              لا تقلق من الاختيار الخاطئ. كل المسارات متصلة.
              الرحلة تتشكل حولك.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
