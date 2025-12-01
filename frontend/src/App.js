// frontend/app.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import English from "./pages/English";
import Japanese from "./pages/Japanese";
import EnglishVocabulary from "./pages/EnglishVocabulary";
import Hiragana from "./pages/Hiragana";
import Vocabulary from "./pages/Vocabulary";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LessonDetail from "./pages/LessonDetail"; // created earlier in roadmap
import Dashboard from "./pages/Dashboard"; // created earlier in roadmap
import Flashcard from "./pages/Flashcard";
import Lessons from "./pages/Lessons";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/english" element={<English />} />
        <Route path="/japanese" element={<Japanese />} />
        <Route path="/english/vocabulary" element={<EnglishVocabulary />} />
        <Route path="/japanese/hiragana" element={<Hiragana />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lesson/:id" element={<LessonDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flashcard" element={<Flashcard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
