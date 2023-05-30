const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Sử dụng body-parser
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser= require('cookie-parser')
app.use(cookieParser());
const multer = require('multer');
const ArticleRoutes = require('./routes/articleRoutes');
const DatabaseSingleton = require('./utils/DatabaseSingleton');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Multer middleware để xử lý upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục để lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.use(upload.single('image'));
const UserRoutes = require('./routes/userRoutes');
app.use('/', UserRoutes);
// Routes
app.use('/articles', ArticleRoutes);

// Connect to MongoDB
DatabaseSingleton.connect();

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:3000/articles/user/home`);
});
