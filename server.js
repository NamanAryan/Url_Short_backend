import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

app.use(cors({
    origin: true,
  }));

app.get('/', (req, res) => {
    res.send("Status: Running");
});

import userRoute from './routes/userRoute.js';
import urlRoute from './routes/urlRoute.js';
app.use('/api/user', userRoute);
app.use('/api/url', urlRoute);
app.use('/', urlRoute); 

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Add this to handle connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});