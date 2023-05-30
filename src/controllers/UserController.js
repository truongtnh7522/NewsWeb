const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose'); // Thêm dòng này
// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'tnhtruong',
    api_key: '261627223154633',
    api_secret: '1nk5sLRM5OECFuK8UgjzhDFRXIE'
  });

class UserController {
  constructor() {
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.render('users/index', { users }); // Render the user list template with the users data
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid user ID');
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render('users/show', { user }); // Render the user details template with the user data
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  

  async createUser(req, res) {
    try {
      const { name, address, sdt, email, password, roles, status } = req.body;
      const image = req.file; // Assuming you're using multer to handle file uploads
  
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'MauThietKe' // Folder name on Cloudinary
      });
  
      const newUser = new User({
        name,
        address,
        sdt,
        image: result.secure_url, // Store the secure URL of the uploaded image
        email,
        password,
        roles,
        status
      });
  
      await newUser.save();
      res.redirect('/articles/userlist'); // Redirect to the user list page
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
  
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid user ID');
      }
  
      let updatedUser = await User.findById(id);
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
  
      // If a new image is uploaded, delete the old image from Cloudinary and upload the new one
      if (image) {
        await cloudinary.uploader.destroy(updatedUser.image); // Delete the old image from Cloudinary
  
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'MauThietKe' // Folder name on Cloudinary
        });
  
        updatedUser.image = result.secure_url; // Update the secure URL of the uploaded image
      }
  
      // Update other user fields
      updatedUser.name = name;
      updatedUser.address = address;
      updatedUser.sdt = sdt;
      updatedUser.email = email;
      updatedUser.password = password;
      updatedUser.roles = roles;
      updatedUser.status = status;
  
      await updatedUser.save();
      res.redirect('/articles/userlist'); // Redirect to the user list page
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
  
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Invalid user ID');
      }
  
      const deletedUser = await User.findByIdAndRemove(id);
      if (!deletedUser) {
        return res.status(404).send('User not found');
      }
  
      // Delete the user's image from Cloudinary
      await cloudinary.uploader.destroy(deletedUser.image);
  
      res.redirect('/articles/userlist'); // Chuyển hướng đến trang danh sách người dùng
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  
  async createForm(req, res) {
    res.render('users/create'); // Render the create form template
  }

  async updateForm(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send('Invalid user ID');
    }

    User.findById(id)
      .then(user => {
        if (!user) {
          return res.status(404).send('User not found');
        }

        res.render('users/update', { user }); // Render the update form template with the user data
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Server Error');
      });
  }
}

module.exports = UserController;
