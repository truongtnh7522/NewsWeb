const mongoose = require('mongoose');
const ArticleService = require('../services/ArticleService');
const Article = require('../models/Article');
const Category = require('../models/Category');
const CategoryService = require('../services/CategoryService');
class ArticleController {
  constructor() {
    this.articleService = new ArticleService();
    this.categoryService = new CategoryService();
    this.getAllArticles = this.getAllArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
    this.getArticlesByCategory=this.getArticlesByCategory.bind(this);    
    this.getAllArticlesNoAuth = this.getAllArticlesNoAuth.bind(this);
    this.getArticlesByCategoryNoAuth=this.getArticlesByCategoryNoAuth.bind(this);
    this.showContact=this.showContact.bind(this);
    this.showContactNoAuth=this.showContactNoAuth.bind(this);
    // Thêm vào constructor của ArticleController
this.searchArticles = this.searchArticles.bind(this);
  }
  async showContact(req, res) {
    try {
      const user = req.user;
      res.render('articles/contact',{ user });

    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  async showContactNoAuth(req, res) {
    try {
      const user = req.user;
      res.render('articles/contactnoauth',{ user });

    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  async searchArticles(req, res) {
    try {
      const { q } = req.query;
      const articles = await this.articleService.searchArticles(q);
      const categories = await this.categoryService.getAllCategories();
      const user = req.user;
  
      res.render('articles/userindex', { articles, categories, user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  
  async getAllArticles(req, res) {
    try {
      const articles = await this.articleService.getAllArticles();
      const categories = await this.categoryService.getAllCategories();
      const user = req.user; // Lấy thông tin người dùng từ req
      res.render('articles/userindex', { articles, categories,user }); // Pass both variables in a single object
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  async getArticleById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid article ID');
      }

      const article = await this.articleService.getArticleById(id);
      const categories = await this.categoryService.getAllCategories();
      const user = req.user; // Lấy thông tin người dùng từ req

      if (!article) {
        return res.status(404).send('Article not found');
      }

      res.render('articles/usershow', { article ,categories,user});
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  async getArticlesByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).send('Invalid category ID');
      }
  
      const articles = await this.articleService.getArticlesByCategory(categoryId);
      const categories = await this.categoryService.getAllCategories();
      const user = req.user; // Lấy thông tin người dùng từ req
  
      res.render('articles/userindex', { articles, categories, user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
 
  
  async getAllArticlesNoAuth(req, res) {
    try {
      const articles = await this.articleService.getAllArticles();
      const categories = await this.categoryService.getAllCategories();
      const user = req.user; // Get user information from req
      res.render('articles/userindexnoauth', { articles, categories, user }); // Pass all variables in a single object
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  async getArticlesByCategoryNoAuth(req, res) {
    try {
      const { categoryId } = req.params;
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).send('Invalid category ID');
      }
  
      const articles = await this.articleService.getArticlesByCategory(categoryId);
      const categories = await this.categoryService.getAllCategories();
      const user = req.user; // Get user information from req
  
      res.render('articles/userindexnoauth', { articles, categories, user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  
}

module.exports = ArticleController;
