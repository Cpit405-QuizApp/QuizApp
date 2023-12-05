import React, { useState, useEffect } from 'react';
import axios from 'axios';
const HomePage = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Add API endpoint for fetching leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Quiz App</h2>
        <p className="text-gray-600">Challenge yourself with quizzes and see where you stand on the leaderboard!</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div key={user.user._id} className="bg-white shadow-md p-6 rounded-md relative">
              <p className="text-lg font-bold mb-2">{index+1}. {`${user.user.firstName} ${user.user.lastName}`}</p>
              <p className="text-gray-600 mb-4">Total Score: {user.totalScore}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
