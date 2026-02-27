/**
 * العقل الكوني - Journey Engine
 * محرك بناء الرحلات التعليمية الشخصية
 */

import { 
  KnowledgeNode, 
  getNodeById, 
  getRelatedNodes, 
  cosmicKnowledgeGraph,
  findPath 
} from './knowledge-graph';

// أهداف الرحلة المتاحة
export type JourneyGoal = 
  | 'beginnings'      // فهم البدايات والانفجار العظيم
  | 'stars'           // فهم النجوم ودورة حياتها
  | 'black-holes'     // فهم الثقوب السوداء
  | 'galaxies'        // فهم المجرات والبنية الكونية
  | 'solar-system'    // فهم نظامنا الشمسي
  | 'exoplanets'      // البحث عن عوالم أخرى
  | 'everything';     // رحلة شاملة في الكون

// معلومات هدف الرحلة
export interface JourneyGoalInfo {
  id: JourneyGoal;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  icon: string;
  startNodes: string[]; // العقد الأولية للرحلة
  keyNodes: string[];   // العقد الأساسية التي يجب تضمينها
  estimatedSteps: number;
}

// خطوة في الرحلة
export interface JourneyStep {
  stepNumber: number;
  nodeId: string;
  node: KnowledgeNode;
  reason: string;           // سبب اختيار هذه الخطوة
  reason_ar: string;
  fromPrevious?: string;    // العلاقة مع الخطوة السابقة
  estimatedTime: number;    // الوقت المقدر بالدقائق
  isKeyStep: boolean;       // هل هي خطوة محورية
}

// الرحلة الكاملة
export interface Journey {
  id: string;
  goal: JourneyGoal;
  goalInfo: JourneyGoalInfo;
  steps: JourneyStep[];
  createdAt: string;
  totalEstimatedTime: number;
}

// حالة تقدم المستخدم
export interface JourneyProgress {
  journeyId: string;
  completedSteps: number[];
  currentStep: number;
  startedAt: string;
  lastAccessedAt: string;
  notes: Record<number, string>; // ملاحظات المستخدم لكل خطوة
}

/**
 * تعريفات أهداف الرحلات
 */
export const journeyGoals: Record<JourneyGoal, JourneyGoalInfo> = {
  beginnings: {
    id: 'beginnings',
    title: 'Understanding Cosmic Origins',
    title_ar: 'فهم البدايات الكونية',
    description: 'Journey from the Big Bang to the first structures in the universe',
    description_ar: 'رحلة من الانفجار العظيم إلى أول البنى في الكون',
    icon: '💥',
    startNodes: ['big-bang'],
    keyNodes: ['big-bang', 'cosmic-inflation', 'cmb', 'dark-matter', 'dark-energy', 'star-formation', 'galaxy'],
    estimatedSteps: 14
  },
  stars: {
    id: 'stars',
    title: 'The Life of Stars',
    title_ar: 'حياة النجوم',
    description: 'From stellar nurseries to spectacular deaths',
    description_ar: 'من حضانات النجوم إلى نهاياتها المذهلة',
    icon: '⭐',
    startNodes: ['nebula', 'star-formation'],
    keyNodes: ['nebula', 'star-formation', 'main-sequence', 'sun', 'red-giant', 'supernova', 'white-dwarf', 'neutron-star', 'pulsar'],
    estimatedSteps: 14
  },
  'black-holes': {
    id: 'black-holes',
    title: 'Black Hole Mysteries',
    title_ar: 'أسرار الثقوب السوداء',
    description: 'Explore the most extreme objects in the cosmos',
    description_ar: 'استكشف أكثر الأجسام تطرفاً في الكون',
    icon: '🕳️',
    startNodes: ['gravity', 'supernova'],
    keyNodes: ['gravity', 'spacetime', 'supernova', 'black-hole', 'event-horizon', 'singularity', 'hawking-radiation', 'supermassive-bh', 'quasar', 'eht'],
    estimatedSteps: 14
  },
  galaxies: {
    id: 'galaxies',
    title: 'Galactic Structures',
    title_ar: 'البنى المجرية',
    description: 'From individual galaxies to the cosmic web',
    description_ar: 'من المجرات الفردية إلى الشبكة الكونية',
    icon: '🌌',
    startNodes: ['galaxy'],
    keyNodes: ['galaxy', 'milky-way', 'spiral-galaxy', 'elliptical-galaxy', 'supermassive-bh', 'galaxy-cluster', 'cosmic-web', 'dark-matter'],
    estimatedSteps: 14
  },
  'solar-system': {
    id: 'solar-system',
    title: 'Our Cosmic Home',
    title_ar: 'بيتنا الكوني',
    description: 'Explore the Sun, planets, and everything in between',
    description_ar: 'استكشف الشمس والكواكب وكل ما بينها',
    icon: '🪐',
    startNodes: ['solar-system', 'sun'],
    keyNodes: ['solar-system', 'sun', 'earth', 'mars', 'jupiter', 'saturn', 'milky-way', 'voyager', 'curiosity'],
    estimatedSteps: 14
  },
  exoplanets: {
    id: 'exoplanets',
    title: 'Worlds Beyond',
    title_ar: 'عوالم ما وراء',
    description: 'The search for other Earths and alien worlds',
    description_ar: 'البحث عن أرضٍ أخرى وعوالم غريبة',
    icon: '🌍',
    startNodes: ['exoplanet'],
    keyNodes: ['exoplanet', 'habitable-zone', 'transit-method', 'spectroscopy', 'jwst', 'solar-system', 'earth', 'star-formation'],
    estimatedSteps: 12
  },
  everything: {
    id: 'everything',
    title: 'The Grand Tour',
    title_ar: 'الجولة الكبرى',
    description: 'A comprehensive journey through all of cosmic knowledge',
    description_ar: 'رحلة شاملة عبر كل المعرفة الكونية',
    icon: '🚀',
    startNodes: ['big-bang'],
    keyNodes: ['big-bang', 'cmb', 'star-formation', 'main-sequence', 'supernova', 'black-hole', 'galaxy', 'milky-way', 'solar-system', 'earth', 'exoplanet', 'jwst'],
    estimatedSteps: 20
  }
};

