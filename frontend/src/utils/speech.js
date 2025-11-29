export const speakJapanese = (text) => {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 1;
  speechSynthesis.speak(utt);
};
