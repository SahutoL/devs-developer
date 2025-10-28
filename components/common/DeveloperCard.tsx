
import React from 'react';
import type { Developer } from '../../types';
import TrashIcon from '../icons/TrashIcon';
import TagIcon from '../icons/TagIcon';
import Tag from './Tag';

interface DeveloperCardProps {
  developer: Developer;
  onSelect: (developer: Developer) => void;
  onDelete: (developerId: number) => void;
  onEditTags: (developer: Developer) => void;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onSelect, onDelete, onEditTags }) => {
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`「${developer.name}」をリストから削除しますか？`)){
      onDelete(developer.id);
    }
  };

  const handleEditTags = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTags(developer);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={() => onSelect(developer)}
      aria-label={`Select ${developer.name}`}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 pt-1">
          {developer.iconUrl ? (
            <img 
              src={developer.iconUrl} 
              alt={`${developer.name} icon`} 
              className="w-16 h-16 rounded-2xl object-cover shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-gray-500">{developer.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow ml-4 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate" title={developer.name}>
            {developer.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            追加日: {new Date(developer.dateAdded).toLocaleDateString()}
          </p>
           {developer.tags && developer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {developer.tags.slice(0, 3).map(tag => <Tag key={tag} label={tag} />)}
              {developer.tags.length > 3 && <Tag label={`+${developer.tags.length - 3}`} />}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={handleEditTags}
            className="p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Edit tags for ${developer.name}`}
            title="タグを編集"
          >
            <TagIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Delete ${developer.name}`}
            title="削除"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;