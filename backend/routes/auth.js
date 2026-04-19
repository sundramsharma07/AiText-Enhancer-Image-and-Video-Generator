import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log(`Signup attempt for: ${email}`);
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`Signup failed: User ${email} already exists`);
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password
        });
        console.log(`User created successfully: ${user._id}`);

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`Login attempt for: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`Login failed: ${email} not found`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`Password match for ${email}: ${isMatch}`);

        if (isMatch) {
            console.log(`Login successful for ${email}`);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            console.log(`Login failed: Incorrect password for ${email}`);
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
