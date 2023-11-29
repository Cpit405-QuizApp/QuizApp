import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function ApiQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);


  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
    { id: 11, name: "Entertainment: Film" },
    { id: 12, name: "Entertainment: Music" },
    { id: 13, name: "Entertainment: Musicals & Theatres" },
    { id: 14, name: "Entertainment: Television" },
    { id: 15, name: "Entertainment: Video Games" },
    { id: 16, name: "Entertainment: Board Games" },
    { id: 17, name: "Science & Nature" },
    { id: 18, name: "Science: Computers" },
    { id: 19, name: "Science: Mathematics" },
    { id: 20, name: "Mythology" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Politics" },
    { id: 25, name: "Art" },
    { id: 26, name: "Celebrities" },
    { id: 27, name: "Animals" },
    { id: 28, name: "Vehicles" },
    { id: 29, name: "Entertainment: Comics" },
    { id: 30, name: "Science: Gadgets" },
    { id: 31, name: "Entertainment: Japanese Anime & Manga" },
    { id: 32, name: "Entertainment: Cartoon & Animations" }
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}`, { withCredentials: false });
      setQuizzes(response.data.results);
      setIsSubmitted(false);
      setUserAnswers({});
      setScore(null);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((quiz, index) => {
      if (userAnswers[index] === quiz.correct_answer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitAnswers = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const isCorrectAnswer = (questionIndex, answer) => {
    return quizzes[questionIndex].correct_answer === answer;
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center py-8">
      <h2>API Quizzes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Number of Questions:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="mb-4">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Fetch Quizzes
        </button>
      </form>

      {quizzes.length > 0 && (
        <div>
            {isSubmitted && (
            <div className="mb-4">Your Score: {score} / {quizzes.length}</div>
          )}
          {quizzes.map((quiz, index) => (
            <div key={index} className="mb-4">
              <div>{decodeHtml(quiz.question)}</div>
              {quiz.incorrect_answers.concat(quiz.correct_answer).sort().map((answer, answerIndex) => (
                <div key={answerIndex}>
                  <input
                    type="radio"
                    id={`answer-${index}-${answerIndex}`}
                    name={`question-${index}`}
                    value={answer}
                    onChange={() => handleAnswerChange(index, answer)}
                    disabled={isSubmitted}
                  />
                  <label
                    htmlFor={`answer-${index}-${answerIndex}`}
                    className={
                      isSubmitted
                        ? isCorrectAnswer(index, answer)
                          ? "text-green-500"
                          : "text-red-500"
                        : ""
                    }
                  >
                    {decodeHtml(answer)}
                  </label>
                </div>
              ))}
            </div>
          ))}

          {!isSubmitted && (
            <button onClick={handleSubmitAnswers} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}