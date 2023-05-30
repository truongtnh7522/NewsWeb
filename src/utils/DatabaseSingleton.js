const mongoose = require('mongoose');

class DatabaseSingleton {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (!this.isConnected) {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-web', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        this.isConnected = true;
        console.log('Connected to MongoDB');
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

module.exports = new DatabaseSingleton();
