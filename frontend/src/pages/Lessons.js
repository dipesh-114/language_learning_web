import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import LessonCard from "../components/LessonCard";
import { fetchLessons } from "../api/api";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const res = await fetchLessons(); // GET /api/lessons/
        setLessons(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        All Lessons
      </Typography>
      <Grid container spacing={2}>
        {lessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.id}>
            <LessonCard lesson={lesson} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Lessons;
