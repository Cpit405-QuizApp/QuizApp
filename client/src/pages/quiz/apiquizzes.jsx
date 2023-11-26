import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ApiQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes when the component mounts
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("/quizzes");
        setQuizzes(response.data); // Assuming the server sends an array of quizzes
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start items-center py-8">
      <h2>API Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>{quiz.title}</li>
          // You can display other information about the quiz as needed
        ))}
      </ul>
    </div>
  );
}
