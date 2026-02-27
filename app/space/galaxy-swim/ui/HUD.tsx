'use client';

import React from 'react';
import { ControlMode, QualityPreset } from '../engine/types';

interface HUDProps {
  fps: number;
  speed: number;
  mode: ControlMode;
  quality: QualityPreset;
  coordinates: [number, number, number];
  onModeChange: (mode: ControlMode) => void;
  onQualityChange: (quality: QualityPreset) => void;
  onRecenter: () => void;
  onTeleport: () => void;
  onToggleScience: () => void;
  scienceOverlayActive: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  fps,
  speed,
  mode,
  quality,
  coordinates,
  onModeChange,
  onQualityChange,
  onRecenter,
  onTeleport,
  onToggleScience,
  scienceOverlayActive,
}) => {
  return (
    <div className="galaxy-swim-hud">
      {/* Top Left - Info */}
      <div className="hud-panel hud-top-left">
        <div className="hud-stat">
          <span className="hud-label">FPS</span>
          <span className={`hud-value ${fps < 30 ? 'hud-warning' : ''}`}>{fps}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Speed</span>
          <span className="hud-value">{speed.toFixed(1)} u/s</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Mode</span>
          <span className="hud-value">
            {mode === 'auto-cruise' ? 'Auto Cruise' : 'Free Swim'}
          </span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Quality</span>
          <span className="hud-value">{quality.toUpperCase()}</span>
        </div>
      </div>

      {/* Top Right - Coordinates */}
      <div className="hud-panel hud-top-right">
        <div className="hud-stat">
          <span className="hud-label">Coordinates</span>
          <span className="hud-value hud-coords">
            X: {coordinates[0].toFixed(0)} <br />
            Y: {coordinates[1].toFixed(0)} <br />
            Z: {coordinates[2].toFixed(0)}
          </span>
        </div>
      </div>

      {/* Bottom Left - Mini Map */}
      <div className="hud-panel hud-bottom-left">
        <div className="mini-map">
          <div className="mini-map-label">Galaxy Map</div>
          <svg width="120" height="120" viewBox="-60 -60 120 120">
            {/* Galaxy center */}
            <circle cx="0" cy="0" r="8" fill="#ff6b35" opacity="0.8" />
            {/* Player position */}
            <circle
              cx={coordinates[0] / 10}
              cy={coordinates[2] / 10}
              r="3"
              fill="#00f5ff"
            />
            <line
              x1={coordinates[0] / 10}
              y1={coordinates[2] / 10}
              x2={coordinates[0] / 10}
              y2={coordinates[2] / 10 - 5}
              stroke="#00f5ff"
              strokeWidth="1"
            />
            {/* Grid */}
            <circle cx="0" cy="0" r="20" stroke="#ffffff20" fill="none" />
            <circle cx="0" cy="0" r="40" stroke="#ffffff20" fill="none" />
          </svg>
        </div>
      </div>

      {/* Bottom Right - Controls */}
      <div className="hud-panel hud-bottom-right">
        <div className="hud-controls">
          <button
            className="hud-button"
            onClick={() => onModeChange(mode === 'auto-cruise' ? 'free-swim' : 'auto-cruise')}
          >
            {mode === 'auto-cruise' ? '🎮 Free Swim' : '🎬 Auto Cruise'}
          </button>
          
          <button className="hud-button" onClick={onRecenter}>
            🎯 Re-center
          </button>
          
          <button className="hud-button" onClick={onTeleport}>
            ⚡ Teleport
          </button>

          <select
            className="hud-select"
            value={quality}
            onChange={(e) => onQualityChange(e.target.value as QualityPreset)}
          >
            <option value="low">Low Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="high">High Quality</option>
            <option value="ultra">Ultra Quality</option>
          </select>

          <button
            className={`hud-button ${scienceOverlayActive ? 'hud-button-active' : ''}`}
            onClick={onToggleScience}
          >
            🔬 Science Mode
          </button>
        </div>
      </div>

      {/* Instructions Overlay (for Free Swim) */}
      {mode === 'free-swim' && (
        <div className="hud-instructions">
          <div className="hud-instruction-item">WASD - Move</div>
          <div className="hud-instruction-item">Q/E - Up/Down</div>
          <div className="hud-instruction-item">Shift - Speed Boost</div>
          <div className="hud-instruction-item">Mouse Drag - Look Around</div>
        </div>
      )}
    </div>
  );
};
