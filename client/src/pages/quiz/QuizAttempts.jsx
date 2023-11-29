import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizAttempts = ({ quizId }) => {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`/quizzes/${quizId}/attempts`);
        setAttempts(response.data);
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    };

    fetchAttempts();
  }, [quizId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (attempts.length === 0) {
    return <p className="text-gray-500">No attempts have been made on this quiz yet.</p>;
  }

  return (
    <table className="min-w-full leading-normal">
      <thead>
        <tr>
          <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            User
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Score
          </th>
        </tr>
      </thead>
      <tbody>
        {attempts.map((attempt) => (
          <tr key={attempt._id}>
            <td className="px-5 py-5 border-b border-gray-300 bg-white text-sm">
              {`${attempt.user.firstName} ${attempt.user.lastName}`}
            </td>
            <td className="px-5 py-5 border-b border-gray-300 bg-white text-sm">
              {attempt.score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuizAttempts;
