// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { getProgress } from "../api/api";
import { Box, Typography } from "@mui/material";

export default function Dashboard(){
  const [progress, setProgress] = useState([]);
  useEffect(()=> {
    getProgress("demo-user").then(data => setProgress(data.progress || [])).catch(()=>{});
  }, []);

  if (!progress.length) return <Box p={3}><Typography>Loading progress...</Typography></Box>;

  const totalLessons = progress.length;
  const avgAccuracy = progress.reduce((acc,p)=>acc + (p.accuracy || 0), 0) / totalLessons;

  return (
    <Box p={3}>
      <Typography variant="h4">User Dashboard</Typography>
      <Typography>Total Lessons Completed: {totalLessons}</Typography>
      <Typography>Average Accuracy: {avgAccuracy.toFixed(1)}%</Typography>

      <div style={{ width:"100%", background:"#ddd", height:20, borderRadius:10, marginTop:8 }}>
        <div style={{ width:`${avgAccuracy}%`, background:"#4caf50", height:20, borderRadius:10 }} />
      </div>

      <Typography variant="h6" mt={3}>Lesson Breakdown</Typography>
      <table border="1" width="100%" cellPadding="10">
        <thead><tr><th>Lesson</th><th>Correct</th><th>Incorrect</th><th>Accuracy</th></tr></thead>
        <tbody>
          {progress.map((p,i)=>(
            <tr key={i}>
              <td>{p.lessonId}</td><td>{p.correct}</td><td>{p.incorrect}</td><td>{p.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
