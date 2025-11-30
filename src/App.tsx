import { Calculator } from './components/Calculator';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Calculator />
      </div>
    </ThemeProvider>
  );
}

export default App;
