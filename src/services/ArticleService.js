const Article = require('../models/Article');

class ArticleService {
  async getArticlesByCategory(categoryId) {
    try {
      const articles = await Article.find({ category: categoryId }).populate('category');
      return articles;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }
  
  async getAllArticles() {
    try {
      const articles = await Article.find().populate('category');
      return articles;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }
  

  async getArticleById(id) {
    try {
      const article = await Article.findById(id);
      return article;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async createArticle(title, content, author, categoryId, description, imageUrl) {
    try {
      const article = new Article({
        title,
        content,
        author,
        category: categoryId,
        description,
        imageUrl // Lưu URL của file ảnh vào trong bài viết
      });

      await article.save();
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async updateArticle(id, title, content, author, categoryId, description, imageUrl) {
    try {
      const article = await Article.findById(id);
      if (!article) {
        throw new Error('Article not found');
      }

      article.title = title;
      article.content = content;
      article.author = author;
      article.category = categoryId;
      article.description = description;
      article.imageUrl = imageUrl; // Lưu URL của file ảnh mới vào trong bài viết

      await article.save();
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async deleteArticle(id) {
    try {
      await Article.deleteOne({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }
}

module.exports = ArticleService;
