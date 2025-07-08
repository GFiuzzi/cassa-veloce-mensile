
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, Save, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCorreispettivi } from "@/hooks/useCorreispettivi";
import { toast } from "sonner";

const InserimentoGiornaliero = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [contanti, setContanti] = useState("");
  const [pos, setPos] = useState("");
  const { salvaCorreispettivo, getCorreispettivoByDate } = useCorreispettivi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contanti && !pos) {
      toast.error("Inserire almeno un importo (contanti o POS)");
      return;
    }

    const contantiNum = parseFloat(contanti) || 0;
    const posNum = parseFloat(pos) || 0;
    
    if (contantiNum < 0 || posNum < 0) {
      toast.error("Gli importi non possono essere negativi");
      return;
    }

    const esistente = getCorreispettivoByDate(date);
    
    salvaCorreispettivo({
      data: format(date, "yyyy-MM-dd"),
      contanti: contantiNum,
      pos: posNum,
      totale: contantiNum + posNum
    });

    toast.success(esistente ? "Corrispettivo aggiornato con successo!" : "Corrispettivo salvato con successo!");
    setContanti("");
    setPos("");
  };

  const correispettivoEsistente = getCorreispettivoByDate(date);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Inserimento Incasso Giornaliero
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd MMMM yyyy", { locale: it }) : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="pointer-events-auto"
                  locale={it}
                />
              </PopoverContent>
            </Popover>
          </div>

          {correispettivoEsistente && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                Corrispettivo esistente per questa data:
              </p>
              <p className="text-sm text-yellow-700">
                Contanti: €{correispettivoEsistente.contanti.toFixed(2)} | 
                POS: €{correispettivoEsistente.pos.toFixed(2)} | 
                Totale: €{correispettivoEsistente.totale.toFixed(2)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contanti">Incasso Contanti (€)</Label>
              <Input
                id="contanti"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={contanti}
                onChange={(e) => setContanti(e.target.value)}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pos">Incasso POS (€)</Label>
              <Input
                id="pos"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={pos}
                onChange={(e) => setPos(e.target.value)}
                className="text-right"
              />
            </div>
          </div>

          {(contanti || pos) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                Totale Giornaliero: €{((parseFloat(contanti) || 0) + (parseFloat(pos) || 0)).toFixed(2)}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            {correispettivoEsistente ? "Aggiorna" : "Salva"} Corrispettivo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InserimentoGiornaliero;
