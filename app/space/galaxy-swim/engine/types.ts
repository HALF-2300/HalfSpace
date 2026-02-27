// Types for Galaxy Swim Engine
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export type ControlMode = 'auto-cruise' | 'free-swim';

export interface QualitySettings {
  particleCount: number;
  nebulaResolution: number;
  enableBloom: boolean;
  enableFog: boolean;
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  renderScale: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface TeleportPoint {
  id: string;
  name: string;
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  particleCount: number;
  drawCalls: number;
}

export interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  type: string;
  card: {
    title: string;
    description: string;
    fact: string;
    factLabel: string;
  };
  learnMore: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
  };
}

export interface ScienceOverlay {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyFact: {
    value: string;
    unit: string;
  };
  triggerConditions: {
    zones: string[];
    minProximity: number;
  };
}
