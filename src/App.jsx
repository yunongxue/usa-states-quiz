import './App.css'
import Quiz from './components/Quiz-local-data'


function App() {
  return (
    <>
    <div className="app-container">
      <header className="quiz-header">
        <h1>Test Your Knowledge of U.S. States!</h1>
      </header>
      <Quiz/>
    </div>
    </>
  )
}

export default App
