# Voice of Inclusion 🗣️🇮🇳

**Voice of Inclusion** is a Chrome browser extension that breaks down language barriers on the web. It allows users to select any text on a webpage, translate it into their preferred Indian language, and listen to it being read aloud using natural-sounding AI voices.

Powered by **Sarvam AI**'s state-of-the-art models:
-   **Mayura**: For accurate translation to Indian languages.
-   **Bulbul (v3)**: For high-quality, emotionally rich text-to-speech.

## ✨ Features

-   **"Speak" Button**: Automatically appears when you select text.
-   **Multi-Language Support**: Translate to Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Odia, Punjabi, and Gujarati.
-   **Natural Voice**: Uses the "Aditya" voice profile for clear and engaging playback.
-   **Slow Mode**: Toggle a 0.8x speed mode for easier listening.
-   **Dark Mode Friendly**: Clean, modern UI that adapts to the web.

## 🛠️ Tech Stack

-   **Frontend**: Vanilla JavaScript, CSS, HTML
-   **Build Tool**: [Vite](https://vitejs.dev/) (Library Mode)
-   **AI Engine**: [Sarvam AI SDK](https://www.sarvam.ai/)
-   **Platform**: Chrome Extension (Manifest V3)

## 🚀 Getting Started

### Prerequisites

-   Node.js installed on your machine.
-   A Sarvam AI API API Key (Get one at [sarvam.ai](https://dashboard.sarvam.ai/)).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/harishkotra/voice-of-inclusion.git
    cd voice-of-inclusion
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Open `src/background.js` and replace `API_KEY_HERE` with your actual Sarvam AI API key.
    ```javascript
    // src/background.js
    const API_KEY = "YOUR_SARVAM_API_KEY";
    ```
    *> **Note**: For a production extension, you should move this logic to a backend proxy to keep your API key secure.*

4.  **Build the Extension**
    ```bash
    npm run build
    ```
    This will generate a `dist` folder containing the compiled extension.

5.  **Load in Chrome**
    -   Open Chrome and go to `chrome://extensions`.
    -   Enable **Developer mode** (top right).
    -   Click **Load unpacked**.
    -   Select the `dist` folder from your project directory.

## 📖 Usage

1.  **Pin** the extension icon to your browser toolbar.
2.  **Highlight** any text on a webpage.
3.  Click the floating **"Speak"** button.
4.  Listen as the text is translated and read aloud!
5.  Click the extension icon to change the **Target Language** or enable **Slow Mode**.