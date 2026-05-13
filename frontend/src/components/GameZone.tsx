import React, { useState } from 'react';

interface GameZoneProps {
  onClose: () => void;
}

const GameZone: React.FC<GameZoneProps> = ({ onClose }) => {
  return (
    <div className="game-zone-container">
      <div className="game-zone-header">
        <h2 className="game-zone-title">🎮 游戏中心</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="empty-game-zone" style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>🚧</div>
        <h3 style={{ fontSize: '20px', color: '#64748b', marginBottom: '10px' }}>游戏区正在重新规划中</h3>
        <p style={{ fontSize: '14px' }}>所有旧游戏已被移除，敬请期待新版本！</p>
      </div>
    </div>
  );
};

export default GameZone;