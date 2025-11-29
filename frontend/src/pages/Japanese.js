import LessonCard from "../components/LessonCard";
import { Link } from "react-router-dom";

function Japanese() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Japanese Lessons</h2>

      <Link to="/japanese/hiragana" style={{ textDecoration: "none" }}>
        <LessonCard title="Hiragana" description="Learn the basic Japanese script." />
      </Link>

      <LessonCard title="Katakana" description="Learn the script for foreign words." />

      <LessonCard title="Basic Vocabulary" description="Numbers, colors, animals, greetings." />

      <LessonCard title="Basic Phrases" description="Daily expressions like ありがとう (thank you)." />
    </div>
  );
}

export default Japanese;
