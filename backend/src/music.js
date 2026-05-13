const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getDb } = require('./db');

const MUSIC_DIR = path.join(__dirname, '../uploads/music');
const EXCLUSIVE_MUSIC_DIR = path.join(__dirname, '../uploads/exclusive_music');

if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

if (!fs.existsSync(EXCLUSIVE_MUSIC_DIR)) {
  fs.mkdirSync(EXCLUSIVE_MUSIC_DIR, { recursive: true });
}

function generateMockSongs(keyword = '') {
  const songs = [
    {
      id: 1,
      title: '晴天',
      artist: '周杰伦',
      album: '叶惠美',
      duration: '4:29',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20cover%20blue%20sky%20sunshine&image_size=square',
      url: 'https://music.163.com/#/song?id=186166',
      local: false
    },
    {
      id: 2,
      title: '稻香',
      artist: '周杰伦',
      album: '魔杰座',
      duration: '3:43',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=rice%20field%20golden%20harvest%20sunset&image_size=square',
      url: 'https://music.163.com/#/song?id=27615201',
      local: false
    },
    {
      id: 3,
      title: '夜曲',
      artist: '周杰伦',
      album: '十一月的萧邦',
      duration: '4:23',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=piano%20night%20stars%20romantic&image_size=square',
      url: 'https://music.163.com/#/song?id=185826',
      local: false
    },
    {
      id: 4,
      title: '告白气球',
      artist: '周杰伦',
      album: '周杰伦的床边故事',
      duration: '3:35',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=balloons%20love%20romantic%20pink&image_size=square',
      url: 'https://music.163.com/#/song?id=411214227',
      local: false
    },
    {
      id: 5,
      title: '七里香',
      artist: '周杰伦',
      album: '七里香',
      duration: '4:59',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20flowers%20garden%20romantic&image_size=square',
      url: 'https://music.163.com/#/song?id=186341',
      local: false
    },
    {
      id: 6,
      title: '平凡之路',
      artist: '朴树',
      album: '猎户星座',
      duration: '4:46',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=road%20journey%20sunset%20freedom&image_size=square',
      url: 'https://music.163.com/#/song?id=28117958',
      local: false
    },
    {
      id: 7,
      title: '后来',
      artist: '刘若英',
      album: '收获',
      duration: '5:40',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=memory%20nostalgia%20soft%20light&image_size=square',
      url: 'https://music.163.com/#/song?id=167876',
      local: false
    },
    {
      id: 8,
      title: '夜空中最亮的星',
      artist: '逃跑计划',
      album: '世界',
      duration: '4:12',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=stars%20night%20sky%20dream&image_size=square',
      url: 'https://music.163.com/#/song?id=25628765',
      local: false
    },
    {
      id: 9,
      title: '追梦赤子心',
      artist: 'GALA',
      album: '追梦赤子心',
      duration: '4:35',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=dream%20ambition%20fire%20passion&image_size=square',
      url: 'https://music.163.com/#/song?id=28361316',
      local: false
    },
    {
      id: 10,
      title: '光辉岁月',
      artist: 'Beyond',
      album: '命运派对',
      duration: '4:55',
      cover: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=light%20hope%20sunrise%20inspirational&image_size=square',
      url: 'https://music.163.com/#/song?id=188365',
      local: false
    }
  ];

  if (!keyword) return songs;
  
  const lowerKeyword = keyword.toLowerCase();
  return songs.filter(song => 
    song.title.toLowerCase().includes(lowerKeyword) ||
    song.artist.toLowerCase().includes(lowerKeyword) ||
    song.album.toLowerCase().includes(lowerKeyword)
  );
}

async function searchMusic(req, res) {
  const { keyword } = req.query;
  const user = req.user;
  
  const mockSongs = generateMockSongs(keyword);
  
  let userSongs = [];
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM music WHERE user_id = ? AND is_exclusive = 0').all(user.id);
    userSongs = rows.map(row => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      album: row.album,
      duration: '--:--',
      cover: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20cover%20art&image_size=square`,
      url: row.url,
      local: true
    }));
  } catch (error) {
    console.error('搜索用户音乐失败:', error);
  }
  
  let allSongs = [...userSongs];
  
  if (!keyword) {
    allSongs = [...allSongs, ...mockSongs];
  } else {
    const lowerKeyword = keyword.toLowerCase();
    const filteredMock = mockSongs.filter(song => 
      song.title.toLowerCase().includes(lowerKeyword) ||
      song.artist.toLowerCase().includes(lowerKeyword)
    );
    const filteredUser = userSongs.filter(song =>
      song.title.toLowerCase().includes(lowerKeyword) ||
      song.artist.toLowerCase().includes(lowerKeyword)
    );
    allSongs = [...filteredUser, ...filteredMock];
  }
  
  res.json({
    success: true,
    keyword: keyword || '',
    songs: allSongs,
    total: allSongs.length,
    note: '本地音乐可直接播放，网络歌曲点击可跳转到网易云音乐'
  });
}

async function getRecommendations(req, res) {
  const user = req.user;
  let userSongs = [];
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM music WHERE user_id = ? AND is_exclusive = 0 LIMIT 10').all(user.id);
    userSongs = rows.map(row => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      album: row.album,
      duration: '--:--',
      cover: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20cover%20art&image_size=square`,
      url: row.url,
      local: true
    }));
  } catch (error) {
    console.error('获取推荐音乐失败:', error);
  }

  const mockSongs = generateMockSongs().slice(0, 6);
  const allSongs = [...userSongs, ...mockSongs];
  
  res.json({
    success: true,
    songs: allSongs,
    total: allSongs.length
  });
}

