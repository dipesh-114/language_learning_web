// frontend/src/utils/speech.js
export const speakJapanese = (text) => {
  if (!text) return;
  const isJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = isJapanese ? "ja-JP" : "en-US";
  utter.rate = 1;
  utter.pitch = 1;
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.warn("Speech API error:", e);
  }
};
