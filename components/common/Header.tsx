
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-800">
            Dev Store
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;