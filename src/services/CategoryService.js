const Category = require('../models/Category');

class CategoryService {
  async searchCategories(query) {
    const categories = await Category.find({ name: { $regex: String(query), $options: 'i' } }).exec();
    return categories;
  }
  async getAllCategories() {
    try {
      const categories = await Category.find();
      return categories;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async createCategory(name) {
    try {
      await Category.create({ name });
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async updateCategory(id, name) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      category.name = name;
      await category.save();
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      return category;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }

  async deleteCategory(id) {
    try {
      await Category.deleteOne({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error('Server Error');
    }
  }
}

module.exports = CategoryService;

