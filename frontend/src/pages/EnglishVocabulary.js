import AudioButton from "../components/AudioButton";

function EnglishVocabulary() {

  const words = [
    { word: "Apple", meaning: "A fruit that is red, green, or yellow.", audio: "/assets/audio/apple.mp3" },
    { word: "Book", meaning: "A set of written pages.", audio: "/assets/audio/book.mp3" },
    { word: "Water", meaning: "A clear liquid essential for life.", audio: "/assets/audio/water.mp3" },
    { word: "Happy", meaning: "Feeling good or joyful.", audio: "/assets/audio/happy.mp3" },
    { word: "Run", meaning: "To move fast on foot.", audio: "/assets/audio/run.mp3" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>English Basic Vocabulary</h2>

      {words.map((item, index) => (
        <div 
          key={index} 
          style={{
            marginBottom: 15,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        >
          <h3>{item.word}</h3>
          <p>{item.meaning}</p>

          {/* Audio Button */}
          <AudioButton audioSrc={item.audio} />
        </div>
      ))}

    </div>
  );
}

export default EnglishVocabulary;