async function uploadMusic(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '请选择要上传的音乐文件' });
    }

    const user = req.user;
    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    
    const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma', '.ape'];
    const encryptedFormats = ['.kgg', '.kgm', '.vpr'];
    
    if (encryptedFormats.includes(ext)) {
      return res.status(400).json({ 
        success: false, 
        error: `${ext.toUpperCase()} 是加密格式，无法直接播放。请先转换为 MP3 等标准格式后再上传。`,
        note: '提示：可以使用格式转换工具将加密音乐转换为 MP3 格式'
      });
    }
    
    if (!supportedFormats.includes(ext)) {
      return res.status(400).json({ success: false, error: `不支持的文件格式。支持的格式：${supportedFormats.join(', ')}` });
    }

    const fileName = file.filename;
    const title = path.basename(file.originalname, ext).replace(/_/g, ' ');
    const url = `/uploads/music/${encodeURIComponent(fileName)}`;
    
    const db = getDb();
    const stmt = db.prepare('INSERT INTO music (user_id, title, artist, album, url, filename, is_exclusive) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(user.id, title, '本地音乐', '我的音乐', url, fileName, 0);
    
    res.json({
      success: true,
      message: '音乐上传成功',
      fileName: fileName,
      url: url
    });
  } catch (error) {
    console.error('上传音乐失败:', error);
    res.status(500).json({ success: false, error: '上传失败，请重试' });
  }
}

async function deleteMusic(req, res) {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const db = getDb();
    const song = db.prepare('SELECT * FROM music WHERE id = ?').get(id);
    
    if (!song) {
      return res.status(404).json({ success: false, error: '未找到该音乐' });
    }

    if (song.user_id !== user.id && user.is_admin !== 1) {
      return res.status(403).json({ success: false, error: '无权删除该音乐' });
    }

    const fileName = path.basename(song.filename);
    const filePath = path.join(song.is_exclusive ? EXCLUSIVE_MUSIC_DIR : MUSIC_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    db.prepare('DELETE FROM music WHERE id = ?').run(id);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除音乐失败:', error);
    res.status(500).json({ success: false, error: '删除失败' });
  }
}

async function getUploadedSongs(req, res) {
  const user = req.user;
  try {
    const db = getDb();
    const songs = db.prepare('SELECT * FROM music WHERE user_id = ? AND is_exclusive = 0').all(user.id);
    
    const formattedSongs = songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: '--:--',
      cover: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=music%20album%20cover%20art&image_size=square`,
      url: song.url,
      local: true
    }));

    res.json({
      success: true,
      songs: formattedSongs,
      total: formattedSongs.length
    });
  } catch (error) {
    console.error('获取上传音乐失败:', error);
    res.status(500).json({ success: false, error: '获取失败' });
  }
}

async function getExclusiveSongs(req, res) {
  try {
    const db = getDb();
    const songs = db.prepare('SELECT * FROM music WHERE is_exclusive = 1').all();
    
    const formattedSongs = songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: '专属音乐',
      album: '专属歌单',
      duration: '--:--',
      cover: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=exclusive%20music%20album%20cover%20golden%20premium&image_size=square`,
      url: song.url,
      local: true,
      exclusive: true
    }));

    res.json({
      success: true,
      songs: formattedSongs,
      total: formattedSongs.length
    });
  } catch (error) {
    console.error('获取专属音乐失败:', error);
    res.status(500).json({ success: false, error: '获取失败' });
  }
}

async function uploadExclusiveMusic(req, res) {
  try {
    const user = req.user;

    if (!req.file) {
      return res.status(400).json({ success: false, error: '请选择要上传的音乐文件' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    
    const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma', '.ape'];
    
    if (!supportedFormats.includes(ext)) {
      return res.status(400).json({ success: false, error: `不支持的文件格式。支持的格式：${supportedFormats.join(', ')}` });
    }

    const fileName = file.filename;
    const title = path.basename(file.originalname, ext).replace(/_/g, ' ');
    const url = `/uploads/exclusive_music/${encodeURIComponent(fileName)}`;
    
    const db = getDb();
    const stmt = db.prepare('INSERT INTO music (user_id, title, artist, album, url, filename, is_exclusive) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(user.id, title, '专属音乐', '专属歌单', url, fileName, 1);
    
    res.json({
      success: true,
      message: '专属音乐上传成功',
      fileName: fileName,
      url: url
    });
  } catch (error) {
    console.error('上传专属音乐失败:', error);
    res.status(500).json({ success: false, error: '上传失败，请重试' });
  }
}

async function deleteExclusiveMusic(req, res) {
  const { id } = req.params;
  const user = req.user;
  
  try {
    const db = getDb();
    const song = db.prepare('SELECT * FROM music WHERE id = ? AND is_exclusive = 1').get(id);
    
    if (!song) {
      return res.status(404).json({ success: false, error: '未找到该音乐' });
    }

    const fileName = path.basename(song.filename);
    const filePath = path.join(EXCLUSIVE_MUSIC_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    db.prepare('DELETE FROM music WHERE id = ?').run(id);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除专属音乐失败:', error);
    res.status(500).json({ success: false, error: '删除失败' });
  }
}

module.exports = { searchMusic, getRecommendations, uploadMusic, deleteMusic, getUploadedSongs, getExclusiveSongs, uploadExclusiveMusic, deleteExclusiveMusic };
