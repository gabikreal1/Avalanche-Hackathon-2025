'use client';

import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(1); // Initialize to 1 instead of 0

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('tradingProgress');
      if (savedProgress) {
        const parsedProgress = parseInt(savedProgress, 10);
        setProgress(parsedProgress > 0 ? parsedProgress : 1); // Ensure minimum is 1
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tradingProgress', progress.toString());
  }, [progress]);

  const updateProgress = (newStep: number) => {
    if (newStep > progress) {
      setProgress(newStep);
    }
  };

  const resetProgress = () => {
    setProgress(1); // Reset to 1 instead of 0
    localStorage.removeItem('tradingProgress');
  };

  return {
    progress,
    updateProgress,
    resetProgress,
  };
}
