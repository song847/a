import React, { useState, useEffect, useRef } from 'react';

interface AuthContainerProps {
  setUser: (user: any) => void;
  setDashboardOpacity: (opacity: number) => void;
  setDashboardScale: (scale: number) => void;
  setBlurAmount: (blur: number) => void;
  setShowWelcomeModal: (show: boolean) => void;
  blurAmount: number;
}

const BASE_URL = '';

const AuthContainer: React.FC<AuthContainerProps> = ({ 
  setUser, 
  setDashboardOpacity, 
  setDashboardScale, 
  setBlurAmount, 
  setShowWelcomeModal,
  blurAmount
}) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [regResult, setRegResult] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loginHistory, setLoginHistory] = useState<string[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('login_history');
    if (saved) {
      try {
        setLoginHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAuth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoginView(!isLoginView);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };

  const saveToHistory = (id: string) => {
    const newHistory = [id, ...loginHistory.filter(h => h !== id)].slice(0, 5);
    setLoginHistory(newHistory);
    localStorage.setItem('login_history', JSON.stringify(newHistory));
  };

  const removeFromHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = loginHistory.filter(h => h !== id);
    setLoginHistory(newHistory);
    localStorage.setItem('login_history', JSON.stringify(newHistory));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_id: uniqueId, password }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        saveToHistory(uniqueId);
        setUser(data.user);
        setDashboardOpacity(1);
        setDashboardScale(1);
        setBlurAmount(0);
        setShowWelcomeModal(true);
      } else {
        alert(data.error || '登录失败');
      }
    } catch (err) {
      alert('无法连接到后端服务器');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      if (data.token) localStorage.setItem('token', data.token);
      setRegResult(data);
    }
    else alert(data.error);
  };

  return (
    <div className="app-login-wrapper">
      <div className={`auth-container ${isTransitioning ? 'transitioning' : ''}`}>
        <div className={`auth-card ${isLoginView ? 'login-view' : 'register-view'}`}>
          <div className="logo-circle">
            <span className="logo-icon">S</span>
          </div>
          <h1 className="main-title">Song App</h1>
          <p className="form-title">{isLoginView ? '欢迎回来' : '开启社交新体验'}</p>
          
          <div className={`form-container ${isTransitioning ? 'form-transition' : ''}`}>
            {isLoginView ? (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="input-group" ref={historyRef}>
                  <input 
                    type="text" 
                    placeholder="6位数字 ID" 
                    value={uniqueId} 
                    onChange={(e) => setUniqueId(e.target.value)}
                    onFocus={() => loginHistory.length > 0 && setShowHistory(true)}
                    required 
                    className="auth-input"
                    autoComplete="off"
                  />
                  {showHistory && (
                    <div className="login-history-list">
                      {loginHistory.map(id => (
                        <div 
                          key={id} 
                          className="history-item"
                          onClick={() => { setUniqueId(id); setShowHistory(false); }}
                        >
                          <span>{id}</span>
                          <span className="remove-btn" onClick={(e) => removeFromHistory(e, id)}>✕</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="密码" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="auth-input"
                  />
                </div>
                <button type="submit" className="primary-btn">登录系统</button>
                <p className="toggle-auth">新用户？ <span onClick={handleToggleAuth}>立即注册账号</span></p>
              </form>
            ) : regResult ? (
              <div className="result-card">
                <div className="success-icon">✓</div>
                <h2>注册成功！</h2>
                <p>这是你的唯一登录 ID：</p>
                <div className="id-box">{regResult.user.unique_id}</div>
                <p className="hint">请牢记此 ID，它是你进入 Song App 的唯一凭证。</p>
                <button className="primary-btn" onClick={() => { setRegResult(null); handleToggleAuth(); }}>返回登录</button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="给自己起个好听的名字" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="auth-input"
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="设置登录密码" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="auth-input"
                  />
                </div>
                <button type="submit" className="primary-btn">创建我的账号</button>
                <p className="toggle-auth">已有账号？ <span onClick={handleToggleAuth}>去登录</span></p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
