import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY;
const POLLINATIONS_BASE    = 'https://gen.pollinations.ai';

/**
 * POST /api/generate/image
 * Body: { prompt: string, width?: number, height?: number }
 *
 * Proxies to Pollinations image API and forwards the binary response.
 * The sk_ API key never leaves the server.
 */
router.post('/image', protect, async (req, res) => {
    const { prompt, width = 1024, height = 1024 } = req.body;

    if (!prompt?.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed          = Math.floor(Math.random() * 999999);
    const url           = `${POLLINATIONS_BASE}/image/${encodedPrompt}?model=flux&width=${width}&height=${height}&enhance=true&seed=${seed}`;

    console.log(`[Generate/Image] → ${url}`);

    try {
        const upstream = await fetch(url, {
            headers: { 'Authorization': `Bearer ${POLLINATIONS_API_KEY}` },
            signal:  AbortSignal.timeout(90_000), // 90-second hard limit
        });

        if (!upstream.ok) {
            const text = await upstream.text().catch(() => '');
            console.error(`[Generate/Image] Upstream ${upstream.status}: ${text.slice(0, 200)}`);
            return res.status(upstream.status).json({
                error: `Image generation failed (upstream ${upstream.status}).`,
                details: text.slice(0, 200),
            });
        }

        // Buffer the entire response, then send it in one shot.
        // This is simpler and avoids Web-Streams compatibility edge cases.
        const buffer      = Buffer.from(await upstream.arrayBuffer());
        const contentType = upstream.headers.get('content-type') || 'image/jpeg';

        console.log(`[Generate/Image] OK — ${contentType}, ${buffer.length} bytes`);

        res.setHeader('Content-Type',   contentType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control',  'no-store');
        res.send(buffer);

    } catch (err) {
        if (err.name === 'TimeoutError') {
            console.error('[Generate/Image] Request timed out after 90s.');
            return res.status(504).json({ error: 'Image generation timed out. Please try again.' });
        }
        console.error('[Generate/Image] Unexpected error:', err.message);
        res.status(500).json({ error: 'Image generation failed.', details: err.message });
    }
});

/**
 * POST /api/generate/audio
 * Body: { prompt: string, voice?: string }
 */
router.post('/audio', protect, async (req, res) => {
    const { prompt, voice = 'nova' } = req.body;

    if (!prompt?.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const url           = `${POLLINATIONS_BASE}/audio/${encodedPrompt}?model=elevenlabs&voice=${voice}`;

    console.log(`[Generate/Audio] → ${url}`);

    try {
        const upstream = await fetch(url, {
            headers: { 'Authorization': `Bearer ${POLLINATIONS_API_KEY}` },
            signal:  AbortSignal.timeout(30_000),
        });

        if (!upstream.ok) {
            const text = await upstream.text().catch(() => '');
            console.error(`[Generate/Audio] Upstream ${upstream.status}: ${text.slice(0, 200)}`);
            return res.status(upstream.status).json({
                error: `Audio generation failed (upstream ${upstream.status}).`,
                details: text.slice(0, 200),
            });
        }

        const buffer      = Buffer.from(await upstream.arrayBuffer());
        const contentType = upstream.headers.get('content-type') || 'audio/mpeg';

        console.log(`[Generate/Audio] OK — ${contentType}, ${buffer.length} bytes`);

        res.setHeader('Content-Type',   contentType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control',  'no-store');
        res.send(buffer);

    } catch (err) {
        if (err.name === 'TimeoutError') {
            console.error('[Generate/Audio] Request timed out.');
            return res.status(504).json({ error: 'Audio generation timed out.' });
        }
        console.error('[Generate/Audio] Error:', err.message);
        res.status(500).json({ error: 'Audio generation failed.', details: err.message });
    }
});

export default router;
