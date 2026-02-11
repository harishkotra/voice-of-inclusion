document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('language').addEventListener('change', saveOptions);
document.getElementById('slowMode').addEventListener('change', saveOptions);

function saveOptions() {
    const language = document.getElementById('language').value;
    const slowMode = document.getElementById('slowMode').checked;

    chrome.storage.local.set({
        targetLanguage: language,
        slowMode: slowMode
    }, () => {
        // Optional: show "Saved" feedback
        const status = document.getElementById('status');
        status.textContent = 'Settings saved.';
        setTimeout(() => {
            status.textContent = 'Settings saved automatically';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.local.get({
        targetLanguage: 'hi-IN',
        slowMode: false
    }, (items) => {
        document.getElementById('language').value = items.targetLanguage;
        document.getElementById('slowMode').checked = items.slowMode;
    });
}
