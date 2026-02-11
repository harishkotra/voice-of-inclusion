import './content.css';

// State
let selectedText = "";
let button = null;
let audio = null;

// Create the floating button
function createButton() {
    const btn = document.createElement('div');
    btn.id = 'sarvam-speak-btn';
    btn.innerHTML = `
    <div class="icon-container">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14C14.2091 14 16 12.2091 16 10V4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4V10C8 12.2091 9.79086 14 12 14Z" fill="white"/>
        <path d="M19 10V10.5C19 14.08 16.08 17 12.5 17H11.5C7.92 17 5 14.08 5 10.5V10" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 17V21M8 21H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <span class="btn-text">Speak</span>
  `;
    document.body.appendChild(btn);

    btn.addEventListener('click', handleButtonClick);
    return btn;
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
        selectedText = text;

        // Position the button near the selection
        if (!button) button = createButton();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        button.style.display = 'flex';
        button.style.top = `${window.scrollY + rect.bottom + 10}px`;
        button.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 40}px`;
    } else {
        if (button) button.style.display = 'none';
    }
});

// Handle text deselection (mousedown outside)
document.addEventListener('mousedown', (e) => {
    if (button && !button.contains(e.target)) {
        button.style.display = 'none';
    }
});


async function handleButtonClick() {
    if (!selectedText) return;

    // Visual Feedback: Loading
    const btnText = button.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = "Translating...";
    button.classList.add('loading');

    try {
        // Get settings
        const settings = await chrome.storage.local.get(['targetLanguage', 'slowMode']);
        const targetLanguage = settings.targetLanguage || 'hi-IN'; // Default Hindi
        const speed = settings.slowMode ? 0.8 : 1.0;

        // Send to background
        const response = await chrome.runtime.sendMessage({
            action: "TRANSLATE_AND_SPEAK",
            text: selectedText,
            targetLanguage: targetLanguage,
            speed: speed
        });

        if (response.success && response.audio) {
            btnText.textContent = "Playing...";
            playAudio(response.audio, () => {
                btnText.textContent = originalText;
                button.classList.remove('loading');
            });
        } else {
            throw new Error(response.error || "Unknown error");
        }

    } catch (err) {
        console.error("Translation failed:", err);
        btnText.textContent = "Error";
        setTimeout(() => {
            btnText.textContent = originalText;
            button.classList.remove('loading');
        }, 2000);
    }
}

function playAudio(base64Audio, onEnded) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    // Bulbul returns WAV usually. 
    audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    audio.play();

    audio.onended = onEnded;
}
