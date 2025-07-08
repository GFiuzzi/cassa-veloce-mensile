
import { Corrispettivo } from "@/hooks/useCorreispettivi";

export interface TotaliMensili {
  contanti: number;
  pos: number;
  totale: number;
}

export const calcolaTotaliMensili = (corrispettivi: Corrispettivo[]): TotaliMensili => {
  return corrispettivi.reduce(
    (acc, curr) => ({
      contanti: acc.contanti + curr.contanti,
      pos: acc.pos + curr.pos,
      totale: acc.totale + curr.totale
    }),
    { contanti: 0, pos: 0, totale: 0 }
  );
};

export const getMesi = () => [
  { valore: 1, nome: "Gennaio" },
  { valore: 2, nome: "Febbraio" },
  { valore: 3, nome: "Marzo" },
  { valore: 4, nome: "Aprile" },
  { valore: 5, nome: "Maggio" },
  { valore: 6, nome: "Giugno" },
  { valore: 7, nome: "Luglio" },
  { valore: 8, nome: "Agosto" },
  { valore: 9, nome: "Settembre" },
  { valore: 10, nome: "Ottobre" },
  { valore: 11, nome: "Novembre" },
  { valore: 12, nome: "Dicembre" }
];

export const getAnni = (corrispettivi: Corrispettivo[]): number[] => {
  const anniSet = new Set<number>();
  
  // Aggiungi l'anno corrente
  anniSet.add(new Date().getFullYear());
  
  // Aggiungi gli anni dai corrispettivi esistenti
  corrispettivi.forEach(c => {
    const anno = new Date(c.data).getFullYear();
    anniSet.add(anno);
  });
  
  // Converti in array e ordina in modo decrescente
  return Array.from(anniSet).sort((a, b) => b - a);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
