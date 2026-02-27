'use client';

import React from 'react';
import { TeleportPoint } from '../engine/types';

interface TeleportMenuProps {
  points: TeleportPoint[];
  onTeleport: (point: TeleportPoint) => void;
  onClose: () => void;
}

export const TeleportMenu: React.FC<TeleportMenuProps> = ({
  points,
  onTeleport,
  onClose,
}) => {
  return (
    <div className="teleport-menu-overlay" onClick={onClose}>
      <div className="teleport-menu" onClick={(e) => e.stopPropagation()}>
        <button className="teleport-menu-close" onClick={onClose}>
          ×
        </button>
        
        <div className="teleport-menu-header">
          <h3 className="teleport-menu-title">⚡ Teleport Destinations</h3>
        </div>
        
        <div className="teleport-menu-list">
          {points.map((point) => (
            <button
              key={point.id}
              className="teleport-menu-item"
              onClick={() => {
                onTeleport(point);
                onClose();
              }}
            >
              <span className="teleport-menu-item-name">{point.name}</span>
              <span className="teleport-menu-item-coords">
                ({point.position[0]}, {point.position[1]}, {point.position[2]})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
