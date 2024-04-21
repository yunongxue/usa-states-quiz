/**
 * Displays the current score and total number of questions in the quiz.
 * @param {Object} props - Component props.
 * @param {number} props.score - Current score of the quiz participant.
 * @param {number} props.totalQuestions - Total number of questions in the quiz.
 * @returns {JSX.Element} - The rendered scoreboard component.
 */
const ScoreBoard = ({ score, totalQuestions }) => {
  return (
    <div className="scoreboard">
      {/* Display the score as "Score: X/Y" where X is the current score and Y is the total number of questions */}
      <h3 className="score-text">Score: {score}/{totalQuestions}</h3>
    </div>
  );
};

export default ScoreBoard;
