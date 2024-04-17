import { useState, useEffect } from 'react';
import Question from './Question';
import ScoreBoard from './ScoreBoard';
import Result from './Result';


const generateRandomQuestions = (data, numQuestions = 10) => {
  const shuffledStates = [...data].sort(() => 0.5 - Math.random());
  const selectedStates = shuffledStates.slice(0, numQuestions);

  const getIncorrectAnswers = (currentState, key) => {
    return shuffledStates
      .filter(state => state.name !== currentState.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(state => state[key]);
  };

  const getIncorrectCityAnswers = (cities) => {
      let incorrectCities = cities.slice(1); 
      incorrectCities.sort(() => 0.5 - Math.random()); 
      return incorrectCities.slice(0, 3).map(city => city.name); 
    };

  const getIncorrectCapitalAnswers = (cities, capitalName) => {
      let incorrectCities = cities.filter(city => city.name !== capitalName);
      incorrectCities.sort(() => 0.5 - Math.random()); 
      return incorrectCities.slice(0, 3).map(city => city.name); 
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
        questionData.question = `In terms of the date of statehood, which state/territory was admitted or ratified on ${state.date}?`;
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
        questionData.question = `What is the biggest city in ${state.name}?`;
        questionData.options = [state.cities[0].name, ...getIncorrectCityAnswers(state.cities)]
        questionData.answer = state.cities[0].name;
        break;
      case 'text':
        questionData.question = `What is the postal abbreviation of ${state.name}?`;
        questionData.answer = state.postal; 
        break;
    }

    if (isChoiceQuestion) {
      questionData.options.sort(() => 0.5 - Math.random()); 
    }
    return questionData;
  });
};



const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
          await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
          const response = await fetch(url, options);
          const data = await response.json(); // Parsing JSON data
          setQuestions(generateRandomQuestions(data)); // Assuming generateRandomQuestions formats your questions
          setIsLoading(false);
      } catch (error) {
          console.error('Error fetching questions:', error);
          setError('Failed to load questions. Please try again later.');
          setIsLoading(false);
      }
  };

    useEffect(() => {
      fetchQuestions();
    }, []);

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
