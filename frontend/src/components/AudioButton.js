// frontend/src/components/AudioButton.js
import React from "react";

function AudioButton({ audioSrc, text }) {
  const speakText = () => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const isJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
    utter.lang = isJapanese ? "ja-JP" : "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  const playSound = () => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(() => speakText());
    } else {
      speakText();
    }
  };

  return (
    <button onClick={playSound} style={{ padding: "6px 12px", borderRadius: 6, background: "#F48FB1", color: "#fff", border: "none", cursor: "pointer" }}>
      🔊 Pronounce
    </button>
  );
}

export default AudioButton;
