
import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-animated-gradient opacity-40"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="floating-circle floating-circle-1"></div>
      <div className="floating-circle floating-circle-2"></div>
      <div className="floating-circle floating-circle-3"></div>
    </div>
  );
};

export default BackgroundEffects;
