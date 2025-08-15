import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SectorConfig, SECTOR_CONFIGS } from '../types/sector-config';

interface SectorContextType {
  currentSector: SectorConfig;
  availableSectors: SectorConfig[];
  switchSector: (sectorId: string) => void;
  isConfigurable: boolean;
  toggleConfigMode: () => void;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

interface SectorProviderProps {
  children: ReactNode;
}

export const SectorProvider: React.FC<SectorProviderProps> = ({ children }) => {
  const [currentSectorId, setCurrentSectorId] = useState('agriculture');
  const [isConfigurable, setIsConfigurable] = useState(false);

  const currentSector = SECTOR_CONFIGS.find(s => s.id === currentSectorId) || SECTOR_CONFIGS[0];

  const switchSector = (sectorId: string) => {
    setCurrentSectorId(sectorId);
  };

  const toggleConfigMode = () => {
    setIsConfigurable(!isConfigurable);
  };

  const value = {
    currentSector,
    availableSectors: SECTOR_CONFIGS,
    switchSector,
    isConfigurable,
    toggleConfigMode
  };

  return (
    <SectorContext.Provider value={value}>
      {children}
    </SectorContext.Provider>
  );
};

export const useSector = () => {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSector must be used within a SectorProvider');
  }
  return context;
};

export default SectorContext;