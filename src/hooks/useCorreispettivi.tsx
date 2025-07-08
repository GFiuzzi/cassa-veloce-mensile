
import { useState, useEffect } from "react";

export interface Corrispettivo {
  data: string; // formato YYYY-MM-DD
  contanti: number;
  pos: number;
  totale: number;
}

const STORAGE_KEY = "registro_corrispettivi";

export const useCorreispettivi = () => {
  const [corrispettivi, setCorreispettivi] = useState<Corrispettivo[]>([]);

  // Carica i dati dal localStorage all'avvio
  useEffect(() => {
    const datiSalvati = localStorage.getItem(STORAGE_KEY);
    if (datiSalvati) {
      try {
        const parsed = JSON.parse(datiSalvati);
        setCorreispettivi(parsed);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        setCorreispettivi([]);
      }
    }
  }, []);

  // Salva i dati nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(corrispettivi));
  }, [corrispettivi]);

  const salvaCorreispettivo = (nuovoCorreispettivo: Corrispettivo) => {
    setCorreispettivi(prev => {
      // Rimuovi eventuali corrispettivi esistenti per la stessa data
      const filtrati = prev.filter(c => c.data !== nuovoCorreispettivo.data);
      // Aggiungi il nuovo corrispettivo
      return [...filtrati, nuovoCorreispettivo].sort((a, b) => a.data.localeCompare(b.data));
    });
  };

  const getCorreispettivoByDate = (data: Date): Corrispettivo | undefined => {
    const dataString = data.toISOString().split('T')[0];
    return corrispettivi.find(c => c.data === dataString);
  };

  const getAllCorreispettivi = (): Corrispettivo[] => {
    return [...corrispettivi];
  };

  const eliminaCorreispettivo = (data: string) => {
    setCorreispettivi(prev => prev.filter(c => c.data !== data));
  };

  return {
    corrispettivi,
    salvaCorreispettivo,
    getCorreispettivoByDate,
    getAllCorreispettivi,
    eliminaCorreispettivo
  };
};
