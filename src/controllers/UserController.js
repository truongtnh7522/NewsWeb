const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const UserService = require('../services/userService');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'tnhtruong',
  api_key: '261627223154633',
  api_secret: '1nk5sLRM5OECFuK8UgjzhDFRXIE'
});

class UserController {
  constructor() {
    this.userService = new UserService();
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
  }

  async searchUsers(req, res) {
    try {
      const { q } = req.query;
      const users = await this.userService.searchUsers(q);
      const user = req.user;

      res.render('users/index', { users, user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      const user = req.user;
      res.render('users/index', { users ,user});
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.render('users/show', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async createUser(req, res) {
    try {
      const { name, address, sdt, email, password, roles, status } = req.body;
      const image = req.file; // Assuming you're using multer to handle file uploads

      await this.userService.createUser(
        name,
        address,
        sdt,
        email,
        password,
        roles,
        status,
        image
      );

      res.redirect('/articles/userlist');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, address, sdt, email, password, roles, status } = req.body;
      const image = req.file; // Assuming you're using multer to handle file uploads

      await this.userService.updateUser(
        id,
        name,
        address,
        sdt,
        email,
        password,
        roles,
        status,
        image
      );

      res.redirect('/articles/userlist');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await this.userService.deleteUser(id);

      res.redirect('/articles/userlist');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async createForm(req, res) {
    res.render('users/create');
  }

  async updateForm(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send('Invalid user ID');
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }

      res.render('users/update', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = UserController;
