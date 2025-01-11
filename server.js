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

const mongoURI = process.env.MONGO_URL;
console.log("Attempting to connect to MongoDB..."); // Add this
console.log("MongoDB URI exists:", !!mongoURI); // This will log true/false without exposing the actual URI

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // Add these to help with connection issues
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority'
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error details:', {
        name: err.name,
        message: err.message,
        code: err.code
    });
});