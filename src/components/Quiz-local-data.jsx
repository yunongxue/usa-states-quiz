import { useState, useEffect } from 'react';
import Question from './Question';
import ScoreBoard from './ScoreBoard';
import Result from './Result';
import statesDataAll from './fetchedData/states_all';

/**
 * Generates a list of random questions based on the provided dataset.
 * @param {Array} data - The dataset from which to generate questions.
 * @param {number} numQuestions - The number of questions to generate.
 * @returns {Array} Array of question objects.
 */
const generateRandomQuestions = (data, numQuestions = 10) => {
    // Shuffle the array of data and select the first numQuestions elements.
    const shuffledStates = [...data].sort(() => 0.5 - Math.random());
    const selectedStates = shuffledStates.slice(0, numQuestions);

    // Helper function to generate incorrect answers for a given state.
    const getIncorrectAnswers = (currentState, key) => {
      return shuffledStates
          .filter(state => state.name !== currentState.name) // Filter out the correct answer.
          .sort(() => 0.5 - Math.random()) // Shuffle the remaining options.
          .slice(0, 3) // Select three options.
          .map(state => state[key]); // Return the specified key from each state.
  };

    // Helper function for generating incorrect city answers.
    const getIncorrectCityAnswers = (cities) => {
      let incorrectCities = cities.slice(1); // Assume the first city is the correct answer and slice it out.
      incorrectCities.sort(() => 0.5 - Math.random()); // Shuffle the remaining cities.
      return incorrectCities.slice(0, 3).map(city => city.name); // Return the names of the first three cities.
  };

    // Helper function for generating incorrect capital answers.
    const getIncorrectCapitalAnswers = (cities, capitalName) => {
      let incorrectCities = cities.filter(city => city.name !== capitalName); // Filter out the correct capital.
      incorrectCities.sort(() => 0.5 - Math.random()); // Shuffle the remaining options.
      return incorrectCities.slice(0, 3).map(city => city.name); // Return the names of the first three cities.
  };

    // Map selected states to question data structures.
    return selectedStates.map(state => {
      const questionTypes = ['nickname', 'motto', 'statehood', 'capital', 'biggestCity', 'text'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const isChoiceQuestion = questionType !== 'text';
      const questionData = {
        questionType: isChoiceQuestion ? 'choice' : 'text',
        question: '',
        options: [],
        answer: '',
      };

      // Determine the type of question and populate the question data accordingly.
      switch (questionType) {
        case 'nickname':
          questionData.question = `Which state/territory is known as "${state.nickname}"?`;
          questionData.options = [state.name, ...getIncorrectAnswers(state, 'name')];
          questionData.answer = state.name;
          break;
        case 'motto':
          questionData.question = `Which state/territory is represented by the motto "${state.motto}"?`;
          questionData.options = [state.name, ...getIncorrectAnswers(state, 'name')];
          questionData.answer = state.name;
          break;
        case 'statehood':
          questionData.question = `Which state/territory was admitted to the Union on ${state.date}?`;
          questionData.options = [state.name, ...getIncorrectAnswers(state, 'name')];
          questionData.answer = state.name;
          break;
        case 'capital':
          questionData.question = `What is the capital of ${state.name}?`;
          if (isChoiceQuestion) {
            questionData.options = [state.capital.name, ...getIncorrectCapitalAnswers(state.cities, state.capital.name)];
            questionData.answer = state.capital.name;
          } else {
            questionData.answer = state.capital.name;
          }
          break;
        case 'biggestCity':
          questionData.question = `What is the most populous city in ${state.name}?`;
          questionData.options = [state.cities[0].name, ...getIncorrectCityAnswers(state.cities)];
          questionData.answer = state.cities[0].name;
          break;
        case 'text':
          questionData.question = `What is the postal abbreviation of ${state.name}?`;
          questionData.answer = state.postal;
          break;
      }
      // Shuffle options to prevent any pattern recognition.
      if (isChoiceQuestion) {
        questionData.options.sort(() => 0.5 - Math.random());
      }
      return questionData;
    });
};

/**
 * The main quiz component that manages the quiz logic and state.
 * @returns {JSX.Element} The rendered quiz component.
 */
const Quiz = () => {
    // State to keep track of the questions, current question index, score, and quiz completion status.
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect hook to initialize the quiz questions when the component mounts.
    useEffect(() => {
      try {
          const generatedQuestions = generateRandomQuestions(statesDataAll);
          setQuestions(generatedQuestions);
          setIsLoading(false);
      } catch (error) {
          setError('Failed to load questions. Please refresh the page.');
          setIsLoading(false);
      }
  }, []);
  

    // Function to handle answer submission, update score and navigate to the next question.
    const onAnswerSubmit = (userAnswer) => {
        const correctAnswer = questions[currentQuestionIndex].answer;
        if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            setScore((prevScore) => prevScore + 1);
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    // Function to reset the quiz to its initial state.
    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        const generatedQuestions = generateRandomQuestions(statesDataAll);
        setQuestions(generatedQuestions);
        setIsLoading(false);
    };

    // Render logic based on the state of the quiz.
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="quiz-container">
            {quizCompleted ? (
                <Result score={score} totalQuestions={questions.length} onRestartQuiz={restartQuiz} />
            ) : (
                <>
                    <ScoreBoard score={score} totalQuestions={questions.length} />
                    <Question key={questions[currentQuestionIndex].question} questionData={questions[currentQuestionIndex]} onAnswerSubmit={onAnswerSubmit} />
                </>
            )}
        </div>
    );
};

export default Quiz;
