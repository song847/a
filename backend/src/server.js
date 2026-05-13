const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { initDb } = require('./db');
const { register, login, changeUsername } = require('./auth');
const { getPlans, addPlan, deletePlan } = require('./plans');
const { searchUser, sendFriendRequest, acceptFriendRequest, getFriends, getFriendRequests, deleteFriend } = require('./social');
const { createPost, getPosts, deletePost } = require('./posts');
const { sendMessage, getMessages } = require('./messages');
const { getAllUsers, deleteUser, updateUser, createAdmin } = require('./admin');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');
const { getWeather } = require('./weather');
const { createNestItem, getNestItems, deleteNestItem } = require('./nest');
const { webSearch } = require('./search');
const { searchMusic, getRecommendations, uploadMusic, deleteMusic, getUploadedSongs, getExclusiveSongs, uploadExclusiveMusic, deleteExclusiveMusic } = require('./music');
const { uploadClothes, getWardrobeItems, deleteWardrobeItem, recommendMatches, smartRecommend, updateWardrobeItem, getCategories } = require('./wardrobe');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_DIR = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

const wardrobeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_DIR, 'wardrobe'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const wardrobeUpload = multer({ storage: wardrobeStorage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_DIR, 'music'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const musicUpload = multer({ storage: musicStorage, limits: { fileSize: 100 * 1024 * 1024 } });

const exclusiveMusicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(UPLOAD_DIR, 'exclusive_music'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const exclusiveMusicUpload = multer({ storage: exclusiveMusicStorage, limits: { fileSize: 100 * 1024 * 1024 } });

app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/change_username', authMiddleware, changeUsername);

app.get('/api/plans', authMiddleware, getPlans);
app.post('/api/plans', authMiddleware, addPlan);
app.delete('/api/plans/:id', authMiddleware, deletePlan);

app.get('/api/users/search', authMiddleware, searchUser);
app.post('/api/friends/request', authMiddleware, sendFriendRequest);
app.post('/api/friends/accept', authMiddleware, acceptFriendRequest);
app.get('/api/friends', authMiddleware, getFriends);
app.get('/api/friends/requests', authMiddleware, getFriendRequests);
app.delete('/api/friends', authMiddleware, deleteFriend);

app.post('/api/upload', authMiddleware, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  const mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`,
    type: mediaType,
    filename: req.file.filename
  });
});

app.post('/api/posts', authMiddleware, createPost);
app.get('/api/posts', authMiddleware, getPosts);
app.delete('/api/posts/:id', authMiddleware, deletePost);

app.post('/api/messages', authMiddleware, sendMessage);
app.get('/api/messages', authMiddleware, getMessages);

app.get('/api/admin/users', adminMiddleware, getAllUsers);
app.delete('/api/admin/users', adminMiddleware, deleteUser);
app.put('/api/admin/users', adminMiddleware, updateUser);
app.post('/api/admin/create', createAdmin);

app.get('/api/weather', getWeather);

app.post('/api/nest', createNestItem);
app.get('/api/nest', getNestItems);
app.delete('/api/nest/:id', deleteNestItem);

app.get('/api/search', webSearch);

app.get('/api/music/search', authMiddleware, searchMusic);
app.get('/api/music/recommend', authMiddleware, getRecommendations);
app.get('/api/music/uploaded', authMiddleware, getUploadedSongs);
app.post('/api/music/upload', authMiddleware, musicUpload.single('file'), uploadMusic);
app.delete('/api/music/:id', authMiddleware, deleteMusic);
app.get('/api/music/exclusive', authMiddleware, getExclusiveSongs);
app.post('/api/music/exclusive/upload', adminMiddleware, exclusiveMusicUpload.single('file'), uploadExclusiveMusic);
app.delete('/api/music/exclusive/:id', adminMiddleware, deleteExclusiveMusic);

app.get('/api/wardrobe', getWardrobeItems);
app.post('/api/wardrobe', wardrobeUpload.single('image'), uploadClothes);
app.delete('/api/wardrobe/:id', deleteWardrobeItem);
app.get('/api/wardrobe/match', recommendMatches);
app.get('/api/wardrobe/smart', smartRecommend);
app.put('/api/wardrobe/:id', updateWardrobeItem);
app.get('/api/wardrobe/categories', getCategories);

app.use('/uploads', express.static(UPLOAD_DIR));

let serverInstance;

function startServer(port = 3000, callback) {
  serverInstance = app.listen(port, () => {
    if (callback) callback();
  });
}

function stopServer(callback) {
  if (serverInstance) {
    serverInstance.close(callback);
  } else if (callback) {
    callback();
  }
}

if (require.main === module) {
  initDb('./database.sqlite', () => {
    startServer(3000, () => {
      console.log('Server running on port 3000');
    });
  });
}

module.exports = { app, startServer, stopServer };
