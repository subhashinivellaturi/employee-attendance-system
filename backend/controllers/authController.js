const User = require('../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Helper function to get token from user and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Exclude password for the returned user object
    const { password, ...userData } = user.toObject(); 

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(statusCode).json({ success: true, token, user: userData });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password, role, employeeId, department } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'employee', // Default to employee if role is not provided
            employeeId,
            department
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Registration failed. User ID or Email may already exist.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        // Select('+password') is needed because select: false is set in the model
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
             return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};