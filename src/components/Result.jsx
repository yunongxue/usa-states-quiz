/**
 * Displays the final results of the quiz and offers an option to restart.
 * @param {Object} props - Component props.
 * @param {number} props.score - The final score obtained by the quiz participant.
 * @param {number} props.totalQuestions - The total number of questions answered in the quiz.
 * @param {Function} props.onRestartQuiz - A callback function to restart the quiz.
 * @returns {JSX.Element} - The rendered result component.
 */
const Result = ({ score, totalQuestions, onRestartQuiz }) => {
  return (
    <div className="result-container">
      {/* Announce the completion of the quiz */}
      <h2>Quiz Completed!</h2>
      {/* Display the final score */}
      <p className="final-score">Your Score: {score}/{totalQuestions}</p>
      {/* Button to restart the quiz */}
      <button onClick={onRestartQuiz} className="restart-quiz">Try Again</button>
    </div>
  );
};

export default Result;
