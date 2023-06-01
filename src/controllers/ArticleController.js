const mongoose = require('mongoose');
const Category = require('../models/Category');
const ArticleService = require('../services/ArticleService');
const Article = require('../models/Article'); // Add this line
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const CategoryService = require("../services/CategoryService");

// Khởi tạo Cloudinary
cloudinary.config({
  cloud_name: 'tnhtruong',
  api_key: '261627223154633',
  api_secret: '1nk5sLRM5OECFuK8UgjzhDFRXIE'
});

// Khởi tạo Multer để xử lý upload file
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm để lưu file trước khi upload lên Cloudinary

class ArticleController {
  constructor() {
    this.articleService = new ArticleService();
    this.categoryService = new CategoryService();
    this.getAllArticles = this.getAllArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
    this.createArticle = this.createArticle.bind(this);
    this.showCreateForm = this.showCreateForm.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.searchArticles = this.searchArticles.bind(this);
  }
  async searchArticles(req, res) {
    try {
      const { q } = req.query;
      const articles = await this.articleService.searchArticles(q);
      const categories = await this.categoryService.getAllCategories();
      const user = req.user;
  
      res.render('articles/index', { articles, categories, user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  async getAllArticles(req, res) {
    try {
      const articles = await this.articleService.getAllArticles();
      const user = req.user; // Lấy thông tin người dùng từ req
      res.render('articles/index', { articles,user });
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
      if (!article) {
        return res.status(404).send('Article not found');
      }

      res.render('articles/show', { article });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async createArticle(req, res) {
    try {
      const { title, content, author, categoryId, description } = req.body;

      // Kiểm tra xem có file ảnh được upload không
      if (!req.file) {
        return res.status(400).send('Missing required parameter - file');
      }


      // Upload file ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'MauThietKe' // Thư mục lưu file ảnh trong Cloudinary
      });

      // Lấy URL của file ảnh từ kết quả upload trên Cloudinary
      const imageUrl = result.secure_url;

      // Tạo bài viết
      await this.articleService.createArticle(title, content, author, categoryId, description, imageUrl);

      res.redirect('/articles');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async showCreateForm(req, res) {
    try {
      const categories = await Category.find();
      res.render('articles/create', { categories });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const { title, content, author, categoryId, description } = req.body;
  
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid article ID');
      }
  
      const article = await this.articleService.getArticleById(id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
  
      let imageUrl = article.imageUrl; // Keep the URL of the current image
      let publicId = article.public_id; // Keep the public_id of the current image
  
      // Check if a new image file is uploaded
      if (req.file) {
        // Upload the new image file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'MauThietKe' // The folder to store the image file in Cloudinary
        });
  
        // Get the URL and public_id of the new image from the upload result in Cloudinary
        imageUrl = result.secure_url;
        publicId = result.public_id;
  
        // Delete the old image file from Cloudinary
        if (article.public_id) {
          await cloudinary.uploader.destroy(article.public_id);
        }
      }
  
      await this.articleService.updateArticle(id, title, content, author, categoryId, description, imageUrl, publicId);
      res.redirect('/articles');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  
  

  async showUpdateForm(req, res) {
    try {
      const { id } = req.params;
      const article = await this.articleService.getArticleById(id);
      if (!article) {
        return res.status(404).send('Article not found');
      }

      const categories = await Category.find();
      res.render('articles/update', { article, categories });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
  
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid article ID');
      }
      
  
      const article = await this.articleService.getArticleById(id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
  
      // Check if the article has an image
      if (article.imageUrl) {
        // Extract public_id from the image URL
        const imageUrlParts = article.imageUrl.split('/');
        const publicId = imageUrlParts[imageUrlParts.length - 1].split('.')[0];
  
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }
  
      // Delete the article from the database
      await this.articleService.deleteArticle(id);
  
      res.redirect('/articles');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  
}

module.exports = ArticleController;
