
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Calendar, TrendingUp } from "lucide-react";
import { useCorreispettivi } from "@/hooks/useCorreispettivi";
import { calcolaTotaliMensili, getMesi, getAnni } from "@/utils/calcoliUtils";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const VisualizzazioneMensile = () => {
  const currentDate = new Date();
  const [selectedMese, setSelectedMese] = useState(currentDate.getMonth() + 1);
  const [selectedAnno, setSelectedAnno] = useState(currentDate.getFullYear());
  
  const { getAllCorreispettivi } = useCorreispettivi();
  const corrispettivi = getAllCorreispettivi();
  
  const corrispettiviMensili = corrispettivi.filter(c => {
    const data = new Date(c.data);
    return data.getMonth() + 1 === selectedMese && data.getFullYear() === selectedAnno;
  }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const totali = calcolaTotaliMensili(corrispettiviMensili);
  const mesi = getMesi();
  const anni = getAnni(corrispettivi);

  const handleStampa = () => {
    const nomeFile = `Registro_Corrispettivi_${selectedMese.toString().padStart(2, '0')}_${selectedAnno}`;
    
    const contenutoStampa = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${nomeFile}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f5f5f5; }
          .totali { background-color: #e3f2fd; font-weight: bold; }
          .no-data { text-align: center; font-style: italic; }
        </style>
      </head>
      <body>
        <h1>Registro Corrispettivi - ${mesi.find(m => m.valore === selectedMese)?.nome} ${selectedAnno}</h1>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Contanti (€)</th>
              <th>POS (€)</th>
              <th>Totale (€)</th>
            </tr>
          </thead>
          <tbody>
            ${corrispettiviMensili.length > 0 ? 
              corrispettiviMensili.map(c => `
                <tr>
                  <td style="text-align: left;">${format(new Date(c.data), "dd/MM/yyyy", { locale: it })}</td>
                  <td>${c.contanti.toFixed(2)}</td>
                  <td>${c.pos.toFixed(2)}</td>
                  <td>${c.totale.toFixed(2)}</td>
                </tr>
              `).join('') :
              '<tr><td colspan="4" class="no-data">Nessun corrispettivo registrato per questo periodo</td></tr>'
            }
            ${corrispettiviMensili.length > 0 ? `
              <tr class="totali">
                <td><strong>TOTALI MENSILI</strong></td>
                <td><strong>${totali.contanti.toFixed(2)}</strong></td>
                <td><strong>${totali.pos.toFixed(2)}</strong></td>
                <td><strong>${totali.totale.toFixed(2)}</strong></td>
              </tr>
            ` : ''}
          </tbody>
        </table>
        <p style="text-align: right; margin-top: 30px; font-size: 12px;">
          Stampato il ${format(new Date(), "dd/MM/yyyy 'alle' HH:mm", { locale: it })}
        </p>
      </body>
      </html>
    `;

    const finestra = window.open('', '_blank');
    if (finestra) {
      finestra.document.write(contenutoStampa);
      finestra.document.close();
      finestra.print();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Selezione Periodo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mese</label>
              <Select value={selectedMese.toString()} onValueChange={(value) => setSelectedMese(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mesi.map((mese) => (
                    <SelectItem key={mese.valore} value={mese.valore.toString()}>
                      {mese.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Anno</label>
              <Select value={selectedAnno.toString()} onValueChange={(value) => setSelectedAnno(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anni.map((anno) => (
                    <SelectItem key={anno} value={anno.toString()}>
                      {anno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleStampa} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={corrispettiviMensili.length === 0}
              >
                <Printer className="mr-2 h-4 w-4" />
                Stampa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Registro - {mesi.find(m => m.valore === selectedMese)?.nome} {selectedAnno}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {corrispettiviMensili.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Contanti (€)</TableHead>
                    <TableHead className="text-right">POS (€)</TableHead>
                    <TableHead className="text-right">Totale (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corrispettiviMensili.map((corrispettivo) => (
                    <TableRow key={corrispettivo.data}>
                      <TableCell className="font-medium">
                        {format(new Date(corrispettivo.data), "dd/MM/yyyy", { locale: it })}
                      </TableCell>
                      <TableCell className="text-right">
                        €{corrispettivo.contanti.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        €{corrispettivo.pos.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        €{corrispettivo.totale.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-blue-50 font-bold">
                    <TableCell>TOTALI MENSILI</TableCell>
                    <TableCell className="text-right">€{totali.contanti.toFixed(2)}</TableCell>
                    <TableCell className="text-right">€{totali.pos.toFixed(2)}</TableCell>
                    <TableCell className="text-right">€{totali.totale.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun corrispettivo registrato per il periodo selezionato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizzazioneMensile;
