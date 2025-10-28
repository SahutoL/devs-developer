import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Developer, ITunesAppResult } from '../types';
import { searchAppsByName, getDeveloperInfoFromUrl } from '../services/itunesService';
import { useDebounce } from '../hooks/useDebounce';
import DeveloperCard from './common/DeveloperCard';
import DeveloperTagEditModal from './DeveloperTagEditModal';
import SortIcon from './icons/SortIcon';
import Spinner from './common/Spinner';
import SearchIcon from './icons/SearchIcon';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';

interface DeveloperListProps {
  developers: Developer[];
  onAddDeveloper: (developerInfo: Omit<Developer, 'dateAdded' | 'tags'>) => void;
  onSelectDeveloper: (developer: Developer) => void;
  onDeleteDeveloper: (developerId: number) => void;
  onUpdateDeveloper: (developer: Developer) => void;
  onImportDevelopers: (developers: Developer[]) => void;
}

type SortKey = 'name' | 'dateAdded';
type SortDirection = 'asc' | 'desc';

const DeveloperList: React.FC<DeveloperListProps> = ({ developers, onAddDeveloper, onSelectDeveloper, onDeleteDeveloper, onUpdateDeveloper, onImportDevelopers }) => {
  const [addMethod, setAddMethod] = useState<'search' | 'url'>('search');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ITunesAppResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // URL add state
  const [developerUrl, setDeveloperUrl] = useState('');
  const [isAddingFromUrl, setIsAddingFromUrl] = useState(false);
  const [addUrlError, setAddUrlError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchAppsByName(debouncedSearchTerm);
        setSearchResults(results);
      } catch (err) {
        if (err instanceof Error) {
          setSearchError(err.message);
        } else {
          setSearchError('不明なエラーが発生しました。');
        }
      } finally {
        setIsSearching(false);
      }
    };
    if (addMethod === 'search') {
      search();
    }
  }, [debouncedSearchTerm, addMethod]);

  const handleAddFromSearch = (app: ITunesAppResult) => {
    onAddDeveloper({
      id: app.artistId,
      name: app.artistName,
      url: app.artistViewUrl,
      iconUrl: app.artworkUrl100,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerUrl.trim()) return;

    setIsAddingFromUrl(true);
    setAddUrlError(null);
    try {
      const devInfo = await getDeveloperInfoFromUrl(developerUrl);
      onAddDeveloper(devInfo);
      setDeveloperUrl('');
    } catch (err) {
      if (err instanceof Error) {
        setAddUrlError(err.message);
      } else {
        setAddUrlError('不明なエラーが発生しました。');
      }
    } finally {
      setIsAddingFromUrl(false);
    }
  };


  const allTags = useMemo(() => {
    const tags = new Set<string>();
    developers.forEach(dev => dev.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [developers]);

  const filteredDevelopers = useMemo(() => {
    if (!activeTag) return developers;
    return developers.filter(dev => dev.tags?.includes(activeTag));
  }, [developers, activeTag]);

  const sortedDevelopers = useMemo(() => {
    return [...filteredDevelopers].sort((a, b) => {
      if (sortKey === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else { // dateAdded
        const dateA = new Date(a.dateAdded).getTime();
        const dateB = new Date(b.dateAdded).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [filteredDevelopers, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSaveTags = (developerId: number, tags: string[]) => {
    const developerToUpdate = developers.find(d => d.id === developerId);
    if (developerToUpdate) {
        onUpdateDeveloper({ ...developerToUpdate, tags });
    }
    setEditingDeveloper(null);
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(developers, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev_store_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        const parsed = JSON.parse(content as string);
        if (Array.isArray(parsed) && parsed.every(item => 
            typeof item.id === 'number' &&
            typeof item.name === 'string' &&
            typeof item.url === 'string' &&
            typeof item.dateAdded === 'string' &&
            typeof item.iconUrl === 'string'
        )) {
            if (window.confirm('現在のリストをインポートしたデータで上書きしますか？この操作は元に戻せません。')) {
                onImportDevelopers(parsed);
            }
        } else {
            alert('無効なファイル形式です。');
        }
      } catch (error) {
        alert('ファイルの読み込みに失敗しました。');
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setAddMethod('search')}
            className={`-mb-px px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
              addMethod === 'search'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            アプリ名で検索
          </button>
          <button
            onClick={() => setAddMethod('url')}
            className={`-mb-px px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
              addMethod === 'url'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            URLで追加
          </button>
        </div>

        <div className="pt-6">
          {addMethod === 'search' ? (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="アプリ名で検索して開発者を追加..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {isSearching && <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><Spinner /></div>}
              </div>
              {searchError && <p className="text-red-500 mt-2 text-sm">{searchError}</p>}
              {searchResults.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto divide-y divide-gray-200">
                  {searchResults.map(app => (
                    <li key={app.trackId} className="p-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={app.artworkUrl100} alt={app.trackName} className="w-12 h-12 rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{app.trackName}</p>
                          <p className="text-sm text-gray-500 truncate">{app.artistName}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddFromSearch(app)}
                        className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-200 flex-shrink-0"
                      >
                        追加
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddFromUrl}>
              <label htmlFor="developerUrl" className="block text-sm font-medium text-gray-700 mb-2">App StoreのURL</label>
              <div className="flex gap-2">
                <input
                  id="developerUrl"
                  type="url"
                  value={developerUrl}
                  onChange={(e) => { setDeveloperUrl(e.target.value); setAddUrlError(null); }}
                  placeholder="https://apps.apple.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAddingFromUrl || !developerUrl.trim()}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-24 shrink-0"
                >
                  {isAddingFromUrl ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : '追加'}
                </button>
              </div>
              {addUrlError && <p className="text-red-500 mt-2 text-sm">{addUrlError}</p>}
            </form>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-y-4">
          <h2 className="text-2xl font-bold">保存した開発者</h2>
          <div className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} style={{display: 'none'}} accept=".json" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200" title="インポート"><UploadIcon className="w-5 h-5 text-gray-600" /></button>
            <button onClick={handleExport} className="p-2 rounded-full hover:bg-gray-200" title="エクスポート"><DownloadIcon className="w-5 h-5 text-gray-600" /></button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <SortIcon className="w-5 h-5 text-gray-500"/>
            <button onClick={() => handleSort('name')} className={`px-3 py-1 text-sm rounded-full ${sortKey === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>名前</button>
            <button onClick={() => handleSort('dateAdded')} className={`px-3 py-1 text-sm rounded-full ${sortKey === 'dateAdded' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>追加日</button>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
              <button onClick={() => setActiveTag(null)} className={`px-3 py-1 text-sm rounded-full transition-colors ${!activeTag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>すべて</button>
              {allTags.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 text-sm rounded-full transition-colors ${activeTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{tag}</button>
              ))}
          </div>
        )}

        {developers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDevelopers.map(dev => (
              <DeveloperCard 
                key={dev.id} 
                developer={dev} 
                onSelect={onSelectDeveloper} 
                onDelete={onDeleteDeveloper}
                onEditTags={() => setEditingDeveloper(dev)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">まだ開発者が追加されていません。</p>
            <p className="text-gray-400 text-sm mt-2">アプリ名で検索するか、URLで追加してください。</p>
          </div>
        )}
      </div>
    </div>
    {editingDeveloper && (
        <DeveloperTagEditModal
            developer={editingDeveloper}
            onClose={() => setEditingDeveloper(null)}
            onSave={handleSaveTags}
        />
    )}
    </>
  );
};

export default DeveloperList;