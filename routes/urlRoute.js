import express from 'express';
import Url from '../models/urlModel.js';
const router = express.Router();
import protect from '../middleware/auth.js';
import shortId from 'shortid';

router.get('/urls', protect, async (req, res) => {
    try {
        console.log("Finding URLs for user:", req.user);
        const urls = await Url.find({ user: req.user });
        console.log("Found URLs:", urls);
        res.status(200).json(urls);
    } catch (error) {
        console.error("Find error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/shorten', protect, async (req, res) => {
    try {
        const { url } = req.body;
        const shortUrl = shortId.generate();
        
        console.log("Creating URL for user:", req.user);
        
        const newUrl = new Url({
            longUrl: url,
            shortUrl: shortUrl,
            user: req.user     
        });
        
        const savedUrl = await newUrl.save();
        console.log("Saved URL:", savedUrl);
        res.status(201).json(savedUrl);
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const url = await Url.findOne({ _id: req.params.id });
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        await Url.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.log('Delete error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        res.redirect(url.longUrl);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;