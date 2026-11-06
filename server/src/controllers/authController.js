import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { inMemoryUsers } from '../config/db.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'lead-management-secret', {
    expiresIn: '7d',
  });

const useMongo = () => mongoose.connection.readyState === 1;

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters long.' });
    }

    if (useMongo()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
      });

      return res.status(201).json({
        token: generateToken(user),
        user: formatUser(user),
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = inMemoryUsers.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: `mem-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.unshift(user);

    return res.status(201).json({
      token: generateToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (useMongo()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      return res.json({
        token: generateToken(user),
        user: formatUser(user),
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = inMemoryUsers.find((entry) => entry.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      token: generateToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (useMongo()) {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.json({ user: formatUser(user) });
    }

    const user = inMemoryUsers.find((entry) => entry._id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
