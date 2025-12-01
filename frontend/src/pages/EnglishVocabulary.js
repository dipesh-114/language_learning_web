// frontend/src/pages/EnglishVocabulary.js
import React, { useEffect, useState } from "react";
import AudioButton from "../components/AudioButton";
import { getLessons } from "../api/api";

function EnglishVocabulary() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    getLessons().then(data => {
      // Filter english lessons if backend stores them with language key
      const english = data.filter(d => d.language === "English" || d.language === "english");
      if (english.length) setWords(english);
    }).catch(()=>{});
  }, []);

  // Fallback sample if no backend data
  const fallback = [
    { title: "Apple", text: "A fruit", audio_url: "" },
    { title: "Book", text: "Set of written pages", audio_url: "" }
  ];

  const list = words.length ? words : fallback;

  return (
    <div style={{ padding: 20 }}>
      <h2>English Basic Vocabulary</h2>
      {list.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 15, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
          <h3>{item.title || item.word}</h3>
          <p>{item.text || item.meaning}</p>
          <AudioButton audioSrc={item.audio_url || item.audio} text={item.title || item.word} />
        </div>
      ))}
    </div>
  );
}

export default EnglishVocabulary;
