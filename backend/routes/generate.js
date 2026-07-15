import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const POLLINATIONS_BASE = 'https://gen.pollinations.ai';

function pollinationsHeaders() {
    const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
    if (!apiKey || apiKey === 'your_pollinations_api_key_here') {
        const error = new Error('POLLINATIONS_API_KEY is not configured on the server.');
        error.status = 503;
        throw error;
    }
    return { Authorization: `Bearer ${apiKey}` };
}

function validDimension(value, fallback) {
    const dimension = Number.parseInt(value, 10);
    return Number.isInteger(dimension) && dimension >= 256 && dimension <= 2048
        ? dimension
        : fallback;
}

function timeoutSignal(milliseconds) {
    // Node 18+ supports AbortSignal.timeout. The fallback keeps the proxy usable
    // on older local Node installations too.
    if (typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(milliseconds);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), milliseconds).unref?.();
    return controller.signal;
}

async function sendBinaryGeneration(req, res, { kind, model, timeout }) {
    const { prompt } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required.' });

    const width = validDimension(req.body.width, 1024);
    const height = validDimension(req.body.height, 1024);
    const query = new URLSearchParams({
        model,
        width: String(width),
        height: String(height),
        seed: String(Math.floor(Math.random() * 1_000_000)),
    });
    const url = `${POLLINATIONS_BASE}/image/${encodeURIComponent(prompt.trim())}?${query}`;

    try {
        const upstream = await fetch(url, {
            headers: pollinationsHeaders(),
            signal: timeoutSignal(timeout),
        });

        if (!upstream.ok) {
            const details = (await upstream.text().catch(() => '')).slice(0, 300);
            console.error(`[Generate/${kind}] Pollinations returned ${upstream.status}: ${details}`);
            return res.status(upstream.status).json({
                error: `${kind} generation failed (Pollinations ${upstream.status}).`,
                details,
            });
        }

        const buffer = Buffer.from(await upstream.arrayBuffer());
        const contentType = upstream.headers.get('content-type') ||
            (kind === 'Video' ? 'video/mp4' : 'image/jpeg');
        res.set({
            'Content-Type': contentType,
            'Content-Length': buffer.length,
            'Cache-Control': 'no-store',
        }).send(buffer);
    } catch (error) {
        const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
        const status = error.status || (timedOut ? 504 : 502);
        console.error(`[Generate/${kind}] ${error.message}`);
        res.status(status).json({
            error: timedOut ? `${kind} generation timed out. Please try again.` : `${kind} generation failed.`,
            details: error.message,
        });
    }
}

// Pollinations serves both still images and videos through /image/{prompt};
// the selected model determines the returned media type.
router.post('/image', protect, (req, res) =>
    sendBinaryGeneration(req, res, { kind: 'Image', model: 'flux', timeout: 180_000 })
);

router.post('/video', protect, (req, res) =>
    sendBinaryGeneration(req, res, { kind: 'Video', model: 'ltx-2', timeout: 180_000 })
);

router.post('/audio', protect, async (req, res) => {
    const { prompt, voice = 'nova' } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required.' });

    const url = `${POLLINATIONS_BASE}/audio/${encodeURIComponent(prompt.trim())}?${new URLSearchParams({ voice })}`;
    try {
        const upstream = await fetch(url, { headers: pollinationsHeaders(), signal: timeoutSignal(90_000) });
        if (!upstream.ok) {
            const details = (await upstream.text().catch(() => '')).slice(0, 300);
            console.error(`[Generate/Audio] Pollinations returned ${upstream.status}: ${details}`);
            return res.status(upstream.status).json({ error: `Audio generation failed (Pollinations ${upstream.status}).`, details });
        }
        const buffer = Buffer.from(await upstream.arrayBuffer());
        res.set({
            'Content-Type': upstream.headers.get('content-type') || 'audio/mpeg',
            'Content-Length': buffer.length,
            'Cache-Control': 'no-store',
        }).send(buffer);
    } catch (error) {
        const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
        console.error(`[Generate/Audio] ${error.message}`);
        res.status(error.status || (timedOut ? 504 : 502)).json({
            error: timedOut ? 'Audio generation timed out. Please try again.' : 'Audio generation failed.',
            details: error.message,
        });
    }
});

router.post('/text', protect, async (req, res) => {
    const { prompt, system = 'You are a helpful assistant.', model = 'openai' } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt is required.' });

    const query = new URLSearchParams({ model, system: system.trim() });
    const url = `${POLLINATIONS_BASE}/text/${encodeURIComponent(prompt.trim())}?${query}`;
    try {
        const upstream = await fetch(url, { headers: pollinationsHeaders(), signal: timeoutSignal(90_000) });
        if (!upstream.ok) {
            const details = (await upstream.text().catch(() => '')).slice(0, 300);
            console.error(`[Generate/Text] Pollinations returned ${upstream.status}: ${details}`);
            return res.status(upstream.status).json({ error: `Text generation failed (Pollinations ${upstream.status}).`, details });
        }
        res.set('Cache-Control', 'no-store').send(await upstream.text());
    } catch (error) {
        const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
        console.error(`[Generate/Text] ${error.message}`);
        res.status(error.status || (timedOut ? 504 : 502)).json({
            error: timedOut ? 'Text generation timed out. Please try again.' : 'Text generation failed.',
            details: error.message,
        });
    }
});

export default router;
