import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuizForm from "./QuizForm";
import { Link } from "react-router-dom";
import QuizAttempts from "./QuizAttempts";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const quizzesPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const [showPageStatus, setShowPageStatus] = useState(false);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const response = await axios.get("/quizzes/myquizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching user's quizzes:", error);
      }
    };

    fetchUserQuizzes();
  }, [showCreateQuizForm]);

  const handleCreateQuizClick = () => {
    setShowCreateQuizForm(true);
    setIsEditMode(false);
    resetForm();
  };
  const resetForm = () => {
    setCurrentQuizId(null);
    setQuizTitle("");
    setDifficulty("");
    setCategory("");
    setQuestions([]);
    setTimer(30);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", correctAnswer: "", incorrectAnswers: ["", "", ""] },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "questionText" || field === "correctAnswer") {
      newQuestions[index][field] = value;
    } else {
      newQuestions[index].incorrectAnswers[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      title: quizTitle,
      difficulty: difficulty,
      category: category,
      questions: questions,
      timer: timer,
    };

    try {
      if (isEditMode) {
        await axios.put(`/quizzes/${currentQuizId}`, quizData);
      } else {
        await axios.post("/quizzes", quizData);
      }

      const updatedQuizzes = await axios.get("/quizzes/myquizzes");
      setQuizzes(updatedQuizzes.data);
      setShowCreateQuizForm(false);
      setIsEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleBackClick = () => {
    setShowCreateQuizForm(false);
  };
  const handleEditQuiz = (quiz) => {
    setIsEditMode(true);
    setCurrentQuizId(quiz._id);
    setQuizTitle(quiz.title);
    setDifficulty(quiz.difficulty);
    setCategory(quiz.category);
    setQuestions(quiz.questions);
    setTimer(quiz.timer);
    setShowCreateQuizForm(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`/quizzes/${quizId}`);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };
  const toggleDetails = (quizId) => {
    setShowDetails((prevDetails) => ({
      ...prevDetails,
      [quizId]: !prevDetails[quizId],
    }));
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      setShowPageStatus(true);
      return;
    }
  
    if (newPage > maxPage) {
      setShowPageStatus(true);
      return;
    }
  
    setShowPageStatus(false);
    setCurrentPage(newPage);
  };
  const maxPage = Math.ceil(quizzes.length / quizzesPerPage);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      {showCreateQuizForm ? (
        <div>
          <QuizForm
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            category={category}
            setCategory={setCategory}
            questions={questions}
            setQuestions={setQuestions}
            timer={timer}
            setTimer={setTimer}
            handleQuestionChange={handleQuestionChange}
            handleDeleteQuestion={handleDeleteQuestion}
            handleAddQuestion={handleAddQuestion}
            handleSubmit={handleSubmit}
            isEditMode={isEditMode}
          />
          <div className="text-center mt-4">
            <button
              onClick={handleBackClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleCreateQuizClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Create Quiz
          </button>
          <ul className="w-full max-w-md">
            {currentQuizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="bg-white shadow-md p-6 rounded-md mb-4"
              >
                <div className="font-bold text-lg mb-2">{quiz.title}</div>
                <div>
                  <span className="font-bold">Category:</span> {quiz.category}
                </div>
                <div>
                  <span className="font-bold">Difficulty:</span>{" "}
                  {quiz.difficulty}
                </div>
                <div>
                  <span className="font-bold">Time:</span> {quiz.timer} seconds
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Link to={`/quiztaker/${quiz._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">
                      Try Quiz
                    </button>
                  </Link>
                  <div>
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleDetails(quiz._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Details
                    </button>
                  </div>
                </div>
                {showDetails[quiz._id] && <QuizAttempts quizId={quiz._id} />}
              </li>
            ))}
          </ul>
          <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage * quizzesPerPage >= quizzes.length}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:opacity-50"
      >
        Next
      </button>
      {showPageStatus && currentPage === 1 && (
      <div className="text-sm text-red-500">You are on the first page.</div>
    )}
    {showPageStatus && currentPage === maxPage && (
      <div className="text-sm text-red-500">You are on the last page.</div>
    )}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
