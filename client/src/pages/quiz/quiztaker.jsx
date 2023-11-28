import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/quizzes/${quizId}`);
        setQuiz(response.data);

        const newShuffledOptions = response.data.questions.map((question) =>
          shuffleArray([...question.incorrectAnswers, question.correctAnswer])
        );
        setShuffledOptions(newShuffledOptions);

        setTimeRemaining(response.data.timer);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    let interval;

    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0 && !isSubmitted) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeRemaining, isSubmitted]);

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    if (!isSubmitted) {
      setAnswers({
        ...answers,
        [questionIndex]: answer,
      });
    }
  };

  const calculateScore = () => {
    const correct = [];
    const incorrect = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        correct.push(index);
      } else {
        incorrect.push(index);
      }
    });

    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);

    const userScore = correct.length;
    setScore(userScore);
    return correct.length; 

  };

//
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isSubmitted && timeRemaining > 0) {
      const calculatedScore = calculateScore(); 
      setScore(calculatedScore);
      calculateScore();

      try {
        await axios.post(`/quizzes/${quizId}/submit`, {
  
          score: calculatedScore,
        });

        console.log("Submission successful");
        setIsSubmitted(true); // Disable further submissions
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    } else {
      console.log("Already submitted or no remaining time");
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md Baskervville min-h-screen flex flex-col justify-start items-center py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">{quiz.title}</h2>
      {isSubmitted ? (
        <>
          <div className="mb-4"><b>Your Score: {score}</b></div>
        </>
      ) : (
        <>
          {timeRemaining <= 0 && (
            <div className="mb-4 text-red-600">Time's up! You cannot submit anymore.</div>
          )}
          <div className="mb-4">Time Remaining: {timeRemaining} seconds</div>
        </>
      )}
      <form onSubmit={handleFormSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <div className="font-bold mb-2">{(index + 1) + ". " + question.questionText}</div>
            {shuffledOptions[index].map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="radio"
                  id={`option-${optionIndex}`}
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleAnswerChange(index, option)}
                  disabled={isSubmitted}
                />
                <label
                  htmlFor={`option-${optionIndex}`}
                  className={`
        ${isSubmitted && option === quiz.questions[index].correctAnswer ? "text-green-500" : ""}
        ${isSubmitted && option !== quiz.questions[index].correctAnswer ? "text-red-500" : ""}
      `}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isSubmitted || timeRemaining <= 0}
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default TakeQuiz;