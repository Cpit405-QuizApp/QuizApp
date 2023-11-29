import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizForm from './QuizForm'; 
import QuizAttempts from "./QuizAttempts";


const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(30);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  const [showDetails, setShowDetails] = useState({});

useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const response = await axios.get("/quizzes/myquizzes");
        setQuizzes(response.data);
        const ids = response.data.map(quiz => quiz._id);
        console.log(ids);
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
      timer: timer
    };

    try {
      if (isEditMode) {
        await axios.put(`/quizzes/${currentQuizId}`, quizData);
      } else {
        await axios.post('/quizzes', quizData);
      }

      const updatedQuizzes = await axios.get("/quizzes/myquizzes");
      setQuizzes(updatedQuizzes.data);
      setShowCreateQuizForm(false);
      setIsEditMode(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting quiz:', error);
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
    const isConfirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (isConfirmed) {
      try {
        await axios.delete(`/quizzes/${quizId}`);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
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

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col items-center py-8">
    <div className="flex-grow flex flex-row">
      <div className="flex-grow-1 p-6">
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
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="mb-4 p-4 bg-gray-100 rounded shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{quiz.title}</span>
                    <div>
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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
                  {showDetails[quiz._id] && (
                <QuizAttempts quizId={quiz._id} />
                )}
                </li>
              ))}
            </ul>
          </div>
        )}
         
      </div>
     
      </div>
    </div>
  );
};

export default MyQuizzes;
