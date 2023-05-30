const CategoryService = require('../services/CategoryService');

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
    this.getAllCategories = this.getAllCategories.bind(this);
    this.showCreateForm = this.showCreateForm.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  async getAllCategories(req, res) {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.render('categories/index', { categories });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  showCreateForm(req, res) {
    res.render('categories/create');
  }

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      await this.categoryService.createCategory(name);
      res.redirect('/articles/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await this.categoryService.updateCategory(id, name);
      res.redirect('/articles/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async showUpdateForm(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).send('Category not found');
      }

      res.render('categories/update', { category });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      res.redirect('/articles/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = CategoryController;
