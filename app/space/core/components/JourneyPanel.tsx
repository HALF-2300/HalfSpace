'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Journey,
  JourneyProgress,
  JourneyGoal,
  journeyGoals,
  generateJourney,
  saveJourneyProgress,
  loadJourneyProgress,
  createJourneyProgress,
  updateJourneyProgress,
  calculateJourneyCompletion,
  getActiveJourneyIds,
  deleteJourney
} from '../lib/journey-engine';
import { KnowledgeNode, getNodeById } from '../lib/knowledge-graph';

interface JourneyPanelProps {
  onStepSelect?: (node: KnowledgeNode, stepIndex: number) => void;
  onCreateArtifact?: (journey: Journey, progress: JourneyProgress) => void;
}

/**
 * Journey Panel - لوحة الرحلات التعليمية
 */
export default function JourneyPanel({
  onStepSelect,
  onCreateArtifact
}: JourneyPanelProps) {
  const [view, setView] = useState<'select' | 'active' | 'journey'>('select');
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [savedJourneyIds, setSavedJourneyIds] = useState<string[]>([]);

  // تحميل الرحلات المحفوظة
  useEffect(() => {
    const ids = getActiveJourneyIds();
    setSavedJourneyIds(ids);
    
    // إذا كانت هناك رحلة نشطة، اعرضها
    if (ids.length > 0) {
      const savedProgress = loadJourneyProgress(ids[0]);
      if (savedProgress) {
        // إعادة توليد الرحلة من الهدف
        const goalMatch = ids[0].match(/journey-(\w+)-/);
        if (goalMatch) {
          const goal = goalMatch[1] as JourneyGoal;
          const journey = generateJourney(goal);
          journey.id = ids[0]; // الاحتفاظ بنفس المعرف
          setActiveJourney(journey);
          setProgress(savedProgress);
          setView('journey');
        }
      }
    }
  }, []);

  // بدء رحلة جديدة
  const startJourney = useCallback((goal: JourneyGoal) => {
    const journey = generateJourney(goal);
    const newProgress = createJourneyProgress(journey);
    
    setActiveJourney(journey);
    setProgress(newProgress);
    saveJourneyProgress(newProgress);
    setSavedJourneyIds(prev => [...prev, journey.id]);
    setView('journey');
  }, []);

  // تحديث تقدم خطوة
  const toggleStepComplete = useCallback((stepIndex: number) => {
    if (!progress || !activeJourney) return;
    
    const isCompleted = progress.completedSteps.includes(stepIndex);
    const updated = updateJourneyProgress(progress, stepIndex, !isCompleted);
    
    setProgress(updated);
    saveJourneyProgress(updated);
  }, [progress, activeJourney]);

  // حذف رحلة
  const handleDeleteJourney = useCallback((journeyId: string) => {
    deleteJourney(journeyId);
    setSavedJourneyIds(prev => prev.filter(id => id !== journeyId));
    
    if (activeJourney?.id === journeyId) {
      setActiveJourney(null);
      setProgress(null);
      setView('select');
    }
  }, [activeJourney]);

  // العودة لاختيار رحلة
  const goBack = useCallback(() => {
    setView('select');
    setActiveJourney(null);
    setProgress(null);
  }, []);

  return (
    <div className="journey-panel bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span>Journey Engine</span>
          </h2>
          {view !== 'select' && (
            <button
              onClick={goBack}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← رحلة جديدة
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {/* Goal Selection */}
        {view === 'select' && (
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4 text-center">
              اختر هدفك وابدأ رحلة تعليمية مخصصة
            </p>
            <div className="grid gap-3">
              {Object.values(journeyGoals).map(goal => (
                <button
                  key={goal.id}
                  onClick={() => startJourney(goal.id)}
                  className="p-4 bg-white/5 hover:bg-cyan-500/20 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-bold group-hover:text-cyan-300 transition-colors">
                        {goal.title_ar}
                      </h3>
                      <p className="text-gray-400 text-sm">{goal.title}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {goal.description_ar}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-cyan-400">
                        <span>~{goal.estimatedSteps} خطوات</span>
                        <span>•</span>
                        <span>~{goal.estimatedSteps * 4} دقيقة</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Saved Journeys */}
            {savedJourneyIds.length > 0 && (
              <div className="mt-6 pt-4 border-t border-cyan-500/20">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  الرحلات السابقة ({savedJourneyIds.length})
                </h3>
                <div className="space-y-2">
                  {savedJourneyIds.map(id => {
                    const goalMatch = id.match(/journey-(\w+)-/);
                    if (!goalMatch) return null;
                    const goal = journeyGoals[goalMatch[1] as JourneyGoal];
                    if (!goal) return null;
                    
                    const savedProgress = loadJourneyProgress(id);
                    const completion = savedProgress 
                      ? calculateJourneyCompletion(savedProgress, goal.estimatedSteps)
                      : 0;

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <button
                          onClick={() => {
                            const journey = generateJourney(goal.id);
                            journey.id = id;
                            setActiveJourney(journey);
                            setProgress(savedProgress || createJourneyProgress(journey));
                            setView('journey');
                          }}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          <span>{goal.icon}</span>
                          <div>
                            <div className="text-white text-sm">{goal.title_ar}</div>
                            <div className="text-xs text-gray-500">{completion}% مكتمل</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteJourney(id)}
                          className="text-red-400 hover:text-red-300 text-sm px-2"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Journey */}
        {view === 'journey' && activeJourney && progress && (
          <div className="p-4">
            {/* Journey Header */}
            <div className="mb-4 p-4 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{activeJourney.goalInfo.icon}</span>
                <div>
                  <h3 className="text-white font-bold">
                    {activeJourney.goalInfo.title_ar}
                  </h3>
                  <p className="text-cyan-300 text-sm">
                    {activeJourney.goalInfo.title}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{progress.completedSteps.length} / {activeJourney.steps.length} خطوات</span>
                  <span>{calculateJourneyCompletion(progress, activeJourney.steps.length)}%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                    style={{ 
                      width: `${calculateJourneyCompletion(progress, activeJourney.steps.length)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {onCreateArtifact && progress.completedSteps.length > 0 && (
                  <button
                    onClick={() => onCreateArtifact(activeJourney, progress)}
                    className="flex-1 px-3 py-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-purple-200 text-sm transition-colors"
                  >
                    📦 حفظ كحزمة
                  </button>
                )}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {activeJourney.steps.map((step, index) => {
                const isCompleted = progress.completedSteps.includes(index);
                const isCurrent = index === progress.currentStep && !isCompleted;
                
                return (
                  <div
                    key={step.nodeId}
                    className={`
                      p-3 rounded-xl border transition-all
                      ${isCompleted 
                        ? 'bg-green-500/20 border-green-500/40' 
                        : isCurrent
                          ? 'bg-cyan-500/20 border-cyan-500/40'
                          : 'bg-white/5 border-cyan-500/20 hover:border-cyan-500/40'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Number / Checkbox */}
                      <button
                        onClick={() => toggleStepComplete(index)}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                          ${isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white/10 text-gray-400 hover:bg-cyan-500/30'
                          }
                        `}
                      >
                        {isCompleted ? '✓' : step.stepNumber}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => {
                            const node = getNodeById(step.nodeId);
                            if (node && onStepSelect) {
                              onStepSelect(node, index);
                            }
                          }}
                          className="text-left w-full"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{step.node.icon}</span>
                            <h4 className={`font-medium truncate ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                              {step.node.title_ar}
                            </h4>
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {step.node.title}
                          </p>
                        </button>

                        {/* Step Reason */}
                        <div className="mt-2 text-xs text-gray-500">
                          {step.isKeyStep && (
                            <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded mr-2">
                              خطوة أساسية
                            </span>
                          )}
                          <span>{step.reason_ar}</span>
                        </div>

                        {/* Time Estimate */}
                        <div className="mt-1 text-xs text-gray-600">
                          ~{step.estimatedTime} دقائق
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {progress.completedSteps.length === activeJourney.steps.length && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl border border-green-500/30 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h4 className="text-white font-bold">أحسنت! أكملت الرحلة</h4>
                <p className="text-gray-400 text-sm">Congratulations! Journey completed</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
