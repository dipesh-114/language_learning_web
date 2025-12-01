import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnglishVocabulary from "./pages/EnglishVocabulary";
import Hiragana from "./pages/Hiragana";

// Import Pages
import Home from "./pages/Home";
import English from "./pages/English";
import Japanese from "./pages/Japanese";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/english" element={<English />} />
        <Route path="/japanese" element={<Japanese />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />

        {/* Lesson routes */}
        <Route path="/english/vocabulary" element={<EnglishVocabulary />} />
        <Route path="/japanese/hiragana" element={<Hiragana />} />

      </Routes>
    </Router>
  );
}

export default App;
