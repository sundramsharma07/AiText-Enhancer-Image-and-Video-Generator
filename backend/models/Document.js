import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Setting to false initially so anonymous users can test MVP
    },
    title: {
        type: String,
        default: 'Untitled Document'
    },
    originalText: {
        type: String,
        required: true
    },
    enhancedText: {
        type: String,
        required: true
    },
    toneUsed: {
        type: String,
        default: 'Professional'
    }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export default Document;
