import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserGalaxy {
  id: string;
  name: string;
  emotion: string;
  color: string;
  position: [number, number, number];
  createdAt: number;
  visitorId: string;
}

export interface Glitch {
  id: string;
  type: 'cosmic_whisper' | 'dimension_flip' | 'star_message' | 'transmission' | 'hint';
  message: string;
  intensity: number;
  timestamp: number;
}

export interface VisitorConnection {
  id: string;
  visitorId: string;
  connectedAt: number;
  cursorPosition: [number, number];
  lastPulse: number;
}

export interface DreamEntry {
  id: string;
  dream: string;
  coordinates: string;
  linkedSector: string;
  timestamp: number;
}

interface HalfspaceState {
  visitorId: string | null;
  userGalaxies: UserGalaxy[];
  glitches: Glitch[];
  connections: VisitorConnection[];
  dreams: DreamEntry[];
  visitCount: number;
  lastVisit: number | null;
  quantumTime: number; // -1 (past) to 1 (future)
  visitedNodes: string[]; // Track which knowledge nodes have been visited
  journeyPath: string[]; // Track navigation history
  
  // Actions
  setVisitorId: (id: string) => void;
  addGalaxy: (galaxy: UserGalaxy) => void;
  addGlitch: (glitch: Omit<Glitch, 'id' | 'timestamp'>) => void;
  clearOldGlitches: () => void;
  addConnection: (connection: VisitorConnection) => void;
  updateConnection: (id: string, data: Partial<VisitorConnection>) => void;
  removeConnection: (id: string) => void;
  addDream: (dream: DreamEntry) => void;
  setQuantumTime: (time: number) => void;
  incrementVisit: () => void;
  addVisitedNode: (nodeId: string) => void;
  addToJourney: (step: string) => void;
  clearJourney: () => void;
}

export const useHalfspaceStore = create<HalfspaceState>()(
  persist(
    (set, get) => ({
      visitorId: null,
      userGalaxies: [],
      glitches: [],
      connections: [],
      dreams: [],
      visitCount: 0,
      lastVisit: null,
      quantumTime: 0,
      visitedNodes: [],
      journeyPath: [],

      setVisitorId: (id) => set({ visitorId: id }),

      addGalaxy: (galaxy) => set((state) => ({
        userGalaxies: [...state.userGalaxies, galaxy]
      })),

      addGlitch: (glitchData) => set((state) => ({
        glitches: [
          ...state.glitches,
          {
            ...glitchData,
            id: `glitch-${Date.now()}-${Math.random()}`,
            timestamp: Date.now()
          }
        ]
      })),

      clearOldGlitches: () => set((state) => ({
        glitches: state.glitches.filter(g => Date.now() - g.timestamp < 10000)
      })),

      addConnection: (connection) => set((state) => ({
        connections: [...state.connections, connection]
      })),

      updateConnection: (id, data) => set((state) => ({
        connections: state.connections.map(c => 
          c.id === id ? { ...c, ...data } : c
        )
      })),

      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(c => c.id !== id)
      })),

      addDream: (dream) => set((state) => ({
        dreams: [...state.dreams, dream]
      })),

      setQuantumTime: (time) => set({ quantumTime: time }),

      incrementVisit: () => set((state) => ({
        visitCount: state.visitCount + 1,
        lastVisit: Date.now()
      })),

      addVisitedNode: (nodeId) => set((state) => ({
        visitedNodes: state.visitedNodes.includes(nodeId) 
          ? state.visitedNodes 
          : [...state.visitedNodes, nodeId]
      })),

      addToJourney: (step) => set((state) => ({
        journeyPath: [...state.journeyPath, step]
      })),

      clearJourney: () => set({ journeyPath: [] })
    }),
    {
      name: 'halfspace-storage',
      partialize: (state) => ({
        visitorId: state.visitorId,
        userGalaxies: state.userGalaxies,
        dreams: state.dreams,
        visitCount: state.visitCount,
        lastVisit: state.lastVisit,
        visitedNodes: state.visitedNodes,
        journeyPath: state.journeyPath
      })
    }
  )
);
