import { useState, useEffect } from 'react';
import Question from './Question';
import ScoreBoard from './ScoreBoard';
import Result from './Result';

/**
 * Function to generate a randomized set of quiz questions from the provided data.
 * @param {Array} data - The dataset from which to generate questions.
 * @param {number} numQuestions - The number of questions to generate.
 * @returns {Array} - An array of question objects.
 */
const generateRandomQuestions = (data, numQuestions = 10) => {
    const shuffledStates = [...data].sort(() => 0.5 - Math.random()); // Shuffle the dataset.
    const selectedStates = shuffledStates.slice(0, numQuestions); // Select a subset of the shuffled data.

    const getIncorrectAnswers = (currentState, key) => {
        return shuffledStates
            .filter(state => state.name !== currentState.name) // Filter out the correct answer.
            .sort(() => 0.5 - Math.random()) // Shuffle the remaining options.
            .slice(0, 3) // Select three options.
            .map(state => state[key]); // Return the specified key from each state.
    };

    const getIncorrectCityAnswers = (cities) => {
        let incorrectCities = cities.slice(1); // Assume the first city is the correct answer and slice it out.
        incorrectCities.sort(() => 0.5 - Math.random()); // Shuffle the remaining cities.
        return incorrectCities.slice(0, 3).map(city => city.name); // Return the names of the first three cities.
    };

    const getIncorrectCapitalAnswers = (cities, capitalName) => {
        let incorrectCities = cities.filter(city => city.name !== capitalName); // Filter out the correct capital.
        incorrectCities.sort(() => 0.5 - Math.random()); // Shuffle the remaining options.
        return incorrectCities.slice(0, 3).map(city => city.name); // Return the names of the first three cities.
    };

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
        if (isChoiceQuestion) {
            questionData.options.sort(() => 0.5 - Math.random()); // Randomly sort the options to ensure they are presented differently each time.
        }
        return questionData;
    });
};

/**
 * The Quiz component handles the overall quiz logic, state management, and rendering of the quiz interface.
 */
const Quiz = () => {
    const [questions, setQuestions] = useState([]); // Holds the current set of questions for the quiz.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question index.
    const [score, setScore] = useState(0); // Tracks the user's score.
    const [quizCompleted, setQuizCompleted] = useState(false); // Flag to check if the quiz is completed.
    const [isLoading, setIsLoading] = useState(true); // Loading state for asynchronous operations.
    const [error, setError] = useState(null); // Error state for handling errors in data fetching.

    /**
     * Asynchronous function to fetch questions from an API and initialize the quiz.
     */
    const fetchQuestions = async () => {
        const url = 'https://us-states.p.rapidapi.com/all';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'YOUR-API-KEY-HERE',
                'X-RapidAPI-Host': 'us-states.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setQuestions(generateRandomQuestions(data));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Failed to load questions. Please try again later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
      try {
        fetchQuestions();
        setIsLoading(false);
      } catch (error) {
          setError('Failed to load questions. Please try again.');
          setIsLoading(false);
      }
  }, []);

    /**
     * Handles the submission of an answer, updates the score, and navigates to the next question or ends the quiz.
     * @param {string} userAnswer - The answer submitted by the user.
     */
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

    /**
     * Resets the quiz to its initial state and fetches new questions.
     */
    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        setIsLoading(true);
        setError(null);
        fetchQuestions();
    };

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
                    <Question questionData={questions[currentQuestionIndex]} onAnswerSubmit={onAnswerSubmit} />
                </>
            )}
        </div>
    );
};

export default Quiz;
