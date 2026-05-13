import React from 'react';

interface HeaderProps {
  user: any;
  time: Date;
  weather: any;
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
  showSocial: boolean;
  setShowSocial: (show: boolean) => void;
  showGameZone: boolean;
  setShowGameZone: (show: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  showWeatherPanel: boolean;
  setShowWeatherPanel: (show: boolean) => void;
  showMyNest: boolean;
  setShowMyNest: (show: boolean) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showMusic: boolean;
  setShowMusic: (show: boolean) => void;
  showWardrobe: boolean;
  setShowWardrobe: (show: boolean) => void;
  petVisible: boolean;
  setPetVisible: (visible: boolean) => void;
  setShowChangeUsernameModal: (show: boolean) => void;
  setShowGreetingModal: (show: boolean) => void;
  handleLogout: () => void;
  fetchRecommendations: () => void;
  fetchExclusiveMusic: () => void;
  fetchWardrobeItems: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user, time, weather,
  showTimeline, setShowTimeline,
  showSocial, setShowSocial,
  showGameZone, setShowGameZone,
  showAdminPanel, setShowAdminPanel,
  showWeatherPanel, setShowWeatherPanel,
  showMyNest, setShowMyNest,
  showSearch, setShowSearch,
  showMusic, setShowMusic,
  showWardrobe, setShowWardrobe,
  petVisible, setPetVisible,
  setShowChangeUsernameModal,
  setShowGreetingModal,
  handleLogout,
  fetchRecommendations,
  fetchExclusiveMusic,
  fetchWardrobeItems
}) => {
  const resetAllPanels = () => {
    setShowTimeline(false);
    setShowSocial(false);
    setShowGameZone(false);
    setShowAdminPanel(false);
    setShowWeatherPanel(false);
    setShowMyNest(false);
    setShowSearch(false);
    setShowMusic(false);
    setShowWardrobe(false);
  };

  return (
    <header className="dash-header">
      <div className="user-info">
        <div className="user-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="welcome">欢迎，<b>{user.username}</b></span>
          <span className="id-tag">ID: {user.unique_id}</span>
        </div>
        <button 
          className="change-username-btn"
          onClick={() => setShowChangeUsernameModal(true)}
          title="修改昵称"
        >
          ✏️
        </button>
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="退出登录"
        >
          <svg className="logout-icon" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          退出
        </button>
      </div>
      
      <div className="section-toggle">
        <button 
          className={`toggle-btn ${showTimeline ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowTimeline(true); }}
        >
          <span className="toggle-icon">📅</span>
          日程 {showTimeline ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn ${showSocial ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowSocial(true); }}
        >
          <span className="toggle-icon">👥</span>
          社交 {showSocial ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn game-zone-btn ${showGameZone ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowGameZone(true); }}
        >
          <span className="toggle-icon">🎮</span>
          游戏中心 {showGameZone ? '▼' : '▶'}
        </button>
        <button 
          className="toggle-btn greeting-btn"
          onClick={() => setShowGreetingModal(true)}
          title="温馨问候"
        >
          <span className="toggle-icon">💝</span>
          天天开心
        </button>
        {user.is_admin && (
          <button 
            className={`toggle-btn admin-btn ${showAdminPanel ? 'active' : ''}`}
            onClick={() => { resetAllPanels(); setShowAdminPanel(true); }}
          >
            <span className="toggle-icon">🛡️</span>
            管理面板 {showAdminPanel ? '▼' : '▶'}
          </button>
        )}
        <button 
          className={`toggle-btn weather-btn ${showWeatherPanel ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowWeatherPanel(true); }}
          title="查看天气"
        >
          <span className="toggle-icon">🌤️</span>
          天气 {showWeatherPanel ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn nest-btn ${showMyNest ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowMyNest(true); }}
          title="我的小小窝"
        >
          <span className="toggle-icon">🏠</span>
          小小窝 {showMyNest ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn search-btn ${showSearch ? 'active' : ''}`}
          onClick={() => { resetAllPanels(); setShowSearch(true); }}
          title="网络搜索"
        >
          <span className="toggle-icon">🔍</span>
          搜索 {showSearch ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn music-btn ${showMusic ? 'active' : ''}`}
          onClick={() => { 
            resetAllPanels();
            setShowMusic(true); 
            if (!showMusic) { setTimeout(() => { fetchRecommendations(); fetchExclusiveMusic(); }, 100); } 
          }}
          title="音乐播放器"
        >
          <span className="toggle-icon">🎵</span>
          音乐 {showMusic ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn wardrobe-btn ${showWardrobe ? 'active' : ''}`}
          onClick={() => { 
            resetAllPanels();
            setShowWardrobe(true); 
            if (!showWardrobe) fetchWardrobeItems(); 
          }}
          title="小衣柜"
        >
          <span className="toggle-icon">👔</span>
          小衣柜 {showWardrobe ? '▼' : '▶'}
        </button>
        <button 
          className={`toggle-btn pet-btn ${!petVisible ? 'active' : ''}`}
          onClick={() => setPetVisible(!petVisible)}
          title={petVisible ? '隐藏宠物' : '召唤宠物'}
        >
          <span className="toggle-icon">🐾</span>
          {petVisible ? '隐藏' : '召唤'}
        </button>
      </div>
      
      <div className="time-display">
        <div className="current-time">{time.toLocaleTimeString('zh-CN', { hour12: false })}</div>
        <div className="current-date">
          {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
        {weather && (
          <div className="current-weather">
            <span className="weather-icon">{weather.icon}</span>
            <span className="weather-text">{weather.temp}°C {weather.description}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
