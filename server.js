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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("Error occurred while connecting to MongoDB:", error));