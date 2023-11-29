import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard');
        setLeaderboardData(response.data.slice(0, 5)); // Display only the top 5 users
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      <h2 className="text-3xl font-semibold mb-4">Leaderboard</h2>
      {leaderboardData.length > 0 ? (
        <ul className="list-disc list-inside">
          {leaderboardData.map((user) => (
            <li key={user.user._id} className="text-lg font-bold mb-2">
              {`${user.user.firstName} ${user.user.lastName} - Score: ${user.totalScore}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Leaderboard;
