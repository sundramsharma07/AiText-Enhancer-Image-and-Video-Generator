import OpenAI from 'openai';

let pollinationClient;

const initPollination = () => {
    if (!pollinationClient) {
        const apiKey = process.env.POLLINATIONS_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ POLLINATIONS_API_KEY is not set in environment variables. AI features may be limited or use free public tier.");
        }
        pollinationClient = new OpenAI({
            baseURL: 'https://gen.pollinations.ai/v1',
            apiKey: apiKey || 'no-key-required-for-free-tier',
        });
    }
    return pollinationClient;
};

/**
 * Extracts text from an image and enhances it using Pollinations Vision capable models.
 * @param {Buffer} imageBuffer - The image data as a buffer.
 * @param {string} mimeType - The mime type of the image (e.g., "image/jpeg").
 * @param {string} tone - The desired tone for enhancement.
 * @returns {Promise<{ extractedText: string, enhancedText: string }>}
 */
export const processHandwriting = async (imageBuffer, mimeType, tone = 'Professional') => {
    // ---- MOCK FOR UI TESTING ----
    if (!process.env.POLLINATIONS_API_KEY || process.env.POLLINATIONS_API_KEY === 'your_pollinations_api_key_here') {
        console.log("Using Mock AI Response for processHandwriting because real API key is missing.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            extractedText: "This is a mock extraction from Pollinations! The handwriting said: 'Hello from the other side!'",
            enhancedText: `This is a perfectly structured, ${tone} mock enhancement demonstrating the transition to Pollinations.`
        };
    }
    // -----------------------------

    try {
        const client = initPollination();
        const base64Image = imageBuffer.toString("base64");
        
        const promptInfo = `
        You are an expert OCR and text enhancement AI.
        1. Extract the handwritten text from this image as accurately as possible.
        2. Enhance and rewrite the extracted text to be grammatically correct, coherent, and in a '${tone}' tone. 
        
        Return the result EXACTLY following this JSON format:
        {
            "extractedText": "[The raw text you extracted]",
            "enhancedText": "[The polished, rewritten text in the requested tone]"
        }
        Do not include markdown code block formatting. Return raw JSON.
        `;

        const result = await client.chat.completions.create({
            model: "openai", // Pollinations proxy model names
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: promptInfo },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            temperature: 0.2
        });

        const responseText = result.choices[0]?.message?.content || "";
        console.log("Raw Pollinations Output:", responseText);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        let parsedResult;

        if (jsonMatch) {
            try {
                parsedResult = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                parsedResult = { extractedText: "Format Error", enhancedText: responseText };
            }
        } else {
            parsedResult = { extractedText: "Text Extracted", enhancedText: responseText };
        }

        return parsedResult;

    } catch (error) {
        console.error("Pollinations AI Service Error:", error);
        throw new Error(`Pollinations Error: ${error.message}`);
    }
};

/**
 * Enhances existing text without an image input using Pollinations.
 * @param {string} text - The input text.
 * @param {string} tone - The tone to apply.
 */
export const enhanceText = async (text, tone = 'Professional') => {
    if (!process.env.POLLINATIONS_API_KEY || process.env.POLLINATIONS_API_KEY === 'your_pollinations_api_key_here') {
        console.log("Using Mock AI Response for enhanceText.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `${text} -> [Pollinations Mock ${tone} Enhancement Applied!]`;
    }

    try {
        const client = initPollination();
        
        const prompt = `
        Rewrite and enhance the following text. 
        Fix grammar/spelling and apply a '${tone}' tone.
        Return ONLY the enhanced text.
        
        Original Text:
        """${text}"""
        `;

        const result = await client.chat.completions.create({
            model: "mistral", // Good for text tasks on Pollinations
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.5
        });

        return (result.choices[0]?.message?.content || "").trim();
    } catch (error) {
        console.error("Pollinations Enhancement Error:", error);
        throw new Error("Failed to enhance text via Pollinations.");
    }
};
