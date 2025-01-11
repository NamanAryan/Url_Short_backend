import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    user: {
        type: String,  
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
}, {timestamps:true});

const Url = mongoose.model('Url', urlSchema);
export default Url;