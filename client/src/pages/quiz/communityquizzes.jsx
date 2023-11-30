import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CommunityQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState({ difficulty: "", category: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const quizzesPerPage = 7;
  const [showPageStatus, setShowPageStatus] = useState(false); // Add this line

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/quizzes/community", { params: filter });
      setAllQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching community quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [filter]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };
  const handlePageChange = (newPage) => {
    const maxPage = Math.ceil(allQuizzes.length / quizzesPerPage);
    
    if (newPage < 1) {
      setShowPageStatus(true);
      setCurrentPage(1);
      return;
    } else if (newPage > maxPage) {
      setShowPageStatus(true);
      setCurrentPage(maxPage);
      return;
    }

    setShowPageStatus(false);
    setCurrentPage(newPage);
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = allQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);


  useEffect(() => {
    fetchQuizzes();
  }, [filter, currentPage]);

  const maxPage = Math.ceil(allQuizzes.length / quizzesPerPage);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Community Quizzes</h2>
      <div className="mb-4">
        <label className="font-bold mr-2">Difficulty:</label>
        <select
          name="difficulty"
          value={filter.difficulty}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="font-bold mr-2">Category:</label>
        <select
          name="category"
          value={filter.category}
          onChange={handleFilterChange}
        >
          <option value="">Select Category</option>
          <option value="General Knowledge">General Knowledge</option>
          <option value="Entertainment: Books">Entertainment: Books</option>
          <option value="Entertainment: Film">Entertainment: Film</option>
          <option value="Entertainment: Music">Entertainment: Music</option>
          <option value="Entertainment: Musicals & Theatres">
            Entertainment: Musicals & Theatres
          </option>
          <option value="Entertainment: Television">
            Entertainment: Television
          </option>
          <option value="Entertainment: Video Games">
            Entertainment: Video Games
          </option>
          <option value="Entertainment: Board Games">
            Entertainment: Board Games
          </option>
          <option value="Science & Nature">Science & Nature</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Science: Computers">Science: Computers</option>
          <option value="Science: Mathematics">Science: Mathematics</option>
          <option value="Mythology">Mythology</option>
          <option value="Sports">Sports</option>
          <option value="Geography">Geography</option>
          <option value="History">History</option>
          <option value="Politics">Politics</option>
          <option value="Art">Art</option>
          <option value="Celebrities">Celebrities</option>
          <option value="Animals">Animals</option>
        </select>
      </div>

      <ul className="w-full max-w-md">
      {currentQuizzes.map((quiz) => (
    <li key={quiz._id} className="bg-white shadow-md p-6 rounded-md mb-4">

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
              <Link to={`/quiztaker/${quiz._id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                  Take Quiz
                </button>
              </Link>
            </li>
          ))}
      </ul>

      <div className="my-4">
      <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(allQuizzes.length / quizzesPerPage)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
     
    </div>
  );
};
export default CommunityQuizzes;
