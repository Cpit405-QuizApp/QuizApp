import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyQuizzes() {
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(30); // Default to 30 seconds
  const navigate = useNavigate();

  const handleCreateQuizClick = () => {
    setShowCreateQuizForm(true);
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
    try {
      const response = await axios.post('/quizzes', {
        title: quizTitle,
        difficulty: difficulty,
        category: category,
        questions: questions,
        timer: timer
      }, { withCredentials: true }); 
      console.log(response.data);
  
      navigate('/myquizzes'); 
    } catch (error) {
      console.error('There was an error creating the quiz:', error);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      <button
        onClick={handleCreateQuizClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Quiz
      </button>

      {showCreateQuizForm && (
        
        <form onSubmit={handleSubmit} className="w-full max-w-lg mt-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
          </div>

          <div className="mb-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 rounded-md border"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-md border"
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

              <option value="Information Technology">
                Information Technology
              </option>

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

          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                className="w-full p-2 rounded-md border mb-2"
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                className="w-full p-2 rounded-md border mb-2"
              />
              {question.incorrectAnswers.map((answer, ansIndex) => (
                <input
                  key={ansIndex}
                  type="text"
                  placeholder={`Incorrect Answer ${ansIndex + 1}`}
                  value={answer}
                  onChange={(e) =>
                    handleQuestionChange(index, ansIndex, e.target.value)
                  }
                  className="w-full p-2 rounded-md border mb-2"
                />
              ))}
               <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
              >
                Delete Question
              </button>
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            type="button"
            className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Question
          </button>

          <div className="mb-4">
            <select
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              className="w-full p-2 rounded-md border"
            >
              <option value="30">30 Seconds</option>
              <option value="60">1 Minute</option>
              <option value="120">2 Minutes</option>
              <option value="180">3 Minutes</option>
              <option value="240">4 Minutes</option>
              <option value="300">5 Minutes</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
