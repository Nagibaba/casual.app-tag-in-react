import React, { useState, useRef } from 'react';
import { useFormulaStore, Tag } from '../store/formulaStore';
import { useTagSuggestions } from '../api/tagSuggestions';
import TagComponent from './TagComponent';
import './FormulaInput.css';


interface Suggestion {
  id: string;
  name: string;
  value?: number;
}

const FormulaInput: React.FC = () => {
  const { formula, addTag, removeTag, updateFormula, calculateResult } = useFormulaStore();
  const [inputValue, setInputValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get suggestions from API using React Query
  const { data: suggestions = [], isLoading } = useTagSuggestions(inputValue);

  // Operators that are allowed in the formula
  const operators = ['+', '-', '*', '/', '(', ')', '^'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setCursorPosition(e.target.selectionStart || 0);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to delete tags
    if (e.key === 'Backspace' && inputValue === '' && formula.length > 0) {
      const lastItem = formula[formula.length - 1];
      if (typeof lastItem !== 'string') {
        removeTag(lastItem.id);
      } else {
        const newFormula = [...formula];
        newFormula.pop();
        updateFormula(newFormula);
      }
    }
    
    // Handle operators
    if (operators.includes(e.key)) {
      e.preventDefault();
      if (inputValue) {
        // If there's input, try to add it as a number first
        if (!isNaN(Number(inputValue))) {
          updateFormula([...formula, inputValue]);
        }
        setInputValue('');
      }
      updateFormula([...formula, e.key]);
    }
    
    // Handle Enter to add a number
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (!isNaN(Number(inputValue))) {
        updateFormula([...formula, inputValue]);
        setInputValue('');
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name: suggestion.name,
      value: suggestion.value || Math.floor(Math.random() * 100), // Dummy value if not provided
      options: ['Option 1', 'Option 2', 'Option 3'], // Dummy options
    };
    
    addTag(newTag);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleTagOptionChange = (tagId: string, option: string) => {
    // Update the tag with the selected option
    const updatedFormula = formula.map(item => {
      if (typeof item === 'string' || item.id !== tagId) return item;
      return { ...item, name: `${item.name} (${option})` };
    });
    
    updateFormula(updatedFormula);
  };

  const handleCalculate = () => {
    const calculatedResult = calculateResult();
    setResult(calculatedResult);
  };

  const renderSuggestions = () => {
    if (!showSuggestions) return null;
    
    if (isLoading) {
      return <div className="suggestion-loading">Loading...</div>;
    }
    
    if (suggestions.length > 0) {
      return suggestions.map((suggestion: Suggestion) => (
        <div 
          key={suggestion.id} 
          className="suggestion-item"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion.name}
        </div>
      ));
    }
    
    return <div className="no-suggestions">No suggestions found</div>;
  };

  return (
    <div className="formula-input-container">
      <div className="formula-input-wrapper">
        <div className="formula-display">
          {formula.map((item, index) => (
            typeof item === 'string' ? (
              <span key={index} className="formula-operator">{item}</span>
            ) : (
              <TagComponent 
                key={item.id} 
                tag={item} 
                onRemove={() => removeTag(item.id)}
                onOptionChange={(option) => handleTagOptionChange(item.id, option)}
              />
            )
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="formula-text-input"
            placeholder="Type to add numbers or search for tags..."
          />
        </div>
        
        {showSuggestions && (
          <div className="suggestions-container">
            {renderSuggestions()}
          </div>
        )}
      </div>
      
      <button className="calculate-button" onClick={handleCalculate}>
        Calculate
      </button>
      
      {result !== null && (
        <div className="result-display">
          Result: {result}
        </div>
      )}
    </div>
  );
};

export default FormulaInput; 