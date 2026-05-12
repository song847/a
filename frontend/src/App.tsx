import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GameZone from './components/GameZone';
import './components/GameZone.css';

const BASE_URL = '';

function App() {
  let initialUser = null;
  let hasSavedUser = false;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      initialUser = JSON.parse(savedUser);
      hasSavedUser = true;
    }
  } catch (e) {
    console.error('Failed to parse saved user:', e);
    localStorage.removeItem('user');
  }
  
  const [isLoginView, setIsLoginView] = useState(!hasSavedUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [user, setUser] = useState<any>(initialUser);
  const [regResult, setRegResult] = useState<any>(null);
  const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [showGreetingModal, setShowGreetingModal] = useState(false);
  
  const [dashboardOpacity, setDashboardOpacity] = useState(hasSavedUser ? 1 : 0);
  const [dashboardScale, setDashboardScale] = useState(hasSavedUser ? 1 : 0.95);
  const [blurAmount, setBlurAmount] = useState(0);
  
  // Animation States
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginPhase, setLoginPhase] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [showCracks, setShowCracks] = useState(false);
  const [cracks, setCracks] = useState<any[]>([]);
  const [showEnergyCore, setShowEnergyCore] = useState(false);
  const [showNewBackground, setShowNewBackground] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const generateParticles = () => {
    const newParticles = [];
    const colors = ['particle-cyan', 'particle-purple', 'particle-pink'];
    for (let i = 0; i < 80; i++) {
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.5;
      const distance = 100 + Math.random() * 350;
      newParticles.push({
        id: i,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: Math.random() * 10 + 4,
        delay: Math.random() * 0.3,
        duration: Math.random() * 1 + 1.5,
        color: colorClass
      });
    }
    setParticles(newParticles);
  };
  
  const generateCracks = () => {
    const newCracks: { id: number; angle: number; delay: number }[] = [];
    const angles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];
    angles.forEach((angle, index) => {
      newCracks.push({
        id: index,
        angle: angle + Math.random() * 5,
        delay: index * 0.03
      });
    });
    setCracks(newCracks);
  };
  
  const handleToggleAuth = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoginView(!isLoginView);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 200);
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
        triggerLoginTransition();
        setTimeout(() => {
          setUser(data.user);
        }, 3500);
      } else {
        alert(data.error || '登录失败');
      }
    } catch (err) {
      alert('无法连接到后端服务器');
    }
  };
  
  const triggerLoginTransition = () => {
    // Phase 1 (0~1000ms): Button Energy Accumulation
    setShowRipple(true);
    setShowMask(true);
    setLoginPhase(1);
    
    setTimeout(() => {
      // Phase 2 (1000~1400ms): New Background Appears
      setShowNewBackground(true);
      setShowEnergyCore(true);
      setLoginPhase(2);
      
      setTimeout(() => {
        // Phase 3 (1400~2600ms): Particle Burst (1200ms)
        generateParticles();
        generateCracks();
        setShowParticles(true);
        setShowCracks(true);
        setLoginPhase(3);
        
        setTimeout(() => {
          // Phase 4 (2600~3000ms): Switch to Curtain (400ms)
          setShowParticles(false);
          setShowCracks(false);
          setShowEnergyCore(false);
          setShowCurtain(true);
          setLoginPhase(4);
          
          setTimeout(() => {
            // Phase 5 (3000~3700ms): Curtain Opens (700ms)
            setCurtainOpen(true);
            
            setTimeout(() => {
              // Phase 6 (3700~4000ms): Dashboard Lands (300ms)
              setDashboardOpacity(1);
              setDashboardScale(1);
              setBlurAmount(0);
              setLoginPhase(5);
              
              setTimeout(() => {
                // Cleanup
                setShowCurtain(false);
                setShowNewBackground(false);
                setShowRipple(false);
                setShowMask(false);
                setCurtainOpen(false);
                setParticles([]);
                setCracks([]);
                setLoginPhase(0);
                
                setTimeout(() => {
                  setShowWelcomeModal(true);
                }, 800);
              }, 600);
            }, 700);
          }, 400);
        }, 1200);
      }, 400);
    }, 1000);
  };

  // Time & Date State
  const [time, setTime] = useState(new Date());
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlanContent, setNewPlanContent] = useState('');
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planDate, setPlanDate] = useState('');
  const [planStartTime, setPlanStartTime] = useState('');
  const [planEndTime, setPlanEndTime] = useState('');

  // Social State
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  // Expand/Collapse State
  const [showTimeline, setShowTimeline] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [showCircle, setShowCircle] = useState(false);
  const [showAimTrainer, setShowAimTrainer] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showGameZone, setShowGameZone] = useState(false);

  // Admin State
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Background Photo State
  const [backgroundPhoto, setBackgroundPhoto] = useState<string | null>(null);
  const [photoInputRef] = useState<HTMLInputElement>(document.createElement('input'));

  // Preview Modal State
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string } | null>(null);

  // Weather State
  const [weather, setWeather] = useState<any>(null);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);

  // Circle (Life Circle) State
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: string } | null>(null);
  
  // My Little Nest State
  const [showMyNest, setShowMyNest] = useState(false);
  const [nestItems, setNestItems] = useState<any[]>([]);
  const [nestCategories, setNestCategories] = useState(['全部', '照片', '视频', '心情', '日记']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [newNestContent, setNewNestContent] = useState('');
  const [newNestCategory, setNewNestCategory] = useState('照片');
  const [nestUploadedMedia, setNestUploadedMedia] = useState<{ url: string; type: string } | null>(null);
  
  // Chat State
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Aim Trainer State
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [hits, setHits] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  
  // Reaction Test Game State
  const [showReactionTest, setShowReactionTest] = useState(false);
  const [reactionGameActive, setReactionGameActive] = useState(false);
  const [reactionState, setReactionState] = useState<'waiting' | 'ready' | 'result'>('waiting');
  const [reactionTime, setReactionTime] = useState(0);
  const [bestReactionTime, setBestReactionTime] = useState(0);
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null);
  
  // Find Difference Game State
  const [showFindDifference, setShowFindDifference] = useState(false);
  const [differenceGameActive, setDifferenceGameActive] = useState(false);
  const [differenceScore, setDifferenceScore] = useState(0);
  const [differencesFound, setDifferencesFound] = useState(0);
  const [totalDifferences, setTotalDifferences] = useState(5);
  const [differenceItems, setDifferenceItems] = useState<any[]>([]);
  const [differenceLevel, setDifferenceLevel] = useState(1);
  const [differenceTime, setDifferenceTime] = useState(0);
  const [differenceStartTime, setDifferenceStartTime] = useState<number | null>(null);
  const [differenceImages, setDifferenceImages] = useState<{ left: string; right: string } | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  
  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchNote, setSearchNote] = useState('');
  
  // Music State
  const [showMusic, setShowMusic] = useState(false);
  const [musicSearchQuery, setMusicSearchQuery] = useState('');
  const [musicList, setMusicList] = useState<any[]>([]);
  const [exclusiveMusicList, setExclusiveMusicList] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicNote, setMusicNote] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [musicUploading, setMusicUploading] = useState(false);
  
  // Wardrobe State
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState<any[]>([]);
  const [wardrobeCategory, setWardrobeCategory] = useState('全部');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [newClothesName, setNewClothesName] = useState('');

  // Pet State
  const [petEnabled, setPetEnabled] = useState(true);
  const [petType, setPetType] = useState('cat'); // cat, dog,团子, cloud, block
  const [petName, setPetName] = useState('小团子');
  const [petMood, setPetMood] = useState(70); // 0-100
  const [petHunger, setPetHunger] = useState(60); // 0-100
  const [petEnergy, setPetEnergy] = useState(80); // 0-100
  const [petAction, setPetAction] = useState('idle'); // idle, roll, sleep, peek, walk
  const [petPosition, setPetPosition] = useState({ x: 20, y: 20 });
  const [petDragging, setPetDragging] = useState(false);
  const [petLongPressTimer, setPetLongPressTimer] = useState<number | null>(null);
  const [petBubble, setPetBubble] = useState('');
  const [petInteraction, setPetInteraction] = useState(''); // touched, fed, patted
  const [petVisible, setPetVisible] = useState(true);
  const [newClothesCategory, setNewClothesCategory] = useState('上衣');
  const [newClothesSubCategory, setNewClothesSubCategory] = useState('T恤');
  const [newClothesColor, setNewClothesColor] = useState('其他');
  const [newClothesStyle, setNewClothesStyle] = useState('休闲');
  const [autoDetectCategory, setAutoDetectCategory] = useState(true);
  const [autoDetectColor, setAutoDetectColor] = useState(true);
  const [detectedColor, setDetectedColor] = useState('');
  const [detectedCategory, setDetectedCategory] = useState('');
  const [detectedSubCategory, setDetectedSubCategory] = useState('');
  const [colorRecommendations, setColorRecommendations] = useState<any[]>([]);
  const [wardrobeCategories, setWardrobeCategories] = useState<string[]>([]);
  const [wardrobeSubCategories, setWardrobeSubCategories] = useState<{[key: string]: string[]}>({});
  const [wardrobeColors, setWardrobeColors] = useState<string[]>([]);
  const [wardrobeStyles, setWardrobeStyles] = useState<string[]>([]);
  const [wardrobeOccasions, setWardrobeOccasions] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState('日常');
  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      if (gameStartTime && gameActive) {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [gameStartTime, gameActive]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      fetchWeather();
      fetchPlans();
      fetchFriends();
      fetchFriendRequests();
      fetchPosts();
      fetchNestItems();
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchFriendRequests();
      fetchFriends();
      if (selectedFriend) {
        fetchMessages(selectedFriend.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, selectedFriend]);

  const fetchWeather = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/weather`);
      const data = await response.json();
      if (data.success) {
        setWeather(data.weather);
      }
    } catch (error) {
      console.error('获取天气失败:', error);
    }
  };

  const fetchNestItems = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BASE_URL}/api/nest?user_id=${user.id}`)
      const data = await response.json();
      if (data.success) {
        setNestItems(data.items);
      }
    } catch (error) {
      console.error('获取小小窝数据失败:', error);
    }
  };

  const fetchPlans = async () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const response = await fetch(`${BASE_URL}/api/plans?user_id=${user.id}&date=${dateStr}`)
    const data = await response.json();
    if (data.success) setPlans(data.plans);
  };

  const fetchFriends = async () => {
    const response = await fetch(`${BASE_URL}/api/friends?user_id=${user.id}`)
    const data = await response.json();
    if (data.success) setFriends(data.friends);
  };

  const fetchFriendRequests = async () => {
    const response = await fetch(`${BASE_URL}/api/friends/requests?user_id=${user.id}`)
    const data = await response.json();
    if (data.success) setFriendRequests(data.requests);
  };

  const fetchPosts = async () => {
    const response = await fetch(`${BASE_URL}/api/posts`)
    const data = await response.json();
    if (data.success) setPosts(data.posts);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('请输入搜索关键词');
      return;
    }
    
    setSearchLoading(true);
    setSearchNote('');
    
    try {
      const response = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
        if (data.note) {
          setSearchNote(data.note);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('搜索失败，请稍后重试');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMusicSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/music/search?keyword=${encodeURIComponent(musicSearchQuery)}`);
      const data = await response.json();
      if (data.success) {
        setMusicList(data.songs);
        if (data.note) {
          setMusicNote(data.note);
        }
      }
    } catch (error) {
      alert('搜索音乐失败');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/music/recommend`)
      const data = await response.json();
      if (data.success) {
        setMusicList(data.songs);
      }
    } catch (error) {
      console.error('获取推荐歌曲失败:', error);
    }
  };

  const fetchUploadedMusic = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/music/uploaded`);
      const data = await response.json();
      if (data.success) {
        setMusicList(prev => [...data.songs, ...prev]);
      }
    } catch (error) {
      console.error('获取上传歌曲失败:', error);
    }
  };

  const fetchExclusiveMusic = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/music/exclusive`);
      const data = await response.json();
      if (data.success) {
        setExclusiveMusicList(data.songs);
      }
    } catch (error) {
      console.error('获取专属歌曲失败:', error);
    }
  };

  const handlePlaySong = (song: any) => {
    if (song.local) {
      setCurrentSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('播放失败:', error);
        });
      }
    } else {
      window.open(song.url, '_blank');
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setProgress(0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(100, Math.round(percent * 100)));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Pet Functions
  const petActions = ['idle', 'roll', 'sleep', 'peek', 'walk'] as const;
  const petBubbles = [
    '今天也要元气满满哦！✨',
    '摸摸头~(≧∇≦)ﾉ',
    '好无聊呀...',
    'ε٩(๑> ₃ <)۶з 戳戳~',
    '肚子饿了...',
    'zzZ... 好困',
    '主人在忙什么呢？',
    '今天天气真好！',
    '开心开心~',
    '(^▽^) 嗨！',
    '想吃小鱼干...',
    '来玩呀！',
    '发呆中...',
    '蹦蹦跳跳~',
    '你好呀！(๑•̀ㅂ•́)و✧'
  ];

  const getRandomAction = () => {
    const weights = [0.4, 0.15, 0.15, 0.15, 0.15]; // idle, roll, sleep, peek, walk
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < petActions.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) return petActions[i];
    }
    return 'idle';
  };

  const triggerPetAction = () => {
    if (petDragging) return;
    const action = getRandomAction();
    setPetAction(action);
    
    if (action === 'sleep') {
      setTimeout(() => setPetAction('idle'), 3000);
    } else if (action !== 'idle') {
      setTimeout(() => setPetAction('idle'), 2000);
    }
    
    if (Math.random() < 0.3) {
      showPetBubble();
    }
  };

  const showPetBubble = (customBubble?: string) => {
    const bubble = customBubble || petBubbles[Math.floor(Math.random() * petBubbles.length)];
    setPetBubble(bubble);
    setTimeout(() => setPetBubble(''), 3000);
  };

  const handlePetClick = () => {
    if (petDragging) return;
    
    const interactions = ['patted', 'touched', 'fed'];
    const interaction = interactions[Math.floor(Math.random() * interactions.length)];
    setPetInteraction(interaction);
    
    if (interaction === 'patted') {
      setPetMood(prev => Math.min(100, prev + 5));
      setPetBubble('(≧∀≦) 好舒服！');
    } else if (interaction === 'touched') {
      setPetMood(prev => Math.min(100, prev + 3));
      setPetBubble('Σ(っ°Д°;)っ 别戳啦！');
    } else if (interaction === 'fed') {
      setPetHunger(prev => Math.min(100, prev + 15));
      setPetMood(prev => Math.min(100, prev + 5));
      setPetBubble('(๑´ㅂ`๑) 好吃！');
    }
    
    setTimeout(() => {
      setPetInteraction('');
      setPetBubble('');
    }, 1500);
  };

  const handlePetDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPetDragging(true);
    showPetBubble('喵~ 带我去哪里呀~');
  };

  const handlePetDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!petDragging) return;
    const clientX = 'touches' in e ? e.changedTouches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0]?.clientY || 0 : e.clientY;
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 100;
    setPetPosition({
      x: Math.max(0, Math.min(maxX, clientX - 40)),
      y: Math.max(0, Math.min(maxY, clientY - 50))
    });
    setPetDragging(false);
  };

  const handlePetDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!petDragging) return;
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : e.clientY;
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 100;
    setPetPosition({
      x: Math.max(0, Math.min(maxX, clientX - 40)),
      y: Math.max(0, Math.min(maxY, clientY - 50))
    });
  };

  const renamePet = (newName: string) => {
    if (newName.trim()) {
      setPetName(newName.trim());
      setPetBubble(`我的新名字是${newName}！`);
      setTimeout(() => setPetBubble(''), 2000);
    }
  };

  const selectPetType = (type: string) => {
    setPetType(type);
    const names: Record<string, string> = {
      cat: '小猫咪',
      dog: '小狗狗',
      团子: '小团子',
      cloud: '小云兽',
      block: '方块君'
    };
    setPetName(names[type] || '小宠物');
    setPetBubble('换造型啦！');
    setTimeout(() => setPetBubble(''), 2000);
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setMusicUploading(true);
    setUploadProgress(0);

    try {
      const response = await fetch(`${BASE_URL}/api/music/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert('音乐上传成功！');
        setMusicList([]);
        setTimeout(() => {
          fetchRecommendations();
          fetchExclusiveMusic();
        }, 100);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('上传失败，请重试');
    } finally {
      setMusicUploading(false);
      setUploadProgress(0);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleExclusiveMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(user));

    setMusicUploading(true);
    setUploadProgress(0);

    try {
      const response = await fetch(`${BASE_URL}/api/music/exclusive/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert('专属音乐上传成功！所有用户都可以看到这首音乐');
        fetchExclusiveMusic();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('上传失败，请重试');
    } finally {
      setMusicUploading(false);
      setUploadProgress(0);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleDeleteSong = async (songId: number) => {
    if (!confirm('确定要删除这首音乐吗？')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/music/${songId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchRecommendations();
        if (currentSong?.id === songId) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setCurrentSong(null);
          setIsPlaying(false);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const fetchWardrobeItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/wardrobe`)
      const data = await response.json();
      if (data.success) {
        setWardrobeItems(data.items);
        setWardrobeCategories(data.categories || []);
        setWardrobeSubCategories(data.subCategories || {});
        setWardrobeColors(data.colors || []);
        setWardrobeStyles(data.styles || []);
        setWardrobeOccasions(data.occasions || []);
      }
    } catch (error) {
      console.error('获取衣柜数据失败:', error);
    }
  };
  
  const handleSmartRecommend = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/wardrobe/smart?occasion=${encodeURIComponent(selectedOccasion)}`)
      const data = await response.json();
      if (data.success) {
        setSmartRecommendations(data.recommendations || []);
        setSelectedItem(null);
        setShowMatchResult(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('获取智能推荐失败');
    }
  };

  const handleClothesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', newClothesCategory);
    formData.append('subCategory', newClothesSubCategory);
    formData.append('color', newClothesColor);
    formData.append('style', newClothesStyle);
    formData.append('name', newClothesName || '未命名');
    formData.append('autoDetectCategory', autoDetectCategory ? 'true' : 'false');
    formData.append('autoDetectColor', autoDetectColor ? 'true' : 'false');

    try {
      const response = await fetch(`${BASE_URL}/api/wardrobe`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setDetectedColor(data.detectedColor);
        setDetectedCategory(data.detectedCategory);
        setDetectedSubCategory(data.detectedSubCategory);
        alert(`衣服上传成功！\n检测到类型: ${data.detectedCategory} - ${data.detectedSubCategory}\n检测到颜色: ${data.detectedColor}\n实际使用: ${data.usedCategory} - ${data.usedSubCategory}, ${data.usedColor}`);
        fetchWardrobeItems();
        setNewClothesName('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('上传失败，请重试');
    }
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDeleteClothes = async (itemId: number) => {
    if (!confirm('确定要删除这件衣服吗？')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/wardrobe/${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchWardrobeItems();
        if (selectedItem?.id === itemId) {
          setSelectedItem(null);
          setShowMatchResult(false);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setShowMatchResult(false);
  };

  const handleMatch = async () => {
    if (!selectedItem) {
      alert('请先选择一件衣服');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/wardrobe/match?itemId=${selectedItem.id}&occasion=${encodeURIComponent(selectedOccasion)}`);
      const data = await response.json();
      if (data.success) {
        setMatchedItems(data.matchedItems || []);
        setColorRecommendations(data.colorRecommendations || []);
        setShowMatchResult(true);
        setSmartRecommendations([]);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('获取搭配推荐失败');
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
    if (data.success) setRegResult(data);
    else alert(data.error);
  };

  const changeUsername = async () => {
    if (!newUsername.trim()) {
      alert('请输入新用户名');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/change_username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, new_username: newUsername }),
      });
      const data = await response.json();
      if (data.success) {
        setUser((prev: any) => ({ ...prev, username: newUsername.trim() }));
        setShowChangeUsernameModal(false);
        setNewUsername('');
        alert('用户名修改成功！');
      } else {
        alert(data.error || '修改失败');
      }
    } catch (err) {
      alert('网络错误');
    }
  };

  const openAddPlanModal = (hour?: string) => {
    const dateStr = new Date().toISOString().split('T')[0];
    setPlanDate(dateStr);
    setPlanStartTime(hour || '09:00');
    if (hour) {
      const nextHour = (parseInt(hour) + 1).toString().padStart(2, '0');
      setPlanEndTime(`${nextHour}:00`);
    } else {
      setPlanEndTime('10:00');
    }
    setNewPlanContent('');
    setShowAddPlanModal(true);
  };

  const handleAddPlan = async () => {
    if (!newPlanContent.trim() || !planDate || !planStartTime || !planEndTime) {
      alert('请填写完整信息');
      return;
    }
    
    const response = await fetch(`${BASE_URL}/api/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        content: newPlanContent,
        start_time: planStartTime,
        end_time: planEndTime,
        date: planDate
      }),
    });
    const data = await response.json();
    if (data.success) {
      setNewPlanContent('');
      setShowAddPlanModal(false);
      fetchPlans();
    }
  };

  const handleDeletePlan = async (id: number) => {
    await fetch(`${BASE_URL}/api/plans/${id}`, { method: 'DELETE' })
    fetchPlans();
  };

  const handleSelectFriend = async (friend: any) => {
    setSelectedFriend(friend);
    setMessages([]);
    await fetchMessages(friend.id);
  };

  const fetchMessages = async (friendId: number) => {
    const response = await fetch(`${BASE_URL}/api/messages?user_id=${user.id}&friend_id=${friendId}`)
    const data = await response.json();
    if (data.success) {
      setMessages(data.messages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: user.id,
        receiver_id: selectedFriend.id,
        content: newMessage.trim()
      }),
    });

    const data = await response.json();
    if (data.success) {
      setNewMessage('');
      await fetchMessages(selectedFriend.id);
    }
  };

  const handleSelectBackgroundPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBackgroundPhoto(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeBackgroundPhoto = () => {
    setBackgroundPhoto(null);
  };

  const generateTarget = () => {
    const size = Math.random() * 30 + 20;
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (800 - size),
      y: Math.random() * (500 - size),
      size,
      color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4'][Math.floor(Math.random() * 5)],
      createdAt: Date.now()
    };
  };

  const startAimGame = () => {
    setScore(0);
    setShotsFired(0);
    setHits(0);
    setTimeElapsed(0);
    setCombo(0);
    setMaxCombo(0);
    setGameStartTime(Date.now());
    setTargets([generateTarget(), generateTarget(), generateTarget()]);
    setGameActive(true);
  };

  const stopAimGame = () => {
    setGameActive(false);
    setTargets([]);
    setGameStartTime(null);
  };

  const fetchAllUsers = async () => {
    setAdminLoading(true);
    const response = await fetch(`${BASE_URL}/api/admin/users?admin_id=${user.id}`);
    const data = await response.json();
    if (data.success) {
      setAllUsers(data.users);
    } else {
      alert(data.error);
    }
    setAdminLoading(false);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销！')) return;
    
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: user.id, user_id: userId })
    });
    
    const data = await response.json();
    if (data.success) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      alert('删除成功');
    } else {
      alert(data.error);
    }
  };

  const handleToggleAdmin = async (userId: number, isAdmin: boolean) => {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: user.id, user_id: userId, is_admin: !isAdmin })
    });
    
    const data = await response.json();
    if (data.success) {
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !isAdmin } : u));
    } else {
      alert(data.error);
    }
  };

  const handleTargetClick = (targetId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    setShotsFired(prev => prev + 1);
    setHits(prev => prev + 1);
    
    const reactionTime = Date.now() - target.createdAt;
    const sizeBonus = Math.max(100 - target.size, 10);
    const timeBonus = Math.max(1000 - reactionTime, 10);
    const comboBonus = combo * 5;
    const points = Math.round((sizeBonus + timeBonus + comboBonus) / 10);
    
    setScore(prev => prev + points);
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(max => Math.max(max, newCombo));
      return newCombo;
    });

    setTargets(prev => {
      let newTargets = prev.filter(t => t.id !== targetId);
      while (newTargets.length < 5 && gameActive) {
        newTargets.push(generateTarget());
      }
      return newTargets;
    });
  };

  const handleMissClick = () => {
    setShotsFired(prev => prev + 1);
    setCombo(0);
  };

  // Reaction Test Game Functions
  const startReactionGame = () => {
    setReactionState('waiting');
    setReactionTime(0);
    setReactionGameActive(true);
    
    const randomDelay = 500 + Math.random() * 1500;
    setTimeout(() => {
      setReactionState(prev => {
        if (prev === 'waiting') {
          setReactionStartTime(Date.now());
          return 'ready';
        }
        return prev;
      });
    }, randomDelay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      setReactionState('result');
      setReactionTime(-1);
      setTimeout(() => {
        startReactionGame();
      }, 1500);
    } else if (reactionState === 'ready') {
      const time = Date.now() - (reactionStartTime || Date.now());
      setReactionTime(time);
      setReactionState('result');
      if (time < bestReactionTime || bestReactionTime === 0) {
        setBestReactionTime(time);
      }
      setTimeout(() => {
        startReactionGame();
      }, 2000);
    }
  };

  const stopReactionGame = () => {
    setReactionGameActive(false);
    setReactionState('waiting');
    setReactionTime(0);
    setReactionStartTime(null);
  };

  const generateDifferenceLevel = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 400, 300);

    const shapes = ['circle', 'square', 'triangle', 'star'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const differences: any[] = [];

    for (let i = 0; i < 15; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 360 + 20;
      const y = Math.random() * 260 + 20;
      const size = Math.random() * 30 + 15;

      ctx.fillStyle = color;
      ctx.beginPath();

      if (shape === 'circle') {
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else if (shape === 'square') {
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      } else if (shape === 'triangle') {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
      } else if (shape === 'star') {
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }

      ctx.fill();
    }

    const leftImage = canvas.toDataURL();

    for (let i = 0; i < totalDifferences; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 360 + 20;
      const y = Math.random() * 260 + 20;
      const size = Math.random() * 25 + 10;

      differences.push({ id: i, x, y, size, shape, color, found: false });

      ctx.fillStyle = color;
      ctx.beginPath();

      if (shape === 'circle') {
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else if (shape === 'square') {
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      } else if (shape === 'triangle') {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
      } else if (shape === 'star') {
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }

      ctx.fill();
    }

    const rightImage = canvas.toDataURL();

    return { left: leftImage, right: rightImage, differences };
  };

  const startDifferenceGame = () => {
    const levelData = generateDifferenceLevel();
    if (!levelData) return;

    setDifferenceImages({ left: levelData.left, right: levelData.right });
    setDifferenceItems(levelData.differences);
    setDifferenceScore(0);
    setDifferencesFound(0);
    setDifferenceTime(0);
    setDifferenceStartTime(Date.now());
    setDifferenceGameActive(true);
  };

  const stopDifferenceGame = () => {
    setDifferenceGameActive(false);
    setDifferenceImages(null);
    setDifferenceItems([]);
    setDifferenceStartTime(null);
  };

  const handleDifferenceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!differenceGameActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedDifference = differenceItems.find(item => {
      const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
      return distance < item.size + 20 && !item.found;
    });

    if (clickedDifference) {
      setDifferenceItems(prev => prev.map(item => 
        item.id === clickedDifference.id ? { ...item, found: true } : item
      ));
      setDifferencesFound(prev => prev + 1);
      setDifferenceScore(prev => prev + 100);
    }
  };

  useEffect(() => {
    if (differenceGameActive && differencesFound >= totalDifferences) {
      setDifferenceGameActive(false);
      alert(`恭喜！您找到了所有${totalDifferences}处不同！用时：${differenceTime}秒，得分：${differenceScore}`);
    }
  }, [differencesFound, differenceGameActive, totalDifferences, differenceTime, differenceScore]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (differenceGameActive && differenceStartTime) {
      interval = setInterval(() => {
        setDifferenceTime(Math.floor((Date.now() - differenceStartTime) / 1000));
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [differenceGameActive, differenceStartTime]);

  // Pet Effects
  useEffect(() => {
    const actionInterval = setInterval(() => {
      triggerPetAction();
    }, 4000);
    return () => clearInterval(actionInterval);
  }, []);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setPetMood(prev => Math.max(0, prev - 0.5));
      setPetHunger(prev => Math.max(0, prev - 0.3));
      setPetEnergy(prev => Math.min(100, prev + 0.2));
    }, 3000);
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setPetEnergy(prev => Math.min(100, prev + 0.1));
      setPetMood(prev => Math.min(100, prev + 0.05));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const useHint = () => {
    if (hintsRemaining <= 0) return;
    const unfoundDifferences = differenceItems.filter(item => !item.found);
    if (unfoundDifferences.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * unfoundDifferences.length);
    const hintItem = unfoundDifferences[randomIndex];
    
    setDifferenceItems(prev => prev.map(item => 
      item.id === hintItem.id ? { ...item, hinted: true } : item
    ));
    setHintsRemaining(prev => prev - 1);
    setDifferenceScore(prev => Math.max(0, prev - 50));
  };

  const handleSearchUser = async () => {
    if (!searchId || searchId.length !== 6) {
      alert('请输入正确的6位数字ID');
      return;
    }
    if (searchId === user.unique_id) {
      alert('不能搜索自己哦');
      return;
    }
    const response = await fetch(`${BASE_URL}/api/users/search?unique_id=${searchId}`);
    const data = await response.json();
    if (data.success) setSearchResult(data.user);
    else {
      setSearchResult(null);
      alert(data.error);
    }
  };

  const handleAddFriend = async (friendId: number) => {
    const response = await fetch(`${BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, friend_id: friendId }),
    });
    const data = await response.json();
    if (data.success) {
      alert('好友申请已发送！请等待对方通过');
      setSearchResult(null);
      setSearchId('');
    } else {
      alert(data.error);
    }
  };

  const handleAcceptFriend = async (requesterId: number) => {
    const request = friendRequests.find(r => r.requester_id === requesterId);
    const response = await fetch(`${BASE_URL}/api/friends/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: requesterId, friend_id: user.id }),
    });
    const data = await response.json();
    if (data.success) {
      fetchFriends();
      fetchFriendRequests();
      alert(`已成功添加 ${request?.username || '该用户'} 为好友！\n\n好友已添加到您的好友列表中，可以开始聊天了。`);
    } else {
      alert(data.error);
    }
  };

  const handleDeleteFriend = async (friendId: number) => {
    const friend = friends.find(f => f.id === friendId);
    if (!confirm(`确定要删除好友 ${friend?.username || '该用户'} 吗？\n\n删除后双方好友关系将被解除。`)) {
      return;
    }
    
    const response = await fetch(`${BASE_URL}/api/friends`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, friend_id: friendId }),
    });
    const data = await response.json();
    if (data.success) {
      fetchFriends();
      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
      }
      alert(`已成功删除好友 ${friend?.username || '该用户'}！`);
    } else {
      alert(data.error);
    }
  };

  const handleDevAccept = async (friendId: number) => {
      await fetch(`${BASE_URL}/api/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: friendId, friend_id: user.id }),
      });
      fetchFriends();
      alert('测试专用：已强制对方通过申请！');
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('请选择图片或视频文件');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('文件大小不能超过 50MB');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('media', file);

    try {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setUploadedMedia({ url: data.url, type: data.type });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !uploadedMedia) {
      alert('请输入内容或上传媒体');
      return;
    }

    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        content: newPostContent,
        media_url: uploadedMedia?.url || null,
        media_type: uploadedMedia?.type || null,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setNewPostContent('');
      setUploadedMedia(null);
      fetchPosts();
    } else {
      alert(data.error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('确定要删除这条动态吗？')) return;
    const response = await fetch(`${BASE_URL}/api/posts/${postId}?user_id=${user.id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      fetchPosts();
    } else {
      alert(data.error);
    }
  };

  const handleCreateNestItem = async () => {
    if (!newNestContent.trim() && !nestUploadedMedia) {
      alert('请输入内容或上传媒体');
      return;
    }

    const response = await fetch(`${BASE_URL}/api/nest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        content: newNestContent,
        category: newNestCategory,
        media_url: nestUploadedMedia?.url || null,
        media_type: nestUploadedMedia?.type || null,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setNewNestContent('');
      setNewNestCategory('照片');
      setNestUploadedMedia(null);
      fetchNestItems();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteNestItem = async (itemId: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    const response = await fetch(`${BASE_URL}/api/nest/${itemId}?user_id=${user.id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      fetchNestItems();
    } else {
      alert(data.error);
    }
  };

  const handleNestMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setNestUploadedMedia({ url: data.url, type: data.type });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !nestCategories.includes(newCategoryName.trim())) {
      setNestCategories([...nestCategories, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category === '全部') return;
    setNestCategories(nestCategories.filter(c => c !== category));
    if (selectedCategory === category) {
      setSelectedCategory('全部');
    }
  };

  const formatTime = (timestamp: string) => {
    let date: Date;
    const match = timestamp.match(/(\d{4})[-/](\d{2})[-/](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      date = new Date(
        parseInt(match[1]),
        parseInt(match[2]) - 1,
        parseInt(match[3]),
        parseInt(match[4]),
        parseInt(match[5]),
        match[6] ? parseInt(match[6]) : 0
      );
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (user) {
    return (
      <div className={`dashboard ${dashboardOpacity === 1 ? 'visible' : ''}`}>
        <header className="dash-header">
          <div className="user-info">
            <span className="id-tag">ID: {user.unique_id}</span>
            <span className="welcome">欢迎，<b>{user.username}</b></span>
            <button 
              className="change-username-btn"
              onClick={() => setShowChangeUsernameModal(true)}
              title="修改用户名"
            >
              ✏️ 修改昵称
            </button>
          </div>
          
          <div className="section-toggle">
            <button 
              className={`toggle-btn ${showTimeline ? 'active' : ''}`}
              onClick={() => { setShowTimeline(!showTimeline); setShowSocial(false); setShowCircle(false); setShowFindDifference(false); }}
            >
              <span className="toggle-icon">📅</span>
              日程 {showTimeline ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn ${showSocial ? 'active' : ''}`}
              onClick={() => { setShowSocial(!showSocial); setShowTimeline(false); setShowCircle(false); setShowFindDifference(false); }}
            >
              <span className="toggle-icon">👥</span>
              社交 {showSocial ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn ${showCircle ? 'active' : ''}`}
              onClick={() => { setShowCircle(!showCircle); setShowTimeline(false); setShowSocial(false); setShowAimTrainer(false); setShowFindDifference(false); }}
            >
              <span className="toggle-icon">📸</span>
              生活圈 {showCircle ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn game-zone-btn ${showGameZone ? 'active' : ''}`}
              onClick={() => { setShowGameZone(!showGameZone); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAdminPanel(false); setShowAimTrainer(false); setShowFindDifference(false); setShowReactionTest(false); }}
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
              onClick={() => { setShowAdminPanel(!showAdminPanel); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowFindDifference(false); setShowReactionTest(false); }}
            >
              <span className="toggle-icon">🛡️</span>
              管理面板 {showAdminPanel ? '▼' : '▶'}
            </button>
          )}
          <button 
            className="toggle-btn photo-btn"
            onClick={handleSelectBackgroundPhoto}
            title="选择背景照片"
          >
            <span className="toggle-icon">🖼️</span>
            {backgroundPhoto ? '更换照片' : '选择照片'}
          </button>
          <button 
            className={`toggle-btn weather-btn ${showWeatherPanel ? 'active' : ''}`}
            onClick={() => { setShowWeatherPanel(!showWeatherPanel); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowAdminPanel(false); setShowMyNest(false); setShowFindDifference(false); setShowReactionTest(false); }}
              title="查看天气"
            >
              <span className="toggle-icon">🌤️</span>
              天气 {showWeatherPanel ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn nest-btn ${showMyNest ? 'active' : ''}`}
              onClick={() => { setShowMyNest(!showMyNest); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowAdminPanel(false); setShowWeatherPanel(false); setShowSearch(false); setShowFindDifference(false); }}
              title="我的小小窝"
            >
              <span className="toggle-icon">🏠</span>
              小小窝 {showMyNest ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn search-btn ${showSearch ? 'active' : ''}`}
              onClick={() => { setShowSearch(!showSearch); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowAdminPanel(false); setShowWeatherPanel(false); setShowMyNest(false); setShowMusic(false); setShowFindDifference(false); }}
              title="网络搜索"
            >
              <span className="toggle-icon">🔍</span>
              搜索 {showSearch ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn music-btn ${showMusic ? 'active' : ''}`}
              onClick={() => { setShowMusic(!showMusic); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowAdminPanel(false); setShowWeatherPanel(false); setShowMyNest(false); setShowSearch(false); setShowWardrobe(false); setShowFindDifference(false); if (!showMusic) { setMusicList([]); setTimeout(() => { fetchRecommendations(); fetchExclusiveMusic(); }, 100); } }}
              title="音乐播放器"
            >
              <span className="toggle-icon">🎵</span>
              音乐 {showMusic ? '▼' : '▶'}
            </button>
            <button 
              className={`toggle-btn wardrobe-btn ${showWardrobe ? 'active' : ''}`}
              onClick={() => { setShowWardrobe(!showWardrobe); setShowTimeline(false); setShowSocial(false); setShowCircle(false); setShowAimTrainer(false); setShowAdminPanel(false); setShowWeatherPanel(false); setShowMyNest(false); setShowSearch(false); setShowMusic(false); setShowFindDifference(false); if (!showWardrobe) fetchWardrobeItems(); }}
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

        <main className="dash-main">
          {showTimeline && (
            <section className="timeline-section">
              <div className="section-header">
                <h2>今日日程</h2>
                <button onClick={() => openAddPlanModal()} className="primary-btn add-plan-btn">+ 添加日程</button>
              </div>
              
              <div className="timeline-container">
                {Array.from({ length: 24 }).map((_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  const hourPlans = plans.filter(p => p.start_time.startsWith(hour));
                  
                  return (
                    <div key={i} className="timeline-row" onClick={() => openAddPlanModal(hour)}>
                      <div className="time-label">{hour}:00</div>
                      <div className="plan-slot">
                        {hourPlans.map(p => (
                          <div key={p.id} className="plan-item">
                            <div className="plan-time">{p.start_time} - {p.end_time}</div>
                            <span>{p.content}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeletePlan(p.id); }} className="delete-btn">×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          
          {showAddPlanModal && (
            <div className="modal-overlay" onClick={() => setShowAddPlanModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>添加日程</h3>
                  <button className="modal-close" onClick={() => setShowAddPlanModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>日期</label>
                    <input 
                      type="date" 
                      value={planDate} 
                      onChange={e => setPlanDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>开始时间</label>
                    <input 
                      type="time" 
                      value={planStartTime} 
                      onChange={e => setPlanStartTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>结束时间</label>
                    <input 
                      type="time" 
                      value={planEndTime} 
                      onChange={e => setPlanEndTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>日程内容</label>
                    <textarea 
                      value={newPlanContent} 
                      onChange={e => setNewPlanContent(e.target.value)}
                      placeholder="填写这个时间段要做什么..."
                      className="form-textarea"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setShowAddPlanModal(false)} className="cancel-btn">取消</button>
                  <button onClick={handleAddPlan} className="primary-btn">确认添加</button>
                </div>
              </div>
            </div>
          )}
          
          {showSocial && (
            <section className="social-section">
              <div className="section-header">
                <h2>社交中心</h2>
              </div>
              
              <div className="social-content">
                <div className="friends-panel">
                  <div className="search-box">
                    <input 
                      type="text" 
                      placeholder="输入 6 位 ID 搜好友..." 
                      value={searchId}
                      onChange={e => setSearchId(e.target.value)}
                      maxLength={6}
                    />
                    <button onClick={handleSearchUser} className="primary-btn">搜索</button>
                  </div>

                  {searchResult && (
                    <div className="search-result-card">
                      <p>找到用户: <b>{searchResult.username}</b> (ID: {searchResult.unique_id})</p>
                      <button onClick={() => handleAddFriend(searchResult.id)} className="primary-btn">发送好友申请</button>
                      <button onClick={() => handleDevAccept(searchResult.id)} className="dev-btn">[测试] 强制通过</button>
                    </div>
                  )}

                  {friendRequests.length > 0 && (
                    <div className="friend-requests">
                      <h3>待处理申请 ({friendRequests.length})</h3>
                      <ul>
                        {friendRequests.map(request => (
                          <li key={request.requester_id} className="friend-request-item">
                            <div className="friend-info">
                              <span className="friend-name">{request.username}</span>
                              <span className="friend-id">ID: {request.unique_id}</span>
                            </div>
                            <button onClick={() => handleAcceptFriend(request.requester_id)} className="accept-btn">通过</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="friends-list">
                    <h3>我的好友 ({friends.length})</h3>
                    {friends.length === 0 ? (
                      <p className="empty-friends">暂时还没有好友哦，快去搜索添加吧！</p>
                    ) : (
                      <ul>
                        {friends.map(friend => (
                          <li 
                            key={friend.id} 
                            className={`friend-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                          >
                            <div 
                              className="friend-info"
                              onClick={() => handleSelectFriend(friend)}
                            >
                              <b>{friend.username}</b>
                              <span className="friend-id">ID: {friend.unique_id}</span>
                            </div>
                            <div className="friend-actions">
                              <span className="chat-indicator" onClick={() => handleSelectFriend(friend)}>💬</span>
                              <button 
                                className="delete-friend-btn"
                                onClick={(e) => { e.stopPropagation(); handleDeleteFriend(friend.id); }}
                              >
                                删除
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="chat-panel">
                  {selectedFriend ? (
                    <div className="chat-window">
                      <div className="chat-header">
                        <div className="chat-partner">
                          <span className="partner-name">{selectedFriend.username}</span>
                          <span className="partner-id">ID: {selectedFriend.unique_id}</span>
                        </div>
                        <button className="close-chat" onClick={() => setSelectedFriend(null)}>×</button>
                      </div>
                      
                      <div className="messages-container">
                        {messages.length === 0 ? (
                          <div className="empty-messages">
                            <span className="empty-icon">💬</span>
                            <p>开始与 {selectedFriend.username} 聊天吧！</p>
                          </div>
                        ) : (
                          messages.map((msg, index) => (
                            <div 
                              key={index} 
                              className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                            >
                              <div className="message-content">
                                {msg.sender_id !== user.id && (
                                  <span className="message-sender">{msg.sender_name}</span>
                                )}
                                <span className="message-text">{msg.content}</span>
                                <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      <div className="message-input-area">
                        <input 
                          type="text" 
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          placeholder="输入消息..."
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                          className="message-input"
                        />
                        <button onClick={handleSendMessage} className="primary-btn send-btn">发送</button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-chat-selected">
                      <span className="empty-icon">👥</span>
                      <p>选择一个好友开始聊天</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {showGameZone && (
            <section className="game-zone-section">
              <GameZone onClose={() => setShowGameZone(false)} />
            </section>
          )}

          {showAimTrainer && (
            <section className="aim-trainer-section">
              <div className="section-header">
                <h2>🎯 定位练习</h2>
                <p className="subtitle">模拟无畏契约定位训练</p>
              </div>

              <div className="aim-game-container">
                <div className="game-stats">
                  <div className="stat-item">
                    <span className="stat-label">得分</span>
                    <span className="stat-value score">{score}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">命中率</span>
                    <span className="stat-value">{shotsFired > 0 ? Math.round((hits / shotsFired) * 100) : 0}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">时间</span>
                    <span className="stat-value">{timeElapsed}s</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">连击</span>
                    <span className="stat-value combo">x{combo}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">最高连击</span>
                    <span className="stat-value">x{maxCombo}</span>
                  </div>
                </div>

                <div className="game-controls">
                  {!gameActive ? (
                    <button onClick={startAimGame} className="primary-btn game-start-btn">开始练习</button>
                  ) : (
                    <button onClick={stopAimGame} className="game-stop-btn">停止练习</button>
                  )}
                </div>

                <div 
                  className={`game-area ${gameActive ? 'active' : ''}`}
                  onClick={gameActive ? handleMissClick : undefined}
                >
                  {!gameActive ? (
                    <div className="game-instructions">
                      <h3>游戏说明</h3>
                      <ul>
                        <li>点击屏幕上出现的目标</li>
                        <li>目标越小，得分越高</li>
                        <li>反应越快，得分越高</li>
                        <li>连续命中可获得连击加成</li>
                        <li>点击空白区域会重置连击</li>
                      </ul>
                    </div>
                  ) : (
                    targets.map(target => (
                      <div
                        key={target.id}
                        className="aim-target"
                        style={{
                          left: target.x,
                          top: target.y,
                          width: target.size,
                          height: target.size,
                          backgroundColor: target.color,
                        }}
                        onClick={(e) => handleTargetClick(target.id, e)}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {showReactionTest && (
            <section className="reaction-test-section">
              <div className="section-header">
                <h2>⚡ 反应测试</h2>
                <p className="subtitle">测试你的反应速度</p>
              </div>

              <div className="reaction-game-container">
                <div className="reaction-stats">
                  <div className="stat-item">
                    <span className="stat-label">本次反应</span>
                    <span className="stat-value reaction-time">{reactionTime > 0 ? `${reactionTime}ms` : '--'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">最佳记录</span>
                    <span className="stat-value best-time">{bestReactionTime > 0 ? `${bestReactionTime}ms` : '--'}</span>
                  </div>
                </div>

                <div className="game-controls">
                  {!reactionGameActive ? (
                    <button onClick={startReactionGame} className="primary-btn game-start-btn">开始测试</button>
                  ) : (
                    <button onClick={stopReactionGame} className="game-stop-btn">停止测试</button>
                  )}
                </div>

                <div 
                  className={`reaction-area ${reactionState}`}
                  onClick={reactionGameActive ? handleReactionClick : undefined}
                >
                  {!reactionGameActive ? (
                    <div className="game-instructions">
                      <h3>游戏说明</h3>
                      <ul>
                        <li>等待屏幕变绿</li>
                        <li>变绿后立即点击</li>
                        <li>提前点击会重新开始</li>
                      </ul>
                    </div>
                  ) : reactionState === 'waiting' ? (
                    <div className="waiting-content">
                      <span className="waiting-icon">🔴</span>
                      <h3>等待...</h3>
                      <p>变绿后立即点击！</p>
                    </div>
                  ) : reactionState === 'ready' ? (
                    <div className="ready-content">
                      <span className="ready-icon">🟢</span>
                      <h3>点击！</h3>
                    </div>
                  ) : reactionTime === -1 ? (
                    <div className="result-content too-early">
                      <span className="result-icon">❌</span>
                      <h3>太早了！</h3>
                      <p>请等待变绿后再点击</p>
                    </div>
                  ) : (
                    <div className="result-content success">
                      <span className="result-icon">✅</span>
                      <h3>你的反应时间</h3>
                      <p className="time-display">{reactionTime} ms</p>
                      {reactionTime < 200 && <p className="remark">⚡ 神级反应！</p>}
                      {reactionTime >= 200 && reactionTime < 300 && <p className="remark">👍 反应很快！</p>}
                      {reactionTime >= 300 && reactionTime < 400 && <p className="remark">😊 正常反应</p>}
                      {reactionTime >= 400 && <p className="remark">🐢 还需加油！</p>}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {showFindDifference && (
            <section className="find-difference-section">
              <div className="section-header">
                <h2>🔍 找不同</h2>
                <p className="subtitle">找出两张图片中的不同之处</p>
              </div>

              <div className="difference-game-container">
                <div className="game-stats">
                  <div className="stat-item">
                    <span className="stat-label">得分</span>
                    <span className="stat-value score">{differenceScore}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">进度</span>
                    <span className="stat-value">{differencesFound}/{totalDifferences}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">时间</span>
                    <span className="stat-value">{differenceTime}s</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">提示</span>
                    <span className="stat-value">{hintsRemaining}/3</span>
                  </div>
                </div>

                <div className="game-controls">
                  {!differenceGameActive ? (
                    <button onClick={startDifferenceGame} className="primary-btn game-start-btn">开始游戏</button>
                  ) : (
                    <>  
                      <button onClick={stopDifferenceGame} className="game-stop-btn">停止游戏</button>
                      <button 
                        onClick={useHint} 
                        className="hint-btn" 
                        disabled={hintsRemaining <= 0}
                      >
                        💡 使用提示 ({hintsRemaining})
                      </button>
                    </>
                  )}
                </div>

                <div className="difference-images-container">
                  {!differenceGameActive ? (
                    <div className="game-instructions">
                      <h3>游戏说明</h3>
                      <ul>
                        <li>找出两张图片中的{totalDifferences}处不同</li>
                        <li>点击右图中的不同之处</li>
                        <li>每找到一个不同得100分</li>
                        <li>使用提示会扣50分</li>
                        <li>越快完成越好</li>
                      </ul>
                    </div>
                  ) : (
                    <>
                      <div className="difference-image-wrapper">
                        <img src={differenceImages?.left} alt="左图" className="difference-image" />
                        <span className="image-label">原图</span>
                      </div>
                      <div 
                        className="difference-image-wrapper clickable"
                        onClick={handleDifferenceClick}
                      >
                        <img src={differenceImages?.right} alt="右图" className="difference-image" />
                        <span className="image-label">找不同</span>
                        {differenceItems.map(item => (
                          <div
                            key={item.id}
                            className={`difference-marker ${item.found ? 'found' : ''}`}
                            style={{
                              left: item.x - item.size - 10,
                              top: item.y - item.size - 10,
                              width: item.size * 2 + 20,
                              height: item.size * 2 + 20,
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {showAdminPanel && (
            <section className="admin-section">
              <div className="section-header">
                <h2>🛡️ 管理面板</h2>
                <p className="subtitle">管理平台所有账号</p>
              </div>

              <div className="admin-content">
                <button onClick={fetchAllUsers} className="primary-btn admin-refresh-btn" disabled={adminLoading}>
                  {adminLoading ? '加载中...' : '🔄 刷新用户列表'}
                </button>

                <div className="admin-stats">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <span className="stat-num">{allUsers.length}</span>
                      <span className="stat-text">总用户数</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👑</div>
                    <div className="stat-info">
                      <span className="stat-num">{allUsers.filter(u => u.is_admin).length}</span>
                      <span className="stat-text">管理员</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                      <span className="stat-num">{allUsers.filter(u => !u.is_admin).length}</span>
                      <span className="stat-text">普通用户</span>
                    </div>
                  </div>
                </div>

                {adminLoading ? (
                  <div className="loading-indicator">加载中...</div>
                ) : (
                  <div className="users-table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>用户名</th>
                          <th>用户ID</th>
                          <th>管理员</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map(userItem => (
                          <tr key={userItem.id}>
                            <td>{userItem.id}</td>
                            <td>{userItem.username}</td>
                            <td>{userItem.unique_id}</td>
                            <td>
                              <button 
                                className={`admin-toggle-btn ${userItem.is_admin ? 'admin' : ''}`}
                                onClick={() => handleToggleAdmin(userItem.id, userItem.is_admin)}
                              >
                                {userItem.is_admin ? '✓ 是' : '✗ 否'}
                              </button>
                            </td>
                            <td>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteUser(userItem.id)}
                                disabled={userItem.id === user.id}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {allUsers.length === 0 && (
                      <div className="empty-users">
                        <p>暂无用户数据</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {showCircle && (
            <section className="circle-section">
              <div className="section-header">
                <h2>生活圈</h2>
                <p className="subtitle">分享你的精彩时刻</p>
              </div>

              <div className="create-post-card">
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder="分享你的心情..."
                  className="post-textarea"
                />
                
                <div className="post-actions">
                  <div className="upload-area">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
                      onChange={handleFileSelect}
                      className="file-input"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-btn"
                      disabled={uploading}
                    >
                      {uploading ? '上传中...' : '📷 上传照片/视频'}
                    </button>
                  </div>
                  
                  {uploadedMedia && (
                    <div className="uploaded-preview">
                      {uploadedMedia.type === 'image' ? (
                        <img src={`''${uploadedMedia.url}`} alt="Preview" className="preview-image" />
                      ) : (
                        <video src={`''${uploadedMedia.url}`} controls className="preview-video" />
                      )}
                      <button onClick={() => setUploadedMedia(null)} className="remove-media-btn">×</button>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleCreatePost}
                    className="primary-btn post-submit-btn"
                  >
                    发布
                  </button>
                </div>
              </div>

              <div className="posts-list">
                {posts.length === 0 ? (
                  <div className="empty-posts">
                    <div className="empty-icon">📝</div>
                    <p>还没有动态，快来发布第一条吧！</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <div className="post-author">
                          <span className="author-name">{post.username}</span>
                          <span className="post-time">{formatTime(post.created_at)}</span>
                        </div>
                        {post.user_id === user.id && (
                          <button onClick={() => handleDeletePost(post.id)} className="delete-post-btn">删除</button>
                        )}
                      </div>
                      <p className="post-content">{post.content}</p>
                      {post.media_url && (
                        <div 
                          className="post-media"
                          onClick={() => setPreviewMedia({ url: post.media_url, type: post.media_type })}
                        >
                          {post.media_type === 'image' ? (
                            <img src={`''${post.media_url}`} alt="Post media" className="post-image" />
                          ) : (
                            <div className="video-thumbnail">
                              <img 
                                src={`''${post.media_url}`} 
                                alt="Video thumbnail" 
                                className="video-thumb" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2395a5a6" stroke-width="2"%3E%3Cpolygon points="5 3 19 12 5 21 5 3"/%3E%3C/svg%3E';
                                }}
                              />
                              <div className="play-overlay">▶</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
          
          {!showTimeline && !showSocial && !showCircle && !showAimTrainer && !showAdminPanel && !showWeatherPanel && !showMyNest && !showSearch && (
            <div className="empty-main">
              {backgroundPhoto && (
                <img 
                  src={backgroundPhoto} 
                  alt="Background" 
                  className="background-photo"
                  crossOrigin="anonymous"
                />
              )}
              {!backgroundPhoto && (
                <div className="empty-overlay">
                  <div className="empty-content">
                    <div className="empty-icon">🏠</div>
                    <h3>欢迎回来</h3>
                    <p>选择上方功能开始你的一天</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {previewMedia && (
                <div className="preview-modal" onClick={() => setPreviewMedia(null)}>
                  <div className="preview-content" onClick={(e) => e.stopPropagation()}>
                    <button className="preview-close" onClick={() => setPreviewMedia(null)}>✕</button>
                    {previewMedia.type === 'image' ? (
                      <img src={`''${previewMedia.url}`} alt="Preview" className="preview-image" />
                    ) : (
                      <video src={`''${previewMedia.url}`} controls className="preview-video" />
                    )}
                  </div>
                </div>
              )}

              {showWeatherPanel && (
                <section className="weather-section">
                  <div className="section-header">
                    <h2>🌤️ 南阳天气</h2>
                    <p className="subtitle">河南省南阳市卧龙区</p>
                  </div>
                  
                  {weather ? (
                    <div className="weather-card">
                      <div className="weather-main">
                        <div className="weather-icon-large">{weather.icon}</div>
                        <div className="weather-temp">{weather.temp}°C</div>
                        <div className="weather-desc">{weather.description}</div>
                      </div>
                      
                      <div className="weather-details">
                        <div className="weather-item">
                          <span className="detail-label">湿度</span>
                          <span className="detail-value">{weather.humidity}%</span>
                        </div>
                        <div className="weather-item">
                          <span className="detail-label">风速</span>
                          <span className="detail-value">{weather.windSpeed} km/h</span>
                        </div>
                        <div className="weather-item">
                          <span className="detail-label">能见度</span>
                          <span className="detail-value">{weather.visibility} km</span>
                        </div>
                        <div className="weather-item">
                          <span className="detail-label">气压</span>
                          <span className="detail-value">{weather.pressure} hPa</span>
                        </div>
                        <div className="weather-item">
                          <span className="detail-label">日出</span>
                          <span className="detail-value">{weather.sunrise}</span>
                        </div>
                        <div className="weather-item">
                          <span className="detail-label">日落</span>
                          <span className="detail-value">{weather.sunset}</span>
                        </div>
                      </div>
                      
                      {weather.forecast && (
                        <div className="weather-forecast">
                          <h3>未来几天预报</h3>
                          <div className="forecast-list">
                            {weather.forecast.map((day: any, index: number) => (
                              <div key={index} className="forecast-item">
                                <div className="forecast-day">{day.day}</div>
                                <div className="forecast-icon">{day.icon}</div>
                                <div className="forecast-temp">{day.temp}°C</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="loading-weather">
                      <div className="loading-spinner"></div>
                      <p>正在获取天气信息...</p>
                    </div>
                  )}
                </section>
              )}

              {showMyNest && (
                <section className="nest-section">
                  <div className="section-header">
                    <h2>🏠 我的小小窝</h2>
                    <p className="subtitle">记录生活中的点点滴滴</p>
                  </div>

                  <div className="create-nest-card">
                    <textarea
                      value={newNestContent}
                      onChange={e => setNewNestContent(e.target.value)}
                      placeholder="记录你的心情、想法或回忆..."
                      className="nest-textarea"
                    />
                    
                    <div className="nest-actions">
                      <div className="category-selector">
                        <label>分类：</label>
                        <select 
                          value={newNestCategory} 
                          onChange={e => setNewNestCategory(e.target.value)}
                          className="category-select"
                        >
                          {nestCategories.filter(c => c !== '全部').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => setShowAddCategory(!showAddCategory)}
                          className="add-category-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      {showAddCategory && (
                        <div className="add-category-input-group">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="输入分类名称"
                            className="new-category-input"
                            onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                          />
                          <button onClick={handleAddCategory} className="confirm-category-btn">确定</button>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleNestMediaUpload}
                        className="hidden-file-input"
                        ref={fileInputRef}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="upload-btn"
                        disabled={uploading}
                      >
                        {uploading ? '上传中...' : '📷 上传照片/视频'}
                      </button>
                    </div>

                    {nestUploadedMedia && (
                      <div className="uploaded-preview">
                        {nestUploadedMedia.type === 'image' ? (
                          <img src={`''${nestUploadedMedia.url}`} alt="Preview" className="preview-image" />
                        ) : (
                          <video src={`''${nestUploadedMedia.url}`} controls className="preview-video" />
                        )}
                        <button onClick={() => setNestUploadedMedia(null)} className="remove-media-btn">×</button>
                      </div>
                    )}

                    <button 
                      onClick={handleCreateNestItem}
                      className="primary-btn nest-submit-btn"
                    >
                      保存
                    </button>
                  </div>

                  <div className="category-tabs">
                    {nestCategories.map(cat => (
                      <div key={cat} className="category-tab-wrapper">
                        <button
                          className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </button>
                        {cat !== '全部' && (
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="delete-category-btn"
                            title="删除分类"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="nest-items-list">
                    {nestItems.length === 0 ? (
                      <div className="empty-nest">
                        <div className="empty-icon">📝</div>
                        <p>还没有记录，快来写下你的第一条吧！</p>
                      </div>
                    ) : (
                      nestItems
                        .filter(item => selectedCategory === '全部' || item.category === selectedCategory)
                        .map(item => (
                          <div key={item.id} className="nest-item-card">
                            <div className="nest-item-header">
                              <span className="nest-category">{item.category}</span>
                              <span className="nest-time">{formatTime(item.created_at)}</span>
                            </div>
                            <p className="nest-content">{item.content}</p>
                            {item.media_url && (
                              <div 
                                className="nest-media"
                                onClick={() => setPreviewMedia({ url: item.media_url, type: item.media_type })}
                              >
                                {item.media_type === 'image' ? (
                                  <img src={`''${item.media_url}`} alt="Nest media" className="nest-image" />
                                ) : (
                                  <div className="video-thumbnail">
                                    <img 
                                      src={`''${item.media_url}`} 
                                      alt="Video thumbnail" 
                                      className="video-thumb" 
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2395a5a6" stroke-width="2"%3E%3Cpolygon points="5 3 19 12 5 21 5 3"/%3E%3C/svg%3E';
                                      }}
                                    />
                                    <div className="play-overlay">▶</div>
                                  </div>
                                )}
                              </div>
                            )}
                            {item.user_id === user.id && (
                              <button onClick={() => handleDeleteNestItem(item.id)} className="delete-nest-btn">删除</button>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </section>
              )}

              {showSearch && (
                <section className="search-section">
                  <div className="section-header">
                    <h2>🔍 网络搜索</h2>
                    <p className="subtitle">搜索你想了解的内容</p>
                  </div>

                  <div className="search-box-container">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="输入搜索关键词..."
                      className="search-input"
                    />
                    <button onClick={handleSearch} className="primary-btn search-btn-submit" disabled={searchLoading}>
                      {searchLoading ? '搜索中...' : '搜索'}
                    </button>
                  </div>

                  {searchNote && (
                    <div className="search-note">
                      ⚠️ {searchNote}
                    </div>
                  )}

                  <div className="search-results">
                    {searchLoading ? (
                      <div className="loading-indicator">
                        <div className="loading-spinner"></div>
                        <p>正在搜索...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="results-list">
                        {searchResults.map((result, index) => (
                          <a 
                            key={index} 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="search-result-item"
                          >
                            <div className="result-title">{result.title}</div>
                            <div className="result-url">{result.url}</div>
                            <div className="result-description">{result.description}</div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-search">
                        <span className="empty-icon">🔍</span>
                        <p>输入关键词开始搜索</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
              
              {showMusic && (
                <section className="music-section">
                  <div className="music-header">
                    <div className="music-header-icon">🎵</div>
                    <h2 className="music-header-title">音乐播放器</h2>
                  </div>
                  
                  <div className="music-search-box">
                    <input
                      type="text"
                      value={musicSearchQuery}
                      onChange={(e) => setMusicSearchQuery(e.target.value)}
                      placeholder="搜索歌曲或歌手..."
                      onKeyDown={(e) => e.key === 'Enter' && handleMusicSearch()}
                      className="music-search-input"
                    />
                    <button onClick={handleMusicSearch} className="music-search-btn">搜索</button>
                  </div>

                  <div className="upload-section">
                    <label className="upload-btn">
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleMusicUpload}
                        disabled={musicUploading}
                        className="upload-input"
                      />
                      <span className="upload-icon">📤</span>
                      {musicUploading ? '上传中...' : '上传音乐'}
                    </label>
                    {user?.is_admin && (
                      <label className="upload-btn exclusive-upload-btn">
                        <input 
                          type="file" 
                          accept="audio/*" 
                          onChange={handleExclusiveMusicUpload}
                          disabled={musicUploading}
                          className="upload-input"
                        />
                        <span className="upload-icon">💎</span>
                        {musicUploading ? '上传中...' : '上传专属音乐'}
                      </label>
                    )}
                    {musicUploading && (
                      <div className="upload-progress-bar">
                        <div className="upload-progress" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>

                  {currentSong && (
                    <div className={`music-player ${isPlaying ? 'playing' : ''}`}>
                      <div className="current-song-info">
                        <div className="current-song-cover">🎵</div>
                        <div className="current-song-details">
                          <h3 className="current-song-title">{currentSong.title}</h3>
                          <p className="current-song-artist">{currentSong.artist}</p>
                        </div>
                      </div>

                      {currentSong.local && (
                        <>
                          <div className="progress-container">
                            <div className="progress-bar" onClick={handleSeek}>
                              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="progress-time">
                              {Math.floor(progress / 100 * duration / 60)}:{String(Math.floor(progress / 100 * duration % 60)).padStart(2, '0')}
                            </span>
                          </div>

                          <div className="player-controls">
                            <button onClick={togglePlay} className="control-btn play">
                              {isPlaying ? '⏸' : '▶'}
                            </button>
                          </div>

                          <div className="volume-control">
                            <span className="volume-icon">🔊</span>
                            <div className="volume-bar" onClick={handleVolumeClick}>
                              <div className="volume-fill" style={{ width: `${volume}%` }}></div>
                            </div>
                          </div>
                        </>
                      )}

                      {!currentSong.local && (
                        <div className="player-controls">
                          <button onClick={togglePlay} className="control-btn play">
                            {isPlaying ? '⏸' : '▶'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!currentSong && (
                    <div className="empty-music">
                      <div className="empty-icon">🎶</div>
                      <p>还没有正在播放的音乐</p>
                    </div>
                  )}

                  {musicNote && (
                    <div className="music-note">
                      💡 {musicNote}
                    </div>
                  )}

                  {exclusiveMusicList.length > 0 && (
                    <div className="exclusive-music-section">
                      <div className="section-header">
                        <h3 className="section-title">💎 专属音乐</h3>
                        <span className="section-subtitle">管理员精选，所有人可见</span>
                      </div>
                      <div className="music-list exclusive">
                        {exclusiveMusicList.map((song) => (
                          <div
                            key={song.id}
                            className={`music-item exclusive-item ${currentSong?.id === song.id ? 'playing' : ''}`}
                            onClick={() => handlePlaySong(song)}
                          >
                            <div className="music-item-cover exclusive-cover">💎</div>
                            <div className="music-item-info">
                              <h4 className="music-item-title">{song.title}</h4>
                              <p className="music-item-artist">{song.artist}</p>
                            </div>
                            <div className="music-item-duration">{song.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="music-list">
                    {musicList.length > 0 ? (
                      musicList.map((song) => (
                        <div
                          key={song.id}
                          className={`music-item ${currentSong?.id === song.id ? 'playing' : ''}`}
                          onClick={() => handlePlaySong(song)}
                        >
                          <div className="music-item-cover">🎵</div>
                          <div className="music-item-info">
                            <h4 className="music-item-title">{song.title}</h4>
                            <p className="music-item-artist">{song.artist}</p>
                          </div>
                          <div className="music-item-duration">{song.duration}</div>
                          {song.local && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteSong(song.id); }} 
                              className="music-item-delete"
                              title="删除"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-music">
                        <div className="empty-icon">🎶</div>
                        <p>暂无歌曲</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
              
              {showWardrobe && (
                <section className="wardrobe-section">
                  <h2 className="section-title">👔 小衣柜</h2>
                  
                  <div className="upload-section">
                    <div className="upload-form">
                      <input 
                        type="text" 
                        value={newClothesName}
                        onChange={(e) => setNewClothesName(e.target.value)}
                        placeholder="衣服名称..."
                        className="clothes-name-input"
                      />
                      <label className="auto-detect-switch">
                        <input 
                          type="checkbox" 
                          checked={autoDetectCategory}
                          onChange={(e) => setAutoDetectCategory(e.target.checked)}
                        />
                        <span>👗 自动识别类型</span>
                      </label>
                      {!autoDetectCategory && (
                        <>
                          <select 
                            value={newClothesCategory}
                            onChange={(e) => {
                              setNewClothesCategory(e.target.value);
                              setNewClothesSubCategory('');
                            }}
                            className="clothes-category-select"
                          >
                            <option value="上衣">👕 上衣</option>
                            <option value="下装">👖 下装</option>
                            <option value="鞋子">👟 鞋子</option>
                            <option value="连衣裙">👗 连衣裙</option>
                          </select>
                          <select 
                            value={newClothesSubCategory}
                            onChange={(e) => setNewClothesSubCategory(e.target.value)}
                            className="clothes-category-select"
                          >
                            <option value="">请选择款式</option>
                            {(wardrobeSubCategories[newClothesCategory] || []).map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </>
                      )}
                      <label className="auto-detect-switch">
                        <input 
                          type="checkbox" 
                          checked={autoDetectColor}
                          onChange={(e) => setAutoDetectColor(e.target.checked)}
                        />
                        <span>🎨 自动识别颜色</span>
                      </label>
                      {!autoDetectColor && (
                        <select 
                          value={newClothesColor}
                          onChange={(e) => setNewClothesColor(e.target.value)}
                          className="clothes-category-select"
                        >
                          <option value="黑色">⚫ 黑色</option>
                          <option value="白色">⚪ 白色</option>
                          <option value="灰色">⬜ 灰色</option>
                          <option value="蓝色">🔵 蓝色</option>
                          <option value="红色">🔴 红色</option>
                          <option value="粉色">🩷 粉色</option>
                          <option value="绿色">🟢 绿色</option>
                          <option value="黄色">🟡 黄色</option>
                          <option value="紫色">🟣 紫色</option>
                          <option value="棕色">🟤 棕色</option>
                          <option value="米色">⚪ 米色</option>
                          <option value="橙色">🟠 橙色</option>
                          <option value="青色">🟢 青色</option>
                          <option value="其他">❓ 其他</option>
                        </select>
                      )}
                      <select 
                        value={newClothesStyle}
                        onChange={(e) => setNewClothesStyle(e.target.value)}
                        className="clothes-category-select"
                      >
                        <option value="休闲">😌 休闲</option>
                        <option value="正式">👔 正式</option>
                        <option value="运动">⚽ 运动</option>
                        <option value="甜美">🌸 甜美</option>
                        <option value="复古">🎞️ 复古</option>
                        <option value="简约">✨ 简约</option>
                        <option value="个性">😎 个性</option>
                        <option value="优雅">👑 优雅</option>
                        <option value="街头">🛹 街头</option>
                        <option value="日系">🎌 日系</option>
                        <option value="韩系">🇰🇷 韩系</option>
                        <option value="欧美">🌍 欧美</option>
                      </select>
                      <label className="upload-btn">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleClothesUpload}
                          className="upload-input"
                        />
                        <span className="upload-icon">📤</span>
                        上传衣服
                      </label>
                    </div>
                  </div>

                  <div className="category-tabs">
                    <button 
                      className={`category-tab ${wardrobeCategory === '全部' ? 'active' : ''}`}
                      onClick={() => setWardrobeCategory('全部')}
                    >
                      全部
                    </button>
                    <button 
                      className={`category-tab ${wardrobeCategory === '上衣' ? 'active' : ''}`}
                      onClick={() => setWardrobeCategory('上衣')}
                    >
                      👕 上衣
                    </button>
                    <button 
                      className={`category-tab ${wardrobeCategory === '下装' ? 'active' : ''}`}
                      onClick={() => setWardrobeCategory('下装')}
                    >
                      👖 下装
                    </button>
                    <button 
                      className={`category-tab ${wardrobeCategory === '鞋子' ? 'active' : ''}`}
                      onClick={() => setWardrobeCategory('鞋子')}
                    >
                      👟 鞋子
                    </button>
                    <button 
                      className={`category-tab ${wardrobeCategory === '连衣裙' ? 'active' : ''}`}
                      onClick={() => setWardrobeCategory('连衣裙')}
                    >
                      👗 连衣裙
                    </button>
                  </div>

                  <div className="occasion-section">
                    <label className="occasion-label">📍 适用场景：</label>
                    <select 
                      value={selectedOccasion}
                      onChange={(e) => setSelectedOccasion(e.target.value)}
                      className="occasion-select"
                    >
                      <option value="日常">🏠 日常</option>
                      <option value="工作">💼 工作</option>
                      <option value="约会">💕 约会</option>
                      <option value="运动">⚽ 运动</option>
                      <option value="派对">🎉 派对</option>
                      <option value="旅行">✈️ 旅行</option>
                    </select>
                    <button onClick={handleSmartRecommend} className="smart-recommend-btn">🤖 智能推荐</button>
                  </div>

                  {smartRecommendations.length > 0 && (
                    <div className="smart-recommend-section">
                      <div className="smart-recommend-header">
                        <h3 className="smart-recommend-title">🤖 智能搭配推荐</h3>
                        <button onClick={() => setSmartRecommendations([])} className="close-smart-btn">✕ 关闭</button>
                      </div>
                      <p className="smart-recommend-desc">根据您的场景「{selectedOccasion}」为您推荐以下搭配方案：</p>
                      {smartRecommendations.map((outfit, outfitIndex) => (
                        <div key={outfitIndex} className="smart-outfit">
                          <div className="outfit-header">
                            <span className="outfit-reason">{outfit.reason}</span>
                          </div>
                          <div className="outfit-items">
                            {outfit.items.map((item: { id: number; imageUrl: string; name: string; category: string; color: string; style: string }, itemIndex: number) => (
                              <div key={item.id} className="smart-outfit-item">
                                <img src={item.imageUrl} alt={item.name} className="smart-outfit-image" />
                                <span className="smart-outfit-name">{item.name}</span>
                                <div className="smart-outfit-tags">
                                  <span className="smart-tag">{item.category}</span>
                                  <span className="smart-tag">{item.color}</span>
                                  <span className="smart-tag">{item.style}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedItem && !showMatchResult && !smartRecommendations.length && (
                    <div className="selected-item-section">
                      <div className="selected-item">
                        <img src={selectedItem.imageUrl} alt={selectedItem.name} className="selected-image" />
                        <div className="selected-info">
                          <h4>{selectedItem.name}</h4>
                          <span className="category-tag">{selectedItem.category}</span>
                          <span className="color-tag">{selectedItem.color}</span>
                        </div>
                      </div>
                      <div className="selected-actions">
                        <button onClick={handleMatch} className="primary-btn match-btn">🎯 帮我搭配</button>
                        <button onClick={() => setSelectedItem(null)} className="secondary-btn cancel-select-btn">✗ 取消选择</button>
                      </div>
                    </div>
                  )}

                  {showMatchResult && (
                    <div className="match-result-section">
                      <div className="match-header">
                        <h3 className="match-title">✨ 搭配推荐</h3>
                        <button onClick={() => { setShowMatchResult(false); setMatchedItems([]); }} className="close-match-btn">✕ 关闭</button>
                      </div>
                      <p className="match-desc">已为您搭配{matchedItems.length}件衣物，点击勾选框可以取消选择</p>
                      {colorRecommendations.length > 0 && (
                        <div className="color-harmony-section">
                          <h4 className="harmony-title">🎨 色彩搭配建议</h4>
                          <div className="harmony-list">
                            {colorRecommendations.map((rec, index) => (
                              <div key={index} className="harmony-item">
                                <span className="harmony-type">{rec.type}</span>
                                <div className="harmony-colors">
                                  {rec.colors.map((color: string, cIndex: number) => (
                                    <span key={cIndex} className="color-tag">{color}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="match-combo">
                        <div className="match-item">
                          <div className="match-checkbox checked">✓</div>
                          <div className="match-label">选中</div>
                          <img src={selectedItem.imageUrl} alt={selectedItem.name} className="match-image" />
                          <span className="match-name">{selectedItem.name}</span>
                          <div className="match-tags">
                            <span className="match-tag category">{selectedItem.category}</span>
                            {selectedItem.subCategory && <span className="match-tag subcategory">{selectedItem.subCategory}</span>}
                            <span className="match-tag color">{selectedItem.color}</span>
                            <span className="match-tag style">{selectedItem.style}</span>
                          </div>
                        </div>
                        {matchedItems.length > 0 ? (
                          matchedItems.map((item, index) => (
                            <div key={item.id} className={`match-item ${!matchedItems[index]?.selected ? 'unchecked' : ''}`}>
                              <button 
                                className={`match-checkbox ${matchedItems[index]?.selected !== false ? 'checked' : ''}`}
                                onClick={() => {
                                  const newMatchedItems = [...matchedItems];
                                  newMatchedItems[index] = {
                                    ...newMatchedItems[index],
                                    selected: !newMatchedItems[index]?.selected
                                  };
                                  setMatchedItems(newMatchedItems);
                                }}
                              >
                                {matchedItems[index]?.selected !== false ? '✓' : ''}
                              </button>
                              <div className="match-label">+{index + 1}</div>
                              <img src={item.imageUrl} alt={item.name} className="match-image" />
                              <span className="match-name">{item.name}</span>
                              <div className="match-tags">
                                <span className="match-tag category">{item.category}</span>
                                {item.subCategory && <span className="match-tag subcategory">{item.subCategory}</span>}
                                <span className="match-tag color">{item.color}</span>
                                <span className="match-tag style">{item.style}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-match">
                            <span className="no-match-icon">😔</span>
                            <p>暂无合适的搭配推荐</p>
                          </div>
                        )}
                      </div>
                      <div className="match-actions">
                        <button onClick={() => setShowMatchResult(false)} className="secondary-btn">重新选择</button>
                        <button 
                          onClick={() => {
                            const finalItems = matchedItems.filter(item => item.selected !== false);
                            alert(`搭配完成！已选择${finalItems.length + 1}件衣物`);
                            setShowMatchResult(false);
                          }} 
                          className="primary-btn"
                        >
                          ✓ 确认搭配
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="wardrobe-grid">
                    {wardrobeItems.length > 0 ? (
                      wardrobeItems
                        .filter(item => wardrobeCategory === '全部' || item.category === wardrobeCategory)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`clothes-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                          >
                            <img src={item.imageUrl} alt={item.name} className="clothes-image" />
                            <div className="clothes-info">
                              <h4 className="clothes-name">{item.name}</h4>
                              <div className="clothes-tags">
                                <span className="clothes-category">{item.category}</span>
                                {item.subCategory && <span className="clothes-subcategory">{item.subCategory}</span>}
                                <span className="clothes-color">{item.color}</span>
                                <span className="clothes-style">{item.style}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSelectItem(item)} 
                              className="select-btn"
                            >
                              {selectedItem?.id === item.id ? '✓ 已选择' : '选择'}
                            </button>
                            <button 
                              onClick={() => handleDeleteClothes(item.id)} 
                              className="delete-clothes-btn"
                              title="删除"
                            >
                              🗑️
                            </button>
                          </div>
                        ))
                    ) : (
                      <div className="empty-wardrobe">
                        <span className="empty-icon">👔</span>
                        <p>衣柜是空的，上传一些衣服吧</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </main>
            
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />
            
            {showWelcomeModal && (
              <div className="welcome-modal-overlay" onClick={() => setShowWelcomeModal(false)}>
                <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="welcome-modal-content">
                    <div className="welcome-decoration">✨</div>
                    <h2 className="welcome-title">{user?.username}，天天开心！🥰</h2>
                    <p className="welcome-poem">浅喜伴朝夕，<br />温柔渡四季。</p>
                    <div className="welcome-stars">
                      {['🌟', '✨', '⭐', '💫', '🌟'].map((star, i) => (
                        <span key={i} className="star-emoji" style={{ animationDelay: `${i * 0.1}s` }}>
                          {star}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowWelcomeModal(false)} 
                      className="welcome-close-btn"
                    >
                      知道啦
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showChangeUsernameModal && (
              <div className="welcome-modal-overlay" onClick={() => setShowChangeUsernameModal(false)}>
                <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="welcome-modal-content">
                    <div className="welcome-decoration">✏️</div>
                    <h2 className="welcome-title">修改昵称</h2>
                    <div className="change-username-form">
                      <input
                        type="text"
                        placeholder="请输入新昵称"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="change-username-input"
                        maxLength={20}
                      />
                    </div>
                    <div className="modal-buttons">
                      <button 
                        onClick={() => setShowChangeUsernameModal(false)} 
                        className="modal-cancel-btn"
                      >
                        取消
                      </button>
                      <button 
                        onClick={changeUsername} 
                        className="modal-confirm-btn"
                      >
                        确认修改
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showGreetingModal && (
              <div className="welcome-modal-overlay" onClick={() => setShowGreetingModal(false)}>
                <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="welcome-modal-content">
                    <div className="welcome-decoration">💝</div>
                    <h2 className="welcome-title">{user?.username}，天天开心！🥰</h2>
                    <p className="welcome-poem">浅喜伴朝夕，<br />温柔渡四季。</p>
                    <div className="welcome-stars">
                      {['🌟', '✨', '⭐', '💫', '🌟'].map((star, i) => (
                        <span key={i} className="star-emoji" style={{ animationDelay: `${i * 0.1}s` }}>
                          {star}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowGreetingModal(false)} 
                      className="welcome-close-btn"
                    >
                      知道啦
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pet Module */}
            {petEnabled && petVisible && (
              <div 
                className={`pet-container ${petDragging ? 'dragging' : ''}`}
                style={{ left: `${petPosition.x}px`, top: `${petPosition.y}px` }}
                onMouseDown={(e) => handlePetDragStart(e)}
                onMouseUp={(e) => handlePetDragEnd(e)}
                onMouseMove={(e) => handlePetDragMove(e)}
                onMouseLeave={(e) => handlePetDragEnd(e)}
                onTouchStart={(e) => handlePetDragStart(e)}
                onTouchEnd={(e) => handlePetDragEnd(e)}
                onTouchMove={(e) => handlePetDragMove(e)}
              >
                {petBubble && (
                  <div className="pet-bubble">
                    {petBubble}
                  </div>
                )}
                
                <div 
                  className={`pet ${petAction} ${petInteraction}`}
                  onClick={(e) => { e.stopPropagation(); if (!petDragging && !petLongPressTimer) handlePetClick(); }}
                >
                  <div className="pet-body">
                    {petType === 'cat' && (
                      <img src="/cat-mascot.svg" alt={petName} className="pet-image" />
                    )}
                    {petType === 'dog' && (
                      <div className="pet-dog">
                        <div className="dog-ear dog-ear-left">
                          <div className="dog-ear-inner"></div>
                        </div>
                        <div className="dog-ear dog-ear-right">
                          <div className="dog-ear-inner"></div>
                        </div>
                        <div className="dog-head">
                          <div className="dog-face">
                            <div className="dog-eyes">
                              <div className="dog-eye"></div>
                              <div className="dog-eye"></div>
                            </div>
                            <div className="dog-nose"></div>
                            <div className="dog-mouth"></div>
                            <div className="dog-blush dog-blush-left"></div>
                            <div className="dog-blush dog-blush-right"></div>
                          </div>
                        </div>
                        <div className="dog-body"></div>
                        <div className="dog-tail"></div>
                        <div className="dog-paws">
                          <div className="dog-paw"></div>
                          <div className="dog-paw"></div>
                        </div>
                      </div>
                    )}
                    {petType === '团子' && (
                      <div className="pet-dango">
                        <div className="dango-body">
                          <div className="dango-face">
                            <div className="dango-eyes">
                              <div className="dango-eye dango-eye-left"></div>
                              <div className="dango-eye dango-eye-right"></div>
                            </div>
                            <div className="dango-mouth"></div>
                          </div>
                        </div>
                        <div className="dango-stick"></div>
                      </div>
                    )}
                    {petType === 'cloud' && (
                      <div className="pet-cloud">
                        <div className="cloud-body">
                          <div className="cloud-face">
                            <div className="cloud-eyes">
                              <div className="cloud-eye cloud-eye-left"></div>
                              <div className="cloud-eye cloud-eye-right"></div>
                            </div>
                            <div className="cloud-mouth"></div>
                          </div>
                        </div>
                        <div className="cloud-arms">
                          <div className="cloud-arm cloud-arm-left"></div>
                          <div className="cloud-arm cloud-arm-right"></div>
                        </div>
                      </div>
                    )}
                    {petType === 'block' && (
                      <div className="pet-block">
                        <div className="block-body">
                          <div className="block-face">
                            <div className="block-eyes">
                              <div className="block-eye block-eye-left"></div>
                              <div className="block-eye block-eye-right"></div>
                            </div>
                            <div className="block-mouth"></div>
                          </div>
                        </div>
                        <div className="block-shadow"></div>
                      </div>
                    )}
                  </div>
                  <div className="pet-name">{petName}</div>
                </div>
                
                <div className="pet-status">
                  <div className="status-bar mood">
                    <div className="status-fill" style={{ width: `${petMood}%` }}></div>
                  </div>
                  <div className="status-bar hunger">
                    <div className="status-fill" style={{ width: `${petHunger}%` }}></div>
                  </div>
                  <div className="status-bar energy">
                    <div className="status-fill" style={{ width: `${petEnergy}%` }}></div>
                  </div>
                </div>
                
                <button 
                  className="pet-toggle"
                  onClick={(e) => { e.stopPropagation(); setPetVisible(!petVisible); }}
                  title={petVisible ? '隐藏宠物' : '显示宠物'}
                >
                  {petVisible ? '▼' : '▲'}
                </button>
                
                <div className="pet-menu">
                  <button 
                    className="menu-btn"
                    onClick={(e) => { e.stopPropagation(); setPetVisible(!petVisible); }}
                  >
                    {petVisible ? '收起' : '展开'}
                  </button>
                  <button 
                    className="menu-btn"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const newName = prompt('给宠物取个名字:', petName);
                      if (newName) renamePet(newName); 
                    }}
                  >
                    改名
                  </button>
                  <div className="pet-type-selector">
                    {['cat', 'dog', '团子', 'cloud', 'block'].map(type => (
                      <button
                        key={type}
                        className={`type-btn ${petType === type ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); selectPetType(type); }}
                        title={{ cat: '小猫', dog: '小狗', 团子: '小团子', cloud: '云朵兽', block: '方块生物' }[type]}
                      >
                        {{ cat: '🐱', dog: '🐶', 团子: '🍡', cloud: '☁️', block: '🧊' }[type]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

  return (
    <div className={`app ${loginPhase > 0 ? 'login-transition' : ''}`} style={{ filter: loginPhase > 0 ? `blur(${blurAmount}px)` : 'none' }}>
      {/* Starfield Background */}
      <div className="starfield-container">
        {[...Array(200)].map((_, i) => {
          const speedClass = ['slow', 'medium', 'fast'][i % 3];
          return (
            <div
              key={i}
              className={`star ${speedClass}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 12}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Particles */}
      {showParticles && (
        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`particle ${particle.color}`}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      
      {/* Ripple Effect */}
      {showRipple && (
        <div className="ripple-container">
          <div className="ripple ripple-1"></div>
          <div className="ripple ripple-2"></div>
          <div className="ripple ripple-3"></div>
        </div>
      )}
      
      {/* New Background */}
      {showNewBackground && (
        <div className="new-background">
          {showEnergyCore && (
            <div className="energy-core">
              <div className="core-inner"></div>
              <div className="core-outer"></div>
              <div className="core-glow"></div>
            </div>
          )}
          {showCracks && (
            <div className="cracks-container">
              {cracks.map((crack) => (
                <div
                  key={crack.id}
                  className="crack-line"
                  style={{
                    transform: `rotate(${crack.angle}deg)`,
                    animationDelay: `${crack.delay}s`
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Sky Blue Curtain */}
      {showCurtain && (
        <div className="curtain-container">
          <div className={`curtain-left ${curtainOpen ? 'opening' : ''}`}></div>
          <div className={`curtain-right ${curtainOpen ? 'opening' : ''}`}></div>
          <div className="curtain-shimmer"></div>
        </div>
      )}
      
      {/* Fullscreen Mask */}
      {showMask && (
        <div className={`fullscreen-mask ${loginPhase >= 2 ? 'mask-expand' : ''}`}>
          <div className="mask-gradient"></div>
        </div>
      )}
      
      {/* Auth Container */}
      <div className={`auth-container ${isTransitioning ? 'transitioning' : ''} ${loginPhase > 0 ? 'collapsing' : ''}`}>
        <div className={`auth-card ${isLoginView ? 'login-view' : 'register-view'} ${isTransitioning ? 'flip-transition' : ''}`}>
          <div className="logo-circle">
            <span className="logo-icon">S</span>
          </div>
          <h1 className="main-title">Slogan</h1>
          
          <div className={`form-container ${isTransitioning ? 'form-transition' : ''}`}>
            {isLoginView ? (
              <form onSubmit={handleLogin} className={`auth-form ${isTransitioning ? 'fade-out' : ''}`}>
                <h2 className="form-title">登录</h2>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="6位数字 ID" 
                    value={uniqueId} 
                    onChange={(e) => setUniqueId(e.target.value)} 
                    required 
                    className="auth-input"
                  />
                  <div className="input-line"></div>
                  <div className="input-glow"></div>
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
                  <div className="input-line"></div>
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className={`primary-btn login-btn ${loginPhase === 1 ? 'button-contract' : ''}`}>登录</button>
                <p className="toggle-auth">没有账号？ <span onClick={handleToggleAuth}>去注册</span></p>
              </form>
            ) : regResult ? (
              <div className="result-card">
                <div className="success-icon">✓</div>
                <h2>注册成功！</h2>
                <p>你的唯一登录 ID 是：</p>
                <div className="id-box">{regResult.user.unique_id}</div>
                <p className="hint">请牢记此 ID，它是你的唯一登录账号。</p>
                <button className="primary-btn" onClick={() => { setRegResult(null); handleToggleAuth(); }}>返回登录</button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className={`auth-form ${isTransitioning ? 'fade-out' : ''}`}>
                <h2 className="form-title">创建账号</h2>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="昵称" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="auth-input"
                  />
                  <div className="input-line"></div>
                  <div className="input-glow"></div>
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
                  <div className="input-line"></div>
                  <div className="input-glow"></div>
                </div>
                <button type="submit" className="primary-btn">立即注册</button>
                <p className="toggle-auth">已有账号？ <span onClick={handleToggleAuth}>去登录</span></p>
              </form>
            )}
          </div>
          
          <div className="transition-mask"></div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
