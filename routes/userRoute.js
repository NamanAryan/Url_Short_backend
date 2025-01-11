import express from 'express';
import users from '../models/userModel.js';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In backend userRoute.js
router.post('/register', async (req, res) => {
    console.log("Register route hit");
    console.log("Request body:", req.body);
    try {
        const { fullName, email, password } = req.body;
        console.log("Destructured data:", { fullName, email }); // Don't log password

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        console.log("Salt generated");
        
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed");

        const user = new users({
            fullName,
            email,
            password: hashedPassword
        });
        console.log("User object created:", { fullName, email });

        await user.save();
        console.log("User saved to database");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        console.log("Token generated");

        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message 
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
          });

          res.status(200).json({ token, message: 'User logged in successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        
    }
});

export default router;