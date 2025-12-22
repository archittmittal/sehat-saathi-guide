import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-primary-foreground rounded-full flex items-center justify-center animate-pulse-slow">
          <Heart className="w-12 h-12 text-primary animate-float" />
        </div>
        <div className="absolute -inset-4 border-4 border-primary-foreground/30 rounded-full animate-spin-slow" />
      </div>
      
      <h1 className="text-3xl font-bold text-primary-foreground mb-2">
        स्वास्थ्य साथी
      </h1>
      <p className="text-primary-foreground/80 mb-8">
        Swasthya Saathi
      </p>
      
      <div className="w-64 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-foreground transition-all duration-100 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-primary-foreground/60 mt-4 text-sm">
        Loading... {progress}%
      </p>
    </div>
  );
};

export default LoadingScreen;
