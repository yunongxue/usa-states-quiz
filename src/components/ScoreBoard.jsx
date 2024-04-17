const ScoreBoard = ({ score, totalQuestions }) => {
  return (
    <div className="scoreboard">
      <h3 className="score-text">Score: {score}/{totalQuestions}</h3>
    </div>
  );
};

export default ScoreBoard;
