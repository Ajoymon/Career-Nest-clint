import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-blue-600 animate-spin"></div>
      </div>

      {/* Text */}
      <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
        CareerNest Loading...
      </p>
    </div>
  );
};

export default Loading;
