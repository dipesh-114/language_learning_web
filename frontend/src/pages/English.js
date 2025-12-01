// frontend/src/pages/English.js
import LessonCard from "../components/LessonCard";
import { Link } from "react-router-dom";
import React from "react";

function English() {
  return (
    <div style={{ padding: 20 }}>
      <h2>English Lessons</h2>
      <Link to="/english/vocabulary" style={{ textDecoration: "none" }}>
        <LessonCard title="Basic Vocabulary" description="Learn simple words for daily use." />
      </Link>
      <LessonCard title="Grammar Basics" description="Learn nouns, verbs, adjectives, tenses." />
      <LessonCard title="Conversation Practice" description="Practice real English conversations." />
    </div>
  );
}

export default English;
