const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'tnhtruong',
  api_key: '261627223154633',
  api_secret: '1nk5sLRM5OECFuK8UgjzhDFRXIE'
});

exports.showRegistrationForm = (req, res) => {
  res.render('register', { error: null });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, address, sdt, email, password, status } = req.body; // Thêm trường status

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'MauThietKe'
    });
    const image = result.secure_url;

    const user = new User({ name, address, sdt, email, password, image, status }); // Thêm trường status
    await user.save();

    res.redirect('/loginform');
  } catch (error) {
    res.render('register', { error: error.message });
  }
};

exports.showLoginForm = (req, res) => {
  res.render('login', { error: null });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Thay đổi req.query thành req.body

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }
    if (!user.status) {
      throw new Error('Your account is inactive');
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    

    const token = jwt.sign({ user }, 'asadsfsdfxcv232142335');

    res.cookie('token', token, { httpOnly: true }); // Lưu token vào cookies


    let redirectTo = ''; // Mặc định chuyển hướng đến '/articles'

    if (user.roles === 'user') {
      redirectTo = '/articles/user'; // Nếu user không phải admin, chuyển hướng đến '/articles/user'
    } else if (user.roles === 'admin') {
      redirectTo = '/articles';
    }
    console.log(redirectTo)
    res.status(200).json({ redirectTo: redirectTo });
    req.user = user;
    // res.redirect(redirectTo); // Trả về URL đích chứ không phải đối tượng JSON



  } catch (error) {
    res.render('login', { error: error.message });
  }
};
exports.logoutUser = (req, res) => {
  res.clearCookie('token'); // Xóa token khỏi cookie
  res.redirect('/articles/user/home'); // Chuyển hướng về trang đăng nhập
};
exports.deletepersonuser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Tìm và cập nhật trạng thái của người dùng thành false
    const user = await User.findByIdAndUpdate(userId, { status: false }, { new: true });

    if (!user) {
      throw new Error('User not found');
    }

    // Xóa token khỏi cookie để đăng xuất người dùng
    res.clearCookie('token');

    // res.status(200).json({ message: 'User status changed to false and logged out', user });
    res.redirect('/articles/user/home')
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



