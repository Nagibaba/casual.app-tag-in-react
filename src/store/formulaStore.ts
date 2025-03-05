import { create } from 'zustand';

export type Tag = {
  id: string;
  name: string;
  value: number;
  options?: string[];
};

type FormulaState = {
  formula: (Tag | string)[];
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  updateFormula: (formula: (Tag | string)[]) => void;
  calculateResult: () => number | null;
};

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formula: [],
  
  addTag: (tag) => {
    set((state) => ({
      formula: [...state.formula, tag]
    }));
  },
  
  removeTag: (id) => {
    set((state) => ({
      formula: state.formula.filter(item => 
        typeof item === 'string' || item.id !== id
      )
    }));
  },
  
  updateFormula: (formula) => {
    set({ formula });
  },
  
  calculateResult: () => {
    try {
      const formula = get().formula;
      const expressionString = formula.map(item => {
        if (typeof item === 'string') return item;
        return item.value.toString();
      }).join('');
      
      // Using Function constructor to evaluate the expression
      // Note: In a production app, you'd want a safer evaluation method
      return Function(`"use strict"; return (${expressionString})`)();
    } catch (error) {
      console.error('Error calculating formula:', error);
      return null;
    }
  }
})); 