/**
 * العقل الكوني - Artifacts System
 * نظام تجميع الحزم والمشاركة
 */

import { KnowledgeNode, getNodeById } from './knowledge-graph';
import { Journey, JourneyProgress } from './journey-engine';

// عنصر في الحزمة
export interface ArtifactItem {
  id: string;
  nodeId: string;
  addedAt: string;
  note?: string;
  order: number;
}

// حزمة الرحلة
export interface Artifact {
  id: string;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  items: ArtifactItem[];
  createdAt: string;
  updatedAt: string;
  icon: string;
  isPublic: boolean;
  journeyId?: string; // إذا كانت مرتبطة برحلة
}

// بيانات المشاركة
export interface SharedArtifact {
  artifact: Artifact;
  sharedAt: string;
  shareCode: string;
  expiresAt?: string;
}

/**
 * إنشاء حزمة جديدة
 */
export function createArtifact(
  title: string,
  title_ar: string,
  icon: string = '📦'
): Artifact {
  return {
    id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    title_ar,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon,
    isPublic: false
  };
}

/**
 * إضافة عنصر للحزمة
 */
export function addItemToArtifact(
  artifact: Artifact,
  nodeId: string,
  note?: string
): Artifact {
  // التحقق من وجود العقدة
  const node = getNodeById(nodeId);
  if (!node) {
    console.warn(`[Artifacts] Node ${nodeId} not found`);
    return artifact;
  }

  // التحقق من عدم التكرار
  if (artifact.items.some(item => item.nodeId === nodeId)) {
    console.warn(`[Artifacts] Node ${nodeId} already in artifact`);
    return artifact;
  }

  const newItem: ArtifactItem = {
    id: `item-${Date.now()}`,
    nodeId,
    addedAt: new Date().toISOString(),
    note,
    order: artifact.items.length
  };

  return {
    ...artifact,
    items: [...artifact.items, newItem],
    updatedAt: new Date().toISOString()
  };
}

/**
 * إزالة عنصر من الحزمة
 */
export function removeItemFromArtifact(artifact: Artifact, itemId: string): Artifact {
  return {
    ...artifact,
    items: artifact.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index })),
    updatedAt: new Date().toISOString()
  };
}

/**
 * إعادة ترتيب عناصر الحزمة
 */
export function reorderArtifactItems(artifact: Artifact, fromIndex: number, toIndex: number): Artifact {
  const items = [...artifact.items];
  const [removed] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, removed);
  
  return {
    ...artifact,
    items: items.map((item, index) => ({ ...item, order: index })),
    updatedAt: new Date().toISOString()
  };
}

/**
 * إنشاء حزمة من رحلة
 */
export function createArtifactFromJourney(journey: Journey, progress?: JourneyProgress): Artifact {
  const artifact = createArtifact(
    journey.goalInfo.title,
    journey.goalInfo.title_ar,
    journey.goalInfo.icon
  );

  artifact.journeyId = journey.id;
  artifact.description = `Journey through ${journey.steps.length} steps`;
  artifact.description_ar = `رحلة من ${journey.steps.length} خطوات`;

  // إضافة الخطوات المكتملة أو جميع الخطوات
  const stepsToAdd = progress 
    ? journey.steps.filter((_, index) => progress.completedSteps.includes(index))
    : journey.steps;

  for (const step of stepsToAdd) {
    artifact.items.push({
      id: `item-${step.stepNumber}`,
      nodeId: step.nodeId,
      addedAt: new Date().toISOString(),
      note: step.reason_ar,
      order: step.stepNumber - 1
    });
  }

  return artifact;
}

/**
 * تصدير حزمة كـ JSON
 */
