// frontend/src/pages/Hiragana.js
import React from "react";
import AudioButton from "../components/AudioButton";

function Hiragana() {
  const hiraganaList = [
    { symbol: "あ", romaji: "a", audio: "/assets/audio/hiragana_a.mp3" },
    { symbol: "い", romaji: "i", audio: "/assets/audio/hiragana_i.mp3" },
    { symbol: "う", romaji: "u", audio: "/assets/audio/hiragana_u.mp3" },
    { symbol: "え", romaji: "e", audio: "/assets/audio/hiragana_e.mp3" },
    { symbol: "お", romaji: "o", audio: "/assets/audio/hiragana_o.mp3" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Hiragana Chart</h2>
      {hiraganaList.map((item, index) => (
        <div key={index} style={{ padding: 10, marginBottom: 10, border: "1px solid #ccc", borderRadius: 8 }}>
          <h3 style={{ fontSize: 36 }}>{item.symbol}</h3>
          <p>Romaji: {item.romaji}</p>
          <AudioButton audioSrc={item.audio} text={item.symbol} />
        </div>
      ))}
    </div>
  );
}

export default Hiragana;
