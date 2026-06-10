import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Itinerary } from '../types';
import { mockSavedItineraries } from '../mock/mockAdminData';

interface ItinerariesContextType {
  itineraries: Itinerary[];
  savedItineraries: Itinerary[];
  addItinerary: (itinerary: Itinerary) => void;
  saveItinerary: (id: string) => void;
  unsaveItinerary: (id: string) => void;
  removeItinerary: (id: string) => void;
  getItinerary: (id: string) => Itinerary | undefined;
}

const ItinerariesContext = createContext<ItinerariesContextType | null>(null);

export function ItinerariesProvider({ children }: { children: ReactNode }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>(mockSavedItineraries);

  const savedItineraries = itineraries.filter((i) => i.isSaved);

  const addItinerary = useCallback((itinerary: Itinerary) => {
    setItineraries((prev) => [...prev, itinerary]);
  }, []);

  const saveItinerary = useCallback((id: string) => {
    setItineraries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isSaved: true } : i))
    );
  }, []);

  const unsaveItinerary = useCallback((id: string) => {
    setItineraries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isSaved: false } : i))
    );
  }, []);

  const removeItinerary = useCallback((id: string) => {
    setItineraries((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const getItinerary = useCallback(
    (id: string) => itineraries.find((i) => i.id === id),
    [itineraries]
  );

  return (
    <ItinerariesContext.Provider value={{ itineraries, savedItineraries, addItinerary, saveItinerary, unsaveItinerary, removeItinerary, getItinerary }}>
      {children}
    </ItinerariesContext.Provider>
  );
}

export function useItineraries() {
  const ctx = useContext(ItinerariesContext);
  if (!ctx) throw new Error('useItineraries must be used within ItinerariesProvider');
  return ctx;
}
