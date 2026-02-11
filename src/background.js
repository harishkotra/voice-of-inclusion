import { SarvamAIClient } from 'sarvamai';

// Initialize the Sarvam AI Client
// TODO: Replace with secure key handling or user input mechanism in production
const API_KEY = "API_KEY_HERE";

const client = new SarvamAIClient({
    apiSubscriptionKey: API_KEY
});

// Listener for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TRANSLATE_AND_SPEAK") {
        handleTranslateAndSpeak(request, sendResponse);
        return true; // Indicates we will send a response asynchronously
    }
});

async function handleTranslateAndSpeak(request, sendResponse) {
    try {
        const { text, targetLanguage, speed } = request;

        // 1. Translate Text (Mayura Model)
        // Using mode="code-mixed" as per "Pro Tip Logic"
        const translateResponse = await client.text.translate({
            input: text,
            source_language_code: "auto",
            target_language_code: targetLanguage,
            mode: "code-mixed",
            speaker_gender: "Male" // Default, not used for TTS but required by API sometimes? 
            // Docs say speaker_gender is for translation? Actually docs show it in example. 
            // Let's stick to the example: 
            // response = client.text.translate({ ..., speaker_gender="Male" })
        });

        const translatedText = translateResponse.translated_text;

        // 2. Text to Speech (Bulbul v3)
        // Using fetch directly to ensure model parameter is passed correctly and not dropped by SDK defaults
        const ttsResponse = await fetch("https://api.sarvam.ai/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": API_KEY
            },
            body: JSON.stringify({
                text: translatedText,
                target_language_code: targetLanguage,
                speaker: "aditya",
                pace: speed || 0.8,
                speech_sample_rate: 24000,
                enable_preprocessing: true,
                model: "bulbul:v3"
            })
        });

        if (!ttsResponse.ok) {
            const errorBody = await ttsResponse.text();
            throw new Error(`TTS API Error: ${ttsResponse.status} ${errorBody}`);
        }

        const ttsData = await ttsResponse.json();

        // formats: audios: ["base64"]
        let audioData = "";
        if (ttsData.audios && Array.isArray(ttsData.audios)) {
            audioData = ttsData.audios[0];
        } else {
            // Fallback/Safety
            console.warn("Unexpected TTS response format", ttsData);
            if (Array.isArray(ttsData) && ttsData.length > 0) audioData = ttsData[0];
        }

        sendResponse({ success: true, audio: audioData });

    } catch (error) {
        console.error("Error in background script:", error);
        sendResponse({ success: false, error: error.message });
    }
}