/**
 * توليد رحلة بناءً على الهدف المحدد
 */
export function generateJourney(goal: JourneyGoal): Journey {
  const goalInfo = journeyGoals[goal];
  const steps: JourneyStep[] = [];
  const visited = new Set<string>();
  
  // البدء بالعقد الأولية
  const queue: string[] = [...goalInfo.startNodes];
  
  // إضافة العقدة الأولى
  const firstNodeId = queue.shift()!;
  const firstNode = getNodeById(firstNodeId);
  if (firstNode) {
    steps.push({
      stepNumber: 1,
      nodeId: firstNodeId,
      node: firstNode,
      reason: 'This is where our journey begins',
      reason_ar: 'هذا هو المكان الذي تبدأ فيه رحلتنا',
      estimatedTime: estimateReadTime(firstNode),
      isKeyStep: true
    });
    visited.add(firstNodeId);
  }
  
  // بناء الرحلة
  while (steps.length < goalInfo.estimatedSteps && (queue.length > 0 || visited.size < goalInfo.keyNodes.length)) {
    // أولوية للعقد الأساسية التي لم تُزر بعد
    const unvisitedKeyNode = goalInfo.keyNodes.find(id => !visited.has(id));
    
    let nextNodeId: string | undefined;
    let connection: string | undefined;
    
    if (unvisitedKeyNode && steps.length > 0) {
      // محاولة إيجاد مسار للعقدة الأساسية
      const lastStep = steps[steps.length - 1];
      const path = findPath(lastStep.nodeId, unvisitedKeyNode);
      
      if (path && path.length > 1) {
        // أخذ الخطوة التالية في المسار
        nextNodeId = path[1];
        const related = getRelatedNodes(lastStep.nodeId);
        const rel = related.find(r => r.node.id === nextNodeId);
        if (rel) {
          connection = rel.edge.reason_ar || getEdgeReason(rel.edge.type);
        }
      } else {
        nextNodeId = unvisitedKeyNode;
        connection = 'خطوة أساسية في الرحلة';
      }
    } else if (queue.length > 0) {
      nextNodeId = queue.shift();
    } else {
      // البحث عن عقد متصلة بآخر خطوة
      const lastStep = steps[steps.length - 1];
      const related = getRelatedNodes(lastStep.nodeId);
      const unvisited = related.filter(r => !visited.has(r.node.id));
      
      if (unvisited.length > 0) {
        // اختيار الأكثر أهمية
        unvisited.sort((a, b) => (b.node.importance || 3) - (a.node.importance || 3));
        nextNodeId = unvisited[0].node.id;
        connection = unvisited[0].edge.reason_ar || getEdgeReason(unvisited[0].edge.type);
      }
    }
    
    if (nextNodeId && !visited.has(nextNodeId)) {
      const node = getNodeById(nextNodeId);
      if (node) {
        steps.push({
          stepNumber: steps.length + 1,
          nodeId: nextNodeId,
          node,
          reason: getStepReason(node, steps.length + 1, goalInfo),
          reason_ar: getStepReasonAr(node, steps.length + 1, goalInfo, connection),
          fromPrevious: connection,
          estimatedTime: estimateReadTime(node),
          isKeyStep: goalInfo.keyNodes.includes(nextNodeId)
        });
        visited.add(nextNodeId);
        
        // إضافة العقد المتصلة للقائمة
        const related = getRelatedNodes(nextNodeId);
        for (const r of related) {
          if (!visited.has(r.node.id) && !queue.includes(r.node.id)) {
            queue.push(r.node.id);
          }
        }
      }
    }
    
    // حماية من الحلقات اللانهائية
    if (steps.length >= goalInfo.estimatedSteps + 5) break;
  }
  
  // حساب الوقت الإجمالي
  const totalTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);
  
  return {
    id: `journey-${goal}-${Date.now()}`,
    goal,
    goalInfo,
    steps,
    createdAt: new Date().toISOString(),
    totalEstimatedTime: totalTime
  };
}

