
import React from 'react';
import type { AppInfo } from '../../types';

interface AppCardProps {
  app: AppInfo;
  onSelect: (app: AppInfo) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onSelect }) => {
  return (
    <div 
      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      onClick={() => onSelect(app)}
    >
      <img
        src={app.artworkUrl100}
        alt={`${app.trackName} icon`}
        className="w-16 h-16 rounded-2xl shadow-sm object-cover flex-shrink-0"
      />
      <div className="overflow-hidden">
        <h3 className="text-md font-semibold text-gray-800 truncate">{app.trackName}</h3>
        <p className="text-sm text-gray-500 truncate">{app.genres[0]}</p>
      </div>
    </div>
  );
};

export default AppCard;
