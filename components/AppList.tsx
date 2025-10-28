import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Developer, AppInfo } from '../types';
import { getAppsByDeveloper } from '../services/itunesService';
import Spinner from './common/Spinner';
import AppCard from './common/AppCard';
import AppDetailModal from './AppDetailModal';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SortIcon from './icons/SortIcon';

interface AppListProps {
  developer: Developer;
  onBack: () => void;
}

type SortKey = 'trackName' | 'releaseDate';
type SortDirection = 'asc' | 'desc';

const AppList: React.FC<AppListProps> = ({ developer, onBack }) => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('releaseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appList = await getAppsByDeveloper(developer.id);
      setApps(appList);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  }, [developer.id]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => {
      if (sortKey === 'trackName') {
        return sortDirection === 'asc' ? a.trackName.localeCompare(b.trackName) : b.trackName.localeCompare(a.trackName);
      } else { // releaseDate
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [apps, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection(key === 'releaseDate' ? 'desc' : 'asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
            <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-3xl font-bold truncate" title={developer.name}>{developer.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <SortIcon className="w-5 h-5 text-gray-500"/>
          <button onClick={() => handleSort('trackName')} className={`px-3 py-1 text-sm rounded-full ${sortKey === 'trackName' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>名前順</button>
          <button onClick={() => handleSort('releaseDate')} className={`px-3 py-1 text-sm rounded-full ${sortKey === 'releaseDate' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>配信日順</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {sortedApps.map(app => (
          <AppCard key={app.trackId} app={app} onSelect={setSelectedApp} />
        ))}
      </div>

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default AppList;