import React, { useState } from 'react';

interface GameZoneProps {
  onClose: () => void;
}

const GameZone: React.FC<GameZoneProps> = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'reaction',
      name: '反应测试',
      icon: '⚡',
      description: '测试你的反应速度！看到绿色时快速点击',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'aim',
      name: '定位练习',
      icon: '🎯',
      description: '练习你的鼠标定位能力',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'difference',
      name: '找不同',
      icon: '🔍',
      description: '找出两幅图片之间的不同之处',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'volleyball',
      name: '史莱姆排球',
      icon: '🏐',
      description: '和AI对战的趣味排球游戏',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="game-zone-container">
      <div className="game-zone-header">
        <h2 className="game-zone-title">🎮 游戏中心</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      {!activeGame ? (
        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-card bg-gradient-to-br ${game.color}`}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="game-content">
          <button onClick={() => setActiveGame(null)} className="back-btn">
            ← 返回游戏列表
          </button>
          
          {activeGame === 'reaction' && <ReactionTestGame />}
          {activeGame === 'aim' && <AimTrainerGame />}
          {activeGame === 'difference' && <FindDifferenceGame />}
          {activeGame === 'volleyball' && <SlimeVolleyballGame />}
        </div>
      )}
    </div>
  );
};

// 反应测试游戏
const ReactionTestGame: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'clicked' | 'tooEarly'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.random() * 1500 + 500;
    setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('tooEarly');
    } else if (gameState === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('clicked');
      setScores(prev => [...prev, time].sort((a, b) => a - b).slice(0, 10));
    }
  };

  return (
    <div className="reaction-test-game">
      <h3 className="game-title">⚡ 反应测试</h3>
      <p className="game-instruction">看到绿色时快速点击！</p>
      
      <div 
        className={`reaction-box ${gameState}`}
        onClick={handleClick}
      >
        {gameState === 'waiting' && (
          <>
            <div className="emoji">🔴</div>
            <p>等待变绿...</p>
          </>
        )}
        {gameState === 'ready' && (
          <>
            <div className="emoji">🟢</div>
            <p>点击！</p>
          </>
        )}
        {gameState === 'clicked' && (
          <>
            <div className="emoji">✅</div>
            <p>你的反应时间：{reactionTime}ms</p>
            {reactionTime && reactionTime < 200 && <p className="fast">🚀 太快了！</p>}
            {reactionTime && reactionTime >= 200 && reactionTime < 300 && <p className="good">👍 不错！</p>}
            {reactionTime && reactionTime >= 300 && <p className="slow">🐢 继续加油！</p>}
          </>
        )}
        {gameState === 'tooEarly' && (
          <>
            <div className="emoji">❌</div>
            <p>太早了！点击下方按钮重新开始</p>
          </>
        )}
      </div>

      {(gameState === 'clicked' || gameState === 'tooEarly') && (
        <button onClick={startGame} className="play-btn">再玩一次</button>
      )}

      {gameState === 'waiting' && (
        <button onClick={startGame} className="play-btn">开始游戏</button>
      )}

      {scores.length > 0 && (
        <div className="score-history">
          <h4>📊 最佳记录</h4>
          <div className="scores-list">
            {scores.slice(0, 5).map((score, index) => (
              <div key={index} className="score-item">
                <span className="rank">{index + 1}.</span>
                <span className="time">{score}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 定位练习游戏
const AimTrainerGame: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [score, setScore] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [targetIdCounter, setTargetIdCounter] = useState(0);

  const createTarget = () => {
    const size = Math.random() * 30 + 20;
    const newId = targetIdCounter + 1;
    setTargetIdCounter(newId);
    return {
      id: newId,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 200) + 100,
      size
    };
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setShotsFired(0);
    setHits(0);
    setCombo(0);
    setMaxCombo(0);
    setTargets([createTarget(), createTarget(), createTarget(), createTarget(), createTarget()]);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!gameActive) return;
    
    setShotsFired(prev => prev + 1);
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    let hit = false;
    setTargets(prev => prev.filter(target => {
      const distance = Math.sqrt(
        Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
      );
      if (distance < target.size + 10) {
        hit = true;
        return false;
      }
      return true;
    }));

    if (hit) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setHits(prev => prev + 1);
      setScore(prev => prev + 10 * (1 + Math.floor(newCombo / 5)));
      
      while (targets.length < 5) {
        setTargets(prev => [...prev, createTarget()]);
      }
    } else {
      setCombo(0);
    }
  };

  const accuracy = shotsFired > 0 ? Math.round((hits / shotsFired) * 100) : 0;

  return (
    <div className="aim-trainer-game" onClick={handleClick}>
      <div className="game-header">
        <h3 className="game-title">🎯 定位练习</h3>
        <div className="stats">
          <span className="stat">得分: {score}</span>
          <span className="stat">命中率: {accuracy}%</span>
          <span className="stat">连击: {combo}</span>
          <span className="stat">最高连击: {maxCombo}</span>
        </div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <p>点击开始游戏</p>
          <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="play-btn">开始游戏</button>
        </div>
      ) : (
        <>
          {targets.map(target => (
            <div
              key={target.id}
              className="target"
              style={{
                left: target.x,
                top: target.y,
                width: target.size * 2,
                height: target.size * 2,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="target-inner"></div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// 找不同游戏
const FindDifferenceGame: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [differences, setDifferences] = useState<Array<{x: number, y: number}>>([]);
  const [foundDifferences, setFoundDifferences] = useState<number>(0);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);

  const differencePositions = [
    { x: 30, y: 40 },
    { x: 65, y: 35 },
    { x: 45, y: 60 },
    { x: 75, y: 70 },
    { x: 20, y: 75 }
  ];

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setDifferences(differencePositions);
    setFoundDifferences(0);
    setTime(0);
    
    const interval = window.setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    setTimer(interval);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    differences.forEach((diff, index) => {
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      if (distance < 8) {
        setFoundDifferences(prev => prev + 1);
        setScore(prev => prev + 100);
        setDifferences(prev => prev.filter((_, i) => i !== index));
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="find-difference-game">
      <div className="game-header">
        <h3 className="game-title">🔍 找不同</h3>
        <div className="stats">
          <span className="stat">得分: {score}</span>
          <span className="stat">时间: {formatTime(time)}</span>
          <span className="stat">找到: {foundDifferences}/{differencePositions.length}</span>
        </div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <p>找出两幅图片之间的5处不同</p>
          <button onClick={startGame} className="play-btn">开始游戏</button>
        </div>
      ) : (
        <div className="game-area">
          <div className="images-container">
            <div className="image-box" onClick={handleClick}>
              <div className="difference-image image1"></div>
              {foundDifferences > 0 && (
                <div className="hint-text">点击右侧图片找不同</div>
              )}
            </div>
            <div className="image-box" onClick={handleClick}>
              <div className="difference-image image2"></div>
              {differences.map((diff, index) => (
                <div
                  key={index}
                  className="difference-marker"
                  style={{ left: `${diff.x}%`, top: `${diff.y}%` }}
                ></div>
              ))}
            </div>
          </div>

          {foundDifferences === differencePositions.length && (
            <div className="victory-screen">
              <div className="victory-emoji">🎉</div>
              <p>恭喜你找到了所有不同！</p>
              <p>用时: {formatTime(time)}</p>
              <p>得分: {score}</p>
              <button onClick={() => {
                if (timer) clearInterval(timer);
                startGame();
              }} className="play-btn">再玩一次</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 史莱姆排球游戏
const SlimeVolleyballGame: React.FC = () => {
  return (
    <div className="slime-volleyball-game">
      <iframe
        src="/SlimeVolleyball-AI/SlimeVolleyball_Play_Final.html"
        title="史莱姆排球"
        className="volleyball-iframe"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GameZone;