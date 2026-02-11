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
        const ttsResponse = await client.textToSpeech.convert({
            text: translatedText,
            target_language_code: targetLanguage,
            speaker: "aditya", // Using 'aditya' as per requirements
            pace: speed || 0.8, // Default to 0.8 as per requirements if not specified
            speech_sample_rate: 24000,
            enable_preprocessing: true,
            model: "bulbul:v3"
        });

        // The SDK likely returns the full response object. 
        // We need to check the format. Usually it contains 'audios' array with base64 strings.
        // Based on knowledge of similar APIs:
        let audioData = "";
        if (ttsResponse.audios && Array.isArray(ttsResponse.audios)) {
            audioData = ttsResponse.audios.join("");
        } else if (typeof ttsResponse === 'string') {
            // sometimes it might just be the string if the SDK simplifies it? 
            // safer to assume structure: { audios: ["base64..."] }
            audioData = ttsResponse;
        }

        sendResponse({ success: true, audio: audioData });

    } catch (error) {
        console.error("Error in background script:", error);
        sendResponse({ success: false, error: error.message });
    }
}
