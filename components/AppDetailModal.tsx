import React, { useEffect } from 'react';
import type { AppInfo } from '../types';
import StarRating from './common/StarRating';
import XIcon from './icons/XIcon';

interface AppDetailModalProps {
  app: AppInfo;
  onClose: () => void;
}

const formatRatingCount = (count?: number) => {
    if (count === undefined) return '評価なし';
    if (count < 1000) return count;
    if (count < 10000) return `${(count / 1000).toFixed(1)}千`;
    return `${(count / 10000).toFixed(1)}万`;
};

const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:bg-gray-200 rounded-full p-2 z-10">
          <XIcon className="w-6 h-6" />
        </button>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={app.artworkUrl512} alt={`${app.trackName} icon`} className="w-32 h-32 rounded-[22%] shadow-md flex-shrink-0" />
            <div className="flex-grow">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{app.trackName}</h2>
              <a href={app.artistViewUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-500 hover:underline">{app.artistName}</a>
              <div className="flex items-center space-x-4 mt-4">
                <a 
                  href={app.trackViewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full text-sm hover:bg-blue-600 transition-colors"
                >
                  入手
                </a>
                <div className="text-xs text-gray-500">{app.formattedPrice}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info Section */}
        <div className="px-6 md:px-8 py-4 flex justify-around border-b border-gray-200 text-center">
            <div className="w-1/3">
                <div className="text-gray-500 text-xs uppercase tracking-wider">評価</div>
                <div className="font-bold text-xl">{app.averageUserRatingForCurrentVersion?.toFixed(1) || 'N/A'}</div>
                <StarRating rating={app.averageUserRatingForCurrentVersion || 0} />
            </div>
            <div className="w-1/3 border-l border-r border-gray-200">
                <div className="text-gray-500 text-xs uppercase tracking-wider">評価数</div>
                <div className="font-bold text-xl">{formatRatingCount(app.userRatingCount)}</div>
            </div>
            <div className="w-1/3">
                <div className="text-gray-500 text-xs uppercase tracking-wider">ジャンル</div>
                <div className="font-bold text-xl truncate" title={app.genres.join(', ')}>{app.genres[0]}</div>
            </div>
        </div>

        {/* Screenshots Section */}
        {app.screenshotUrls && app.screenshotUrls.length > 0 && (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4">スクリーンショット</h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4">
              {app.screenshotUrls.map((url, index) => (
                <img key={index} src={url} alt={`Screenshot ${index + 1}`} className="h-64 rounded-lg shadow-md flex-shrink-0" />
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4">説明</h3>
          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{app.description}</p>
        </div>
        
        {/* Info Footer Section */}
        <div className="p-6 md:px-8 md:py-6 border-t border-gray-200 bg-gray-200/50 rounded-b-2xl">
          <div className="text-xs text-gray-600">
            <p><span className="font-semibold">配信日:</span> {new Date(app.releaseDate).toLocaleDateString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppDetailModal;