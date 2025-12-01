const vocabularyList = [
  {
    id: 1,
    english: "Hello",
    japanese: "こんにちは",
    romaji: "Konnichiwa",
    audio: "/assets/audio/hello.mp3",
  },
  {
    id: 2,
    english: "Thank you",
    japanese: "ありがとう",
    romaji: "Arigatou",
    audio: "/assets/audio/thankyou.mp3",
  },
  {
    id: 3,
    english: "Yes",
    japanese: "はい",
    romaji: "Hai",
    audio: "/assets/audio/yes.mp3",
  },
  {
    id: 4,
    english: "No",
    japanese: "いいえ",
    romaji: "Iie",
    audio: "/assets/audio/no.mp3",
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
