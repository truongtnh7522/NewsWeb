// articlesRoutes
const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const CategoryController = require('../controllers/CategoryController');
const UserArticleController = require('../controllers/UserArticleController');
const AuthController=require('../controllers/AuthController');
const UserController=require('../controllers/UserController');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || '';

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
  }

  jwt.verify(token, 'asadsfsdfxcv232142335', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }

    req.user = decoded.user;
    req.token = token;
    // console.log(token);
    next();
  });
};
const checkAdminRole = (req, res, next) => {
  // Kiểm tra xem user có vai trò admin không
  if (req.user.roles !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
  }

  // Nếu user có vai trò admin, chuyển sang middleware tiếp theo
  next();
};





const articleController = new ArticleController();
const categoryController = new CategoryController();
const userArticleController = new UserArticleController();
const userController=new UserController()
router.get('/search', authenticateToken, checkAdminRole, articleController.searchArticles);
router.get('/', authenticateToken, checkAdminRole, articleController.getAllArticles);
router.get('/find/:id', authenticateToken, checkAdminRole,articleController.getArticleById);
router.get('/createform', authenticateToken,checkAdminRole, articleController.showCreateForm);
router.post('/create', authenticateToken, checkAdminRole,articleController.createArticle);
router.post('/update/:id', authenticateToken,checkAdminRole, articleController.updateArticle);
router.get('/updateform/:id', authenticateToken,checkAdminRole, articleController.showUpdateForm);
router.post('/delete/:id', authenticateToken,checkAdminRole, articleController.deleteArticle);


router.get('/categories/search', authenticateToken,checkAdminRole, categoryController.searchCategories);
router.get('/categories', authenticateToken,checkAdminRole, categoryController.getAllCategories);
router.get('/categories/createform', authenticateToken, checkAdminRole,categoryController.showCreateForm);
router.post('/categories/create', authenticateToken,checkAdminRole, categoryController.createCategory);
router.get('/categories/updateform/:id', authenticateToken,checkAdminRole, categoryController.showUpdateForm);
router.post('/categories/update/:id', authenticateToken,checkAdminRole, categoryController.updateCategory);
router.post('/categories/delete/:id', authenticateToken,checkAdminRole, categoryController.deleteCategory);

router.get('/userlist/search', authenticateToken,checkAdminRole, userController.searchUsers);
router.get('/userlist', authenticateToken,checkAdminRole, userController.getAllUsers);
router.get('/userlist/find/:id', authenticateToken, checkAdminRole,userController.getUserById);
router.get('/usercreate/createform', authenticateToken, checkAdminRole,userController.createForm);
router.post('/usercreate/create', authenticateToken,checkAdminRole, userController.createUser);
router.get('/userupdate/updateform/:id', authenticateToken,checkAdminRole, userController.updateForm);
router.post('/userupdate/update/:id', authenticateToken,checkAdminRole, userController.updateUser);
router.post('/userdelete/delete/:id', authenticateToken,checkAdminRole, userController.deleteUser);


router.get('/user/search', authenticateToken,userArticleController.searchArticles);
router.get('/user/home/contact',  userArticleController.showContactNoAuth);
router.get('/user/home',  userArticleController.getAllArticlesNoAuth);
router.get('/user/home/category/:categoryId',  userArticleController.getArticlesByCategoryNoAuth);
router.get('/user/', authenticateToken, userArticleController.getAllArticles);
router.get('/user/contact', authenticateToken, userArticleController.showContact);
router.get('/user/find/:id', authenticateToken, userArticleController.getArticleById);
router.get('/user/category/:categoryId', authenticateToken, userArticleController.getArticlesByCategory);
// Thay đổi trạng thái người dùng
router.post('/user/deletepersonuser', AuthController.deletepersonuser);
module.exports = router;
