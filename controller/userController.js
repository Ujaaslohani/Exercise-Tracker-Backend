const User = require('../models/User');
const bcrypt = require('bcrypt');
const Counter = require('../models/Counter');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    let counter = await Counter.findOne({ name: 'userId' });
    if (!counter) {
      counter = new Counter({ name: 'userId', count: 1 });
      await counter.save();
    }

    const userId = counter.count;
    counter.count += 1;
    await counter.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
};

  

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};
  
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOneAndDelete({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const counter = await Counter.findOne({ name: 'userId' });
    if (counter) {
      counter.count -= 1;
      await counter.save();
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};


module.exports = { register, login, deleteUser };