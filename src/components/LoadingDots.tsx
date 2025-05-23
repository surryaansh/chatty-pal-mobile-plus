
import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex gap-1 loading-dots">
      <div className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ "--dot-index": 0 } as React.CSSProperties}></div>
      <div className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ "--dot-index": 1 } as React.CSSProperties}></div>
      <div className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" style={{ "--dot-index": 2 } as React.CSSProperties}></div>
    </div>
  );
};

export default LoadingDots;
