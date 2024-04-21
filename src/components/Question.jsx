import { useState } from 'react';

/**
 * Displays a question and handles user interactions for submitting answers.
 * @param {Object} props - Component props.
 * @param {Object} props.questionData - Data for the current question.
 * @param {Function} props.onAnswerSubmit - Callback to handle the submission of an answer.
 * @returns {JSX.Element} - The rendered component for a single question.
 */
const Question = ({ questionData, onAnswerSubmit }) => {
  // State to store the user's current answer.
  const [userAnswer, setUserAnswer] = useState('');
  // State to store the answer for text type questions.
  const [textAnswer, setTextAnswer] = useState('');
  // State to store any error message related to the input.
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles click events on option buttons for choice-based questions.
   * @param {string} option - The option chosen by the user.
   * @param {Event} event - The click event object.
   */
  const handleOptionClick = (option) => {
    setUserAnswer(option);  // Update the state with the chosen option.
    onAnswerSubmit(option); // Submit the chosen option.
  };

  /**
   * Handles the submission of text-based answers.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    if (!textAnswer.trim()) {
      setErrorMessage('*Please enter an answer.'); // Set error message if input is empty.
    } else {
      onAnswerSubmit(textAnswer); // Submit the text answer.
      setTextAnswer('');          // Clear the text input field.
      setErrorMessage('');        // Clear any error messages.
    }
  };

  // Render the question component.
  return (
    <div>
      <div className="question-label">{questionData.question}</div>
      {questionData.questionType === 'choice' ? (
        <div className="options-container">
          {questionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
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
