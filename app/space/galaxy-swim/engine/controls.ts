import { Vector3 } from 'three';
import { ControlMode, CameraState, TeleportPoint } from './types';

export class SwimControls {
  private mode: ControlMode = 'auto-cruise';
  private position: Vector3 = new Vector3(0, 100, 500);
  private velocity: Vector3 = new Vector3();
  private target: Vector3 = new Vector3(0, 0, 0);
  private speed: number = 10;
  private maxSpeed: number = 50;
  
  private keys: Set<string> = new Set();
  private mouseDown: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  
  private autoCruiseTime: number = 0;
  private autoCruisePath: 'orbit' | 'spiral' | 'flythrough' = 'orbit';

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('mousedown', () => {
      this.mouseDown = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouseDown && this.mode === 'free-swim') {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        // Rotate camera based on mouse movement
        this.velocity.x += deltaX * 0.1;
        this.velocity.y -= deltaY * 0.1;
      }
      
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
  }

  setMode(mode: ControlMode): void {
    this.mode = mode;
    if (mode === 'auto-cruise') {
      this.autoCruiseTime = 0;
    }
  }

  getMode(): ControlMode {
    return this.mode;
  }

  update(deltaTime: number): CameraState {
    if (this.mode === 'auto-cruise') {
      this.updateAutoCruise(deltaTime);
    } else {
      this.updateFreeSwim(deltaTime);
    }

    return {
      position: [this.position.x, this.position.y, this.position.z],
      target: [this.target.x, this.target.y, this.target.z],
      fov: 75,
    };
  }

  private updateAutoCruise(deltaTime: number): void {
    this.autoCruiseTime += deltaTime * 0.0005;
    
    const radius = 600;
    const height = Math.sin(this.autoCruiseTime * 0.5) * 200;
    
    this.position.x = Math.cos(this.autoCruiseTime) * radius;
    this.position.y = height + 100;
    this.position.z = Math.sin(this.autoCruiseTime) * radius;
    
    // Always look at galaxy center
    this.target.set(0, 0, 0);
  }

  private updateFreeSwim(deltaTime: number): void {
    const moveSpeed = this.speed * deltaTime * 0.1;
    
    // WASD movement
    if (this.keys.has('w')) {
      this.velocity.z -= moveSpeed;
    }
    if (this.keys.has('s')) {
      this.velocity.z += moveSpeed;
    }
    if (this.keys.has('a')) {
      this.velocity.x -= moveSpeed;
    }
    if (this.keys.has('d')) {
      this.velocity.x += moveSpeed;
    }
    if (this.keys.has('q')) {
      this.velocity.y -= moveSpeed;
    }
    if (this.keys.has('e')) {
      this.velocity.y += moveSpeed;
    }
    
    // Speed control
    if (this.keys.has('shift')) {
      this.speed = Math.min(this.speed + 0.5, this.maxSpeed);
    } else {
      this.speed = Math.max(this.speed - 0.5, 10);
    }
    
    // Apply damping
    this.velocity.multiplyScalar(0.95);
    
    // Update position
    this.position.add(this.velocity);
    
    // Update look target (ahead of position)
    this.target.copy(this.position).add(new Vector3(0, 0, -100));
  }

  recenter(): void {
    this.position.set(0, 100, 500);
    this.velocity.set(0, 0, 0);
    this.target.set(0, 0, 0);
  }

  teleportTo(point: TeleportPoint): void {
    this.position.set(...point.position);
    this.target.set(...point.lookAt);
    this.velocity.set(0, 0, 0);
  }

  getPosition(): Vector3 {
    return this.position.clone();
  }

  getSpeed(): number {
    return this.speed;
  }

  cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', () => {});
      window.removeEventListener('keyup', () => {});
      window.removeEventListener('mousedown', () => {});
      window.removeEventListener('mouseup', () => {});
      window.removeEventListener('mousemove', () => {});
    }
  }

  static getTeleportPoints(): TeleportPoint[] {
    return [
      {
        id: 'core',
        name: 'Galactic Core',
        position: [0, 50, 200],
        lookAt: [0, 0, 0],
      },
      {
        id: 'arm',
        name: 'Spiral Arm',
        position: [400, 100, 300],
        lookAt: [0, 0, 0],
      },
      {
        id: 'nebula',
        name: 'Nebula Region',
        position: [-300, 150, 400],
        lookAt: [-300, 50, 400],
      },
      {
        id: 'deep',
        name: 'Deep Space',
        position: [600, 200, -500],
        lookAt: [0, 0, 0],
      },
    ];
  }
}