/**
 * تقدير وقت القراءة لعقدة
 */
function estimateReadTime(node: KnowledgeNode): number {
  const baseTime = 3; // 3 دقائق أساسية
  const difficultyBonus = (node.difficulty || 3) - 2; // 0-3 دقائق إضافية
  return baseTime + difficultyBonus;
}

/**
 * الحصول على سبب الخطوة بالإنجليزية
 */
function getStepReason(node: KnowledgeNode, stepNum: number, goalInfo: JourneyGoalInfo): string {
  if (stepNum === 1) return 'This is the foundation of our journey';
  if (goalInfo.keyNodes.includes(node.id)) return `Essential concept for understanding ${goalInfo.title.toLowerCase()}`;
  return `Connects to our understanding of ${node.tags[0] || 'the cosmos'}`;
}

/**
 * الحصول على سبب الخطوة بالعربية
 */
function getStepReasonAr(
  node: KnowledgeNode, 
  stepNum: number, 
  goalInfo: JourneyGoalInfo,
  connection?: string
): string {
  if (stepNum === 1) return 'هذا أساس رحلتنا';
  if (goalInfo.keyNodes.includes(node.id)) return `مفهوم أساسي لفهم ${goalInfo.title_ar}`;
  if (connection) return connection;
  return `يرتبط بفهمنا للكون`;
}

/**
 * الحصول على وصف نوع العلاقة
 */
function getEdgeReason(type: string): string {
  const reasons: Record<string, string> = {
    depends_on: 'يعتمد على هذا المفهوم',
    explains: 'يشرح هذا المفهوم',
    observed_by: 'تم رصده بواسطة',
    part_of: 'جزء من',
    leads_to: 'يؤدي إلى',
    contrast_with: 'للمقارنة',
    evolved_from: 'تطور من',
    contains: 'يحتوي على'
  };
  return reasons[type] || 'مرتبط بـ';
}

/**
 * حفظ تقدم الرحلة في localStorage
 */
export function saveJourneyProgress(progress: JourneyProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `cosmic-journey-${progress.journeyId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    
    // حفظ قائمة الرحلات النشطة
    const activeJourneys = getActiveJourneyIds();
    if (!activeJourneys.includes(progress.journeyId)) {
      activeJourneys.push(progress.journeyId);
      localStorage.setItem('cosmic-active-journeys', JSON.stringify(activeJourneys));
    }
  } catch (e) {
    console.warn('[Journey] Failed to save progress:', e);
  }
}

/**
 * تحميل تقدم الرحلة من localStorage
 */
export function loadJourneyProgress(journeyId: string): JourneyProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `cosmic-journey-${journeyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('[Journey] Failed to load progress:', e);
    return null;
  }
}

/**
 * الحصول على معرفات الرحلات النشطة
 */
export function getActiveJourneyIds(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('cosmic-active-journeys');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * حذف رحلة
 */
export function deleteJourney(journeyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`cosmic-journey-${journeyId}`);
    const activeJourneys = getActiveJourneyIds().filter(id => id !== journeyId);
    localStorage.setItem('cosmic-active-journeys', JSON.stringify(activeJourneys));
  } catch (e) {
    console.warn('[Journey] Failed to delete journey:', e);
  }
}

/**
 * إنشاء تقدم جديد لرحلة
 */
export function createJourneyProgress(journey: Journey): JourneyProgress {
  return {
    journeyId: journey.id,
    completedSteps: [],
    currentStep: 0,
    startedAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    notes: {}
  };
}

/**
 * تحديث تقدم الرحلة
 */
export function updateJourneyProgress(
  progress: JourneyProgress,
  stepIndex: number,
  completed: boolean
): JourneyProgress {
  const updated = { ...progress };
  
  if (completed && !updated.completedSteps.includes(stepIndex)) {
    updated.completedSteps = [...updated.completedSteps, stepIndex];
  } else if (!completed) {
    updated.completedSteps = updated.completedSteps.filter(s => s !== stepIndex);
  }
  
  updated.currentStep = Math.max(updated.currentStep, stepIndex);
  updated.lastAccessedAt = new Date().toISOString();
  
  return updated;
}

/**
 * حساب نسبة إكمال الرحلة
 */
export function calculateJourneyCompletion(progress: JourneyProgress, totalSteps: number): number {
  if (totalSteps === 0) return 0;
  return Math.round((progress.completedSteps.length / totalSteps) * 100);
}
