import express from 'express';
import multer from 'multer';
import { processHandwriting, enhanceText } from '../services/aiService.js';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Route: Get user's document history
router.get('/documents', protect, async (req, res) => {
    try {
        const docs = await Document.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Route: Get real-time stats
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const docs = await Document.find({ userId });
        
        const totalDocs = docs.length;
        const totalWords = docs.reduce((acc, doc) => {
            const words = (doc.enhancedText || "").split(/\s+/).filter(w => w.length > 0).length;
            return acc + words;
        }, 0);
        
        // Mocking time saved as 15 mins per document for now
        const timeSaved = Math.round((totalDocs * 15) / 60 * 10) / 10;

        res.json({
            totalDocs,
            totalWords,
            timeSaved
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Setup Multer to store file in memory so we can easily pass it to Gemini as a Buffer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Route 1: Upload image -> Extract Text -> Enhance Text
router.post('/process-image', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided." });
        }

        const tone = req.body.tone || 'Professional';
        const buffer = req.file.buffer;
        const mimeType = req.file.mimetype;

        console.log(`Processing image upload (${req.file.originalname}). Target tone: ${tone}`);

        // TODO: In a real flow, emit socket events for "Processing started"
        
        const result = await processHandwriting(buffer, mimeType, tone);

        // Save to Database
        const newDoc = await Document.create({
            userId: req.user.id,
            originalText: result.extractedText,
            enhancedText: result.enhancedText,
            toneUsed: tone,
            title: req.file.originalname || 'New Enhancement'
        });

        res.json({
            success: true,
            extractedText: result.extractedText,
            enhancedText: result.enhancedText,
            documentId: newDoc._id
        });
    } catch (error) {
        console.error("API Error (/process-image):", error);
        res.status(500).json({ 
            error: "Failed to process image.", 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
    }
});

// Route 2: Enhance existing text directly
router.post('/enhance-text', protect, async (req, res) => {
    try {
        const { text, tone } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "No text provided." });
        }

        const targetTone = tone || 'Professional';
        console.log(`Enhancing text manually. Target tone: ${targetTone}`);

        const enhancedContext = await enhanceText(text, targetTone);

        // Save to Database
        const newDoc = await Document.create({
            userId: req.user.id,
            originalText: text,
            enhancedText: enhancedContext,
            toneUsed: targetTone,
            title: text.substring(0, 20) + (text.length > 20 ? '...' : '')
        });

        res.json({
            success: true,
            enhancedText: enhancedContext,
            documentId: newDoc._id
        });

    } catch (error) {
         console.error("API Error (/enhance-text):", error);
         res.status(500).json({ error: "Failed to enhance text.", details: error.message });
    }
});

// Route: Delete a single document
router.delete('/documents/:id', protect, async (req, res) => {
    try {
        const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!doc) {
            return res.status(404).json({ error: "Document not found." });
        }
        res.json({ success: true, message: "Document deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete document." });
    }
});

// Route: Expunge all documents (Bulk Delete)
router.delete('/documents-bulk', protect, async (req, res) => {
    try {
        await Document.deleteMany({ userId: req.user.id });
        res.json({ success: true, message: "All documents expunged successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to expunge documents." });
    }
});

export default router;
