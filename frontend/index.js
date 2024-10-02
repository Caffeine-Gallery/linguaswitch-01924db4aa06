import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const outputText = document.getElementById('outputText');
const translateBtn = document.getElementById('translateBtn');
const speakBtn = document.getElementById('speakBtn');
const historyList = document.getElementById('historyList');

let currentTranslation = '';

async function translateText() {
    const text = inputText.value;
    const lang = targetLanguage.value;
    
    if (text.trim() === '') {
        outputText.textContent = '';
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();
        currentTranslation = data.responseData.translatedText;
        outputText.textContent = currentTranslation;

        // Add translation to history
        await backend.addTranslation(text, currentTranslation, lang);
        updateHistory();
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation error occurred.';
    }
}

function speakTranslation() {
    if (currentTranslation) {
        const utterance = new SpeechSynthesisUtterance(currentTranslation);
        utterance.lang = targetLanguage.value;
        speechSynthesis.speak(utterance);
    }
}

async function updateHistory() {
    const translations = await backend.getTranslations();
    historyList.innerHTML = '';
    translations.forEach(translation => {
        const li = document.createElement('li');
        li.textContent = `${translation.original} -> ${translation.translated} (${translation.targetLanguage})`;
        historyList.appendChild(li);
    });
}

inputText.addEventListener('input', translateText);
targetLanguage.addEventListener('change', translateText);
translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakTranslation);

// Initial history update
updateHistory();
