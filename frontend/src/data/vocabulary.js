const vocabularyList = [
  {
    id: 1,
    english: "Hello",
    japanese: "こんにちは",
    romaji: "Konnichiwa",
  },
  {
    id: 2,
    english: "Thank you",
    japanese: "ありがとう",
    romaji: "Arigatou",
  },
  {
    id: 3,
    english: "Yes",
    japanese: "はい",
    romaji: "Hai",
  },
  {
    id: 4,
    english: "No",
    japanese: "いいえ",
    romaji: "Iie",
  },
];

const speakJapanese = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  window.speechSynthesis.speak(utterance);
};

<Button onClick={() => speakJapanese(word.japanese)}>
  🔊 Hear Pronunciation
</Button>


export default vocabularyList;
