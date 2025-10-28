
import React, { useState, useEffect } from 'react';
import type { Developer } from '../types';
import XIcon from './icons/XIcon';
import Tag from './common/Tag';

interface DeveloperTagEditModalProps {
  developer: Developer;
  onClose: () => void;
  onSave: (developerId: number, tags: string[]) => void;
}

const DeveloperTagEditModal: React.FC<DeveloperTagEditModalProps> = ({ developer, onClose, onSave }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setTags(developer.tags || []);
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [developer, onClose]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSave = () => {
    onSave(developer.id, tags);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">タグを編集</h2>
            <p className="text-sm text-gray-500 truncate" title={developer.name}>{developer.name}</p>
        </div>

        <div className="p-6 space-y-4">
            <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを追加"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={!newTag.trim()}
                >
                    追加
                </button>
            </form>

            <div className="min-h-[6rem] bg-gray-50 p-3 rounded-md border">
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <div key={tag} className="flex items-center bg-gray-200 rounded-full">
                                <span className="pl-3 pr-1 py-1 text-sm text-gray-800">{tag}</span>
                                <button onClick={() => handleRemoveTag(tag)} className="p-1 rounded-full hover:bg-gray-300">
                                    <XIcon className="w-3 h-3 text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center pt-5">タグがありません。</p>
                )}
            </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-100"
            >
                キャンセル
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-md hover:bg-blue-600"
            >
                保存
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTagEditModal;
