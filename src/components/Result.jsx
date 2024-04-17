const Result = ({ score, totalQuestions, onRestartQuiz }) => {
  return (
    <div className="result-container">
      <h2>Quiz Completed!</h2>
      <p className="final-score">Your Score: {score}/{totalQuestions}</p>
      <button onClick={onRestartQuiz} className="restart-quiz">Try Again</button>
    </div>
  );
};

export default Result;
