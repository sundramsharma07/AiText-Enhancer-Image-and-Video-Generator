import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import ShowcasePost from '../models/ShowcasePost.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 12 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image uploads are allowed for showcase posts.'));
    }
});

const blockedTerms = [
    'nude',
    'nudity',
    'porn',
    'sex',
    'sexual',
    'explicit',
    'nsfw',
    'obscene',
    'vulgar',
    'rape',
    'minor sexual',
    'child sexual',
    'kill',
    'murder',
    'terrorist',
    'hate speech'
];

function hasUnsafeText(...values) {
    const text = values.filter(Boolean).join(' ').toLowerCase();
    return blockedTerms.some((term) => text.includes(term));
}

function configureCloudinary() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return false;
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });
    return true;
}

function uploadBufferToCloudinary(buffer, folder = 'pen-ai-showcase') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                moderation: 'manual',
                transformation: [
                    { quality: 'auto:good', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

router.get('/', async (req, res) => {
    try {
        const posts = await ShowcasePost.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .limit(80)
            .lean();
        res.json(posts);
    } catch (error) {
        console.error('Showcase fetch failed:', error);
        res.status(500).json({ error: 'Failed to fetch showcase posts.' });
    }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const {
            title,
            description = '',
            prompt = '',
            category,
            mediaType = 'image'
        } = req.body;

        if (!title?.trim() || !category?.trim()) {
            return res.status(400).json({ error: 'Title and category are required.' });
        }

        if (hasUnsafeText(title, description, prompt)) {
            return res.status(400).json({ error: 'This post appears unsafe or vulgar, so it cannot be published.' });
        }

        let imageUrl = '';
        let cloudinaryPublicId = '';

        if (req.file) {
            if (!configureCloudinary()) {
                return res.status(500).json({ error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.' });
            }

            const result = await uploadBufferToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            cloudinaryPublicId = result.public_id;
        }

        const post = await ShowcasePost.create({
            userId: req.user.id,
            authorName: req.user.name || req.user.email || 'PEN AI Creator',
            title: title.trim(),
            description: description.trim(),
            prompt: prompt.trim(),
            category,
            mediaType,
            imageUrl,
            cloudinaryPublicId
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Showcase publish failed:', error);
        res.status(500).json({ error: 'Failed to publish showcase post.', details: error.message });
    }
});

router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) return res.status(400).json({ error: 'Comment is required.' });
        if (hasUnsafeText(text)) {
            return res.status(400).json({ error: 'This comment appears unsafe or vulgar, so it cannot be posted.' });
        }

        const post = await ShowcasePost.findOne({ _id: req.params.id, status: 'approved' });
        if (!post) return res.status(404).json({ error: 'Showcase post not found.' });

        post.comments.push({
            userId: req.user.id,
            name: req.user.name || req.user.email || 'PEN AI Creator',
            text: text.trim()
        });

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Showcase comment failed:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});

export default router;
