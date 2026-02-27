import { QualityPreset, QualitySettings } from './types';

export class QualityManager {
  private currentPreset: QualityPreset = 'medium';
  private settings: QualitySettings;
  
  constructor(initialPreset: QualityPreset = 'medium') {
    this.currentPreset = initialPreset;
    this.settings = this.getSettingsForPreset(initialPreset);
  }

  getSettingsForPreset(preset: QualityPreset): QualitySettings {
    const presets: Record<QualityPreset, QualitySettings> = {
      low: {
        particleCount: 50000,
        nebulaResolution: 512,
        enableBloom: false,
        enableFog: true,
        shadowQuality: 'off',
        renderScale: 0.7,
      },
      medium: {
        particleCount: 150000,
        nebulaResolution: 1024,
        enableBloom: true,
        enableFog: true,
        shadowQuality: 'low',
        renderScale: 0.85,
      },
      high: {
        particleCount: 300000,
        nebulaResolution: 2048,
        enableBloom: true,
        enableFog: true,
        shadowQuality: 'medium',
        renderScale: 1.0,
      },
      ultra: {
        particleCount: 500000,
        nebulaResolution: 4096,
        enableBloom: true,
        enableFog: true,
        shadowQuality: 'high',
        renderScale: 1.0,
      },
    };

    return presets[preset];
  }

  setPreset(preset: QualityPreset): QualitySettings {
    this.currentPreset = preset;
    this.settings = this.getSettingsForPreset(preset);
    return this.settings;
  }

  downgradeQuality(): QualityPreset | null {
    const order: QualityPreset[] = ['ultra', 'high', 'medium', 'low'];
    const currentIndex = order.indexOf(this.currentPreset);
    
    if (currentIndex < order.length - 1) {
      const newPreset = order[currentIndex + 1];
      this.setPreset(newPreset);
      return newPreset;
    }
    
    return null;
  }

  getCurrentPreset(): QualityPreset {
    return this.currentPreset;
  }

  getCurrentSettings(): QualitySettings {
    return this.settings;
  }

  // Auto-detect best preset based on device
  static detectRecommendedPreset(): QualityPreset {
    if (typeof window === 'undefined') return 'medium';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return 'low';

    // Simple heuristic based on hardware concurrency and memory
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;

    if (cores >= 8 && memory >= 8) return 'ultra';
    if (cores >= 6 && memory >= 6) return 'high';
    if (cores >= 4 && memory >= 4) return 'medium';
    return 'low';
  }
}
