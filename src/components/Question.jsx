import { useState } from 'react';

const Question = ({questionData, onAnswerSubmit}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOptionClick = (option, event) => {
    setUserAnswer(option);
    onAnswerSubmit(option);
    event.currentTarget.blur(); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textAnswer.trim()) {
      setErrorMessage('*Please enter an answer.');
    } else {
      onAnswerSubmit(textAnswer);
      setTextAnswer('');
      setErrorMessage('');
    }
  };


  return (
    <div>
      <div className="question-label">{questionData.question}</div>
      {questionData.questionType === 'choice' ? (
        <div className="options-container">
          {questionData.options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => handleOptionClick(option, e)}
              className={userAnswer === option ? 'option-button selected' : 'option-button'}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="text-input"
          />
          <button type="submit" className="submit-button">Submit</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      )}
    </div>
  );
};

export default Question;