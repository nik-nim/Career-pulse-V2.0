// frontend/src/components/ui/TagInput.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder = 'Add tag...' }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500">
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm px-1"
      />
    </div>
  );
};