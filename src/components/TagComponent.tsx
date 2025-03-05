import React, { useState, useRef, useEffect } from 'react';
import { Tag } from '../store/formulaStore';
import './TagComponent.css';

interface TagComponentProps {
  tag: Tag;
  onRemove: () => void;
  onOptionChange: (option: string) => void;
}

const TagComponent: React.FC<TagComponentProps> = ({ tag, onRemove, onOptionChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="tag-container">
      <div className="tag-content">
        <span className="tag-name">{tag.name}</span>
        <button className="tag-remove" onClick={onRemove}>×</button>
      </div>
      
      <div className="tag-dropdown-wrapper" ref={dropdownRef}>
        <button 
          className="tag-dropdown-toggle"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          ▼
        </button>
        
        {showDropdown && (
          <div className="tag-dropdown-menu">
            {tag.options?.map((option, index) => (
              <button 
                key={index} 
                className="tag-dropdown-item"
                onClick={() => {
                  onOptionChange(option);
                  setShowDropdown(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagComponent; 