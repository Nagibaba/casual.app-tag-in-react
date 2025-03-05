import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FormulaInput from './components/FormulaInput';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <h1>Formula Input with Tags</h1>
        <p>Type to add numbers, use operators (+, -, *, /, ^, (, )), or search for tags</p>
        <FormulaInput />
      </div>
    </QueryClientProvider>
  );
}

export default App;
