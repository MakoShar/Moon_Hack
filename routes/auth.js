const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Member = require('../models/Member');
const Manager = require('../models/Manager');
const auth = require('../middleware/auth');

// ✅ Register Route
router.post("/register", async (req, res) => {
    try {
        const { enrollmentNumber, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ enrollmentNumber, email, password: hashedPassword, role });
        await user.save();

        res.json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// Member Registration
router.post('/member/register',
    [
        body('enrollmentNumber').trim().notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { enrollmentNumber, email, password } = req.body;

            // Check if member already exists
            let member = await Member.findOne({ $or: [{ email }, { enrollmentNumber }] });
            if (member) {
                return res.status(400).json({ message: 'Member already exists' });
            }

            member = new Member({
                enrollmentNumber,
                email,
                password
            });

            await member.save();

            const token = jwt.sign(
                { userId: member._id, role: 'member' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Member Login
router.post('/member/login',
    [
        body('email').isEmail(),
        body('password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const member = await Member.findOne({ email });

            if (!member) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await member.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: member._id, role: 'member' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Manager Login
router.post('/manager/login',
    [
        body('email').isEmail(),
        body('password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const manager = await Manager.findOne({ email });

            if (!manager) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await manager.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: manager._id, role: 'manager' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Get Member Credits (Protected Route)
router.get('/member/credits', auth, async (req, res) => {
    try {
        console.log('Credits Request - User:', req.user);
        if (req.user.role !== 'member') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const member = await Member.findById(req.user.userId);
        console.log('Found Member:', member);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json({ credits: member.credits });
    } catch (err) {
        console.error('Credits Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update Member Credits (Manager Only)
router.put('/member/:memberId/credits', auth, async (req, res) => {
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { credits } = req.body;
        const member = await Member.findById(req.params.memberId);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        member.credits = credits;
        await member.save();

        res.json({ message: 'Credits updated successfully', credits: member.credits });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get member profile
router.get('/member/profile', auth, async (req, res) => {
    try {
        console.log('Profile Request - User:', req.user);
        const member = await Member.findById(req.user.userId).select('-password');
        console.log('Found Member:', member);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