export function exportArtifact(artifact: Artifact): string {
  const exportData = {
    version: '1.0',
    type: 'cosmic-artifact',
    artifact: {
      ...artifact,
      exportedAt: new Date().toISOString()
    }
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * استيراد حزمة من JSON
 */
export function importArtifact(jsonString: string): Artifact | null {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.type !== 'cosmic-artifact' || !data.artifact) {
      console.warn('[Artifacts] Invalid artifact format');
      return null;
    }

    // التحقق من صحة العناصر
    const validItems = data.artifact.items.filter((item: ArtifactItem) => {
      const node = getNodeById(item.nodeId);
      if (!node) {
        console.warn(`[Artifacts] Skipping invalid node: ${item.nodeId}`);
        return false;
      }
      return true;
    });

    return {
      ...data.artifact,
      id: `artifact-imported-${Date.now()}`,
      items: validItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (e) {
    console.error('[Artifacts] Failed to import:', e);
    return null;
  }
}

/**
 * توليد رمز مشاركة
 */
function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * إنشاء رابط مشاركة للحزمة
 */
export function createShareLink(artifact: Artifact): string {
  // تشفير الحزمة في Base64 URL-safe
  const data = exportArtifact(artifact);
  const encoded = btoa(encodeURIComponent(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // إنشاء رابط مع الرمز المشفر
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/space/core?artifact=${encoded}`;
}

/**
 * فك تشفير رابط المشاركة
 */
export function decodeShareLink(encodedData: string): Artifact | null {
  try {
    // فك الترميز Base64 URL-safe
    const base64 = encodedData
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(encodedData.length + (4 - encodedData.length % 4) % 4, '=');
    
    const jsonString = decodeURIComponent(atob(base64));
    return importArtifact(jsonString);
  } catch (e) {
    console.error('[Artifacts] Failed to decode share link:', e);
    return null;
  }
}

/**
 * حفظ الحزمة في localStorage
 */
export function saveArtifact(artifact: Artifact): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `cosmic-artifact-${artifact.id}`;
    localStorage.setItem(key, JSON.stringify(artifact));
    
    // تحديث قائمة الحزم
    const artifactIds = getSavedArtifactIds();
    if (!artifactIds.includes(artifact.id)) {
      artifactIds.push(artifact.id);
      localStorage.setItem('cosmic-artifacts', JSON.stringify(artifactIds));
    }
  } catch (e) {
    console.warn('[Artifacts] Failed to save:', e);
  }
}

/**
 * تحميل حزمة من localStorage
 */
export function loadArtifact(artifactId: string): Artifact | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `cosmic-artifact-${artifactId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * الحصول على معرفات الحزم المحفوظة
 */
export function getSavedArtifactIds(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('cosmic-artifacts');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * تحميل جميع الحزم المحفوظة
 */
export function loadAllArtifacts(): Artifact[] {
  const ids = getSavedArtifactIds();
  const artifacts: Artifact[] = [];
  
  for (const id of ids) {
    const artifact = loadArtifact(id);
    if (artifact) {
      artifacts.push(artifact);
    }
  }
  
  return artifacts.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * حذف حزمة
 */
export function deleteArtifact(artifactId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`cosmic-artifact-${artifactId}`);
    const artifactIds = getSavedArtifactIds().filter(id => id !== artifactId);
    localStorage.setItem('cosmic-artifacts', JSON.stringify(artifactIds));
  } catch (e) {
    console.warn('[Artifacts] Failed to delete:', e);
  }
}

/**
 * الحصول على عقد الحزمة الكاملة
 */
export function getArtifactNodes(artifact: Artifact): Array<{ item: ArtifactItem; node: KnowledgeNode | null }> {
  return artifact.items.map(item => ({
    item,
    node: getNodeById(item.nodeId) ?? null
  }));
}

/**
 * حساب إحصائيات الحزمة
 */
export function getArtifactStats(artifact: Artifact): {
  totalItems: number;
  validItems: number;
  invalidItems: number;
  nodeTypes: Record<string, number>;
  tags: string[];
} {
  const nodes = getArtifactNodes(artifact);
  const validNodes = nodes.filter(n => n.node !== null);
  
  const nodeTypes: Record<string, number> = {};
  const allTags = new Set<string>();
  
  for (const { node } of validNodes) {
    if (node) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
      node.tags.forEach(tag => allTags.add(tag));
    }
  }
  
  return {
    totalItems: artifact.items.length,
    validItems: validNodes.length,
    invalidItems: nodes.length - validNodes.length,
    nodeTypes,
    tags: Array.from(allTags)
  };
}
