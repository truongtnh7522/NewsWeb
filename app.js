const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const { exec } = require('child_process');

// Sử dụng body-parser
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser= require('cookie-parser')
app.use(cookieParser());
const multer = require('multer');
const ArticleRoutes = require('./src/routes/articleRoutes');
const DatabaseSingleton = require('./src/utils/DatabaseSingleton');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

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
const UserRoutes = require('./src/routes/userRoutes');
app.use('/', UserRoutes);
// Routes
app.use('/articles', ArticleRoutes);

// Connect to MongoDB
DatabaseSingleton.connect();

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/articles/user/home`);
  console.log(`Seen API at http://localhost:${port}/api-docs`);
  exec(`http://localhost:${port}/api-docs`);
  exec(`http://localhost:${port}/articles/user/home`);
});
