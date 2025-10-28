
import React, { useState, useCallback } from 'react';
import type { Developer } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/common/Header';
import DeveloperList from './components/DeveloperList';
import AppList from './components/AppList';

const App: React.FC = () => {
  const [developers, setDevelopers] = useLocalStorage<Developer[]>('developers', []);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  const handleAddDeveloper = useCallback((developerInfo: Omit<Developer, 'dateAdded' | 'tags'>) => {
    if (!developers.some(d => d.id === developerInfo.id)) {
        const newDeveloper: Developer = {
            ...developerInfo,
            dateAdded: new Date().toISOString(),
            tags: [],
        };
      setDevelopers(prev => [newDeveloper, ...prev]);
    }
  }, [developers, setDevelopers]);
  
  const handleSelectDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer);
  };

  const handleBackToDevelopers = () => {
    setSelectedDeveloper(null);
  };
  
  const handleDeleteDeveloper = (developerId: number) => {
    setDevelopers(prev => prev.filter(d => d.id !== developerId));
    if (selectedDeveloper?.id === developerId) {
      setSelectedDeveloper(null);
    }
  };

  const handleUpdateDeveloper = useCallback((updatedDeveloper: Developer) => {
    setDevelopers(prev => prev.map(d => d.id === updatedDeveloper.id ? updatedDeveloper : d));
  }, [setDevelopers]);

  const handleImportDevelopers = (importedDevelopers: Developer[]) => {
    setDevelopers(importedDevelopers);
  };


  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {selectedDeveloper ? (
          <AppList 
            developer={selectedDeveloper} 
            onBack={handleBackToDevelopers} 
          />
        ) : (
          <DeveloperList
            developers={developers}
            onAddDeveloper={handleAddDeveloper}
            onSelectDeveloper={handleSelectDeveloper}
            onDeleteDeveloper={handleDeleteDeveloper}
            onUpdateDeveloper={handleUpdateDeveloper}
            onImportDevelopers={handleImportDevelopers}
          />
        )}
      </main>
    </div>
  );
};

export default App;