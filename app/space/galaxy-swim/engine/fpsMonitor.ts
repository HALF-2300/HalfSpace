import { PerformanceMetrics } from './types';

export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private currentFPS: number = 60;
  private lowFPSStartTime: number | null = null;
  private lowFPSThreshold: number = 30;
  private lowFPSDuration: number = 5000; // 5 seconds
  
  private callbacks: {
    onLowFPSDetected?: () => void;
    onFPSUpdate?: (fps: number) => void;
  } = {};

  constructor(options?: {
    lowFPSThreshold?: number;
    lowFPSDuration?: number;
  }) {
    if (options?.lowFPSThreshold) {
      this.lowFPSThreshold = options.lowFPSThreshold;
    }
    if (options?.lowFPSDuration) {
      this.lowFPSDuration = options.lowFPSDuration;
    }
  }

  update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    this.frameCount++;
    this.frames.push(1000 / delta);
    
    // Keep only last 60 frames for average
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    // Calculate average FPS
    if (this.frames.length > 0) {
      this.currentFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    }
    
    // Check for sustained low FPS
    if (this.currentFPS < this.lowFPSThreshold) {
      if (this.lowFPSStartTime === null) {
        this.lowFPSStartTime = now;
      } else if (now - this.lowFPSStartTime >= this.lowFPSDuration) {
        // Sustained low FPS detected
        if (this.callbacks.onLowFPSDetected) {
          this.callbacks.onLowFPSDetected();
        }
        // Reset to avoid repeated triggers
        this.lowFPSStartTime = null;
      }
    } else {
      // FPS recovered
      this.lowFPSStartTime = null;
    }
    
    // Callback for FPS updates
    if (this.callbacks.onFPSUpdate && this.frameCount % 10 === 0) {
      this.callbacks.onFPSUpdate(this.currentFPS);
    }
    
    this.lastTime = now;
  }

  getFPS(): number {
    return Math.round(this.currentFPS);
  }

  getMetrics(): PerformanceMetrics {
    return {
      fps: this.getFPS(),
      frameTime: this.frames.length > 0 ? 1000 / this.currentFPS : 0,
      particleCount: 0, // Will be set externally
      drawCalls: 0, // Will be set externally
    };
  }

  onLowFPSDetected(callback: () => void): void {
    this.callbacks.onLowFPSDetected = callback;
  }

  onFPSUpdate(callback: (fps: number) => void): void {
    this.callbacks.onFPSUpdate = callback;
  }

  reset(): void {
    this.frames = [];
    this.frameCount = 0;
    this.lowFPSStartTime = null;
  }
}
