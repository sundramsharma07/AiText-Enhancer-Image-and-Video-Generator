import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        default: 'PEN AI Creator',
        trim: true,
        maxlength: 80
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

const showcasePostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    authorName: {
        type: String,
        default: 'PEN AI Creator',
        trim: true,
        maxlength: 80
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: 10000
    },
    prompt: {
        type: String,
        default: '',
        trim: true,
        maxlength: 10000
    },
    category: {
        type: String,
        enum: ['creator-lab', 'artisan-designs', 'shayari-generated', 'story-generated', 'poetry-generated'],
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'text', 'video', 'audio'],
        default: 'image'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    cloudinaryPublicId: {
        type: String,
        default: ''
    },
    comments: [commentSchema],
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['approved', 'blocked'],
        default: 'approved'
    }
}, { timestamps: true });

const ShowcasePost = mongoose.model('ShowcasePost', showcasePostSchema);

export default ShowcasePost;
