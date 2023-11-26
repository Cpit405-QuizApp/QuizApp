import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const CommunityQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("/quizzes/community");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching community quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Community Quizzes</h2>
      <ul className="w-full max-w-md">
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="bg-white shadow-md p-6 rounded-md mb-4"
          >
            <div className="font-bold text-lg mb-2">{quiz.title}</div>
            <div>
              <span className="font-bold">Category:</span> {quiz.category}
            </div>
            <div>
              <span className="font-bold">Difficulty:</span> {quiz.difficulty}
            </div>
            <div>
              <span className="font-bold">Time:</span> {quiz.timer} seconds
            </div>
            {/* Link to the quiz taker page with the quiz ID */}
            <Link to={`/quiztaker/${quiz._id}`}>
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4">
                Take Quiz
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityQuizzes;
