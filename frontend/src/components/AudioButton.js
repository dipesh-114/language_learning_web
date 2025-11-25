import React from "react";

function AudioButton({ audioSrc }) {
  const playSound = () => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  return (
    <button 
      onClick={playSound}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        background: "#1e88e5",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}
    >
      🔊 Play
    </button>
  );
}

export default AudioButton;
