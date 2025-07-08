
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InserimentoGiornaliero from "./InserimentoGiornaliero";
import VisualizzazioneMensile from "./VisualizzazioneMensile";
import { Calculator, FileText } from "lucide-react";

const RegistroCorreispettivi = () => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Calculator className="h-8 w-8" />
            Registro Corrispettivi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="inserimento" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="inserimento" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Inserimento Giornaliero
              </TabsTrigger>
              <TabsTrigger value="visualizzazione" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Visualizzazione e Stampa
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inserimento">
              <InserimentoGiornaliero />
            </TabsContent>
            
            <TabsContent value="visualizzazione">
              <VisualizzazioneMensile />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroCorreispettivi;
