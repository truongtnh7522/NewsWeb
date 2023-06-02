const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'tnhtruong',
  api_key: '261627223154633',
  api_secret: '1nk5sLRM5OECFuK8UgjzhDFRXIE'
});

class UserService {
  async searchUsers(q) {
    try {
      const users = await User.find({ name: { $regex: q, $options: 'i' } });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid user ID');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(name, address, sdt, email, password, roles, status, image) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, name, address, sdt, email, password, roles, status, image) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid user ID');
      }
  
      let updatedUser = await User.findById(id);
      if (!updatedUser) {
        throw new Error('User not found');
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

      return updatedUser; // Optionally, you can return the updated user if needed
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid user ID');
      }

      const deletedUser = await User.findByIdAndRemove(id);
      if (!deletedUser) {
        throw new Error('User not found');
      }

      // Delete the user's image from Cloudinary
      await cloudinary.uploader.destroy(deletedUser.image);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
