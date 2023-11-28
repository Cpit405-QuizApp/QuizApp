
import React from 'react';

const QuizForm = ({
    quizTitle, 
    setQuizTitle,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    questions,
    setQuestions,
    timer,
    setTimer,
    handleQuestionChange,
    handleDeleteQuestion,
    handleAddQuestion,
    handleSubmit,
    isEditMode
}) => {
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
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
                {isEditMode ? "Update Quiz" : "Submit Quiz"}
              </button>

              </div>
          
        </form>
    );
};

export default QuizForm;
