import express from 'express';
import users from '../models/userModel.js';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);  
        
        const user = new users({
            fullName,
            email,
            password: hashedPassword  // Changed this line
        });
        
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        
        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Add this line
        res.status(500).json({ message: error.message }); // Changed to send actual error
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