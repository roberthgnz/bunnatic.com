"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBusinessFromGoogle } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search, MapPin, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function NewSitePage({ params }: { params: Promise<{ locale: string }> }) {
  // Use 'any' for now to avoid complex locale typing issues in this snippet, 
  // in real code we should unwrap params properly
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [step, setStep] = useState<"search" | "analyzing" | "preview">("search");
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      // Re-using the public API route for search
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}&lang=es`);
      const data = await res.json();
      if (data.results) {
        setPlaces(data.results);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      toast.error("Error al buscar negocios");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = async (place: any) => {
    setSelectedPlace(place);
    setStep("analyzing");
    
    // Simulate analysis + fetch details
    try {
      const res = await fetch(`/api/places/details?place_id=${place.place_id}&lang=es`);
      const data = await res.json();
      if (!data.result) throw new Error("No details");
      setPlaceDetails(data.result);
      
      // Artificial delay for "Analysis" effect
      setTimeout(() => setStep("preview"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener detalles");
      setStep("search");
    }
  };

  const handleCreate = async () => {
    if (!placeDetails) return;
    setCreating(true);
    
    const result = await createBusinessFromGoogle(placeDetails);
    
    if (result?.error) {
      toast.error(result.error);
      setCreating(false);
    } else {
      toast.success("Sitio web creado correctamente");
      router.push(`/es/dashboard/businesses/${result.slug}`); // Assuming 'es' or we need to get locale from params
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Crear nuevo sitio web</h1>

      <AnimatePresence mode="wait">
        {step === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-6">
              <form onSubmit={handleSearch} className="relative mb-6">
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: Restaurante Casa Pepe"
                    className="h-12 text-lg"
                  />
                  <Button type="submit" disabled={isSearching} className="h-12 w-12 p-0">
                    {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                  </Button>
                </div>
              </form>

              <div className="space-y-2">
                {places.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => handleSelectPlace(place)}
                    className="w-full text-left p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-3"
                  >
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{place.name}</h3>
                      <p className="text-sm text-gray-500">{place.formatted_address}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 mt-1" />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Analizando negocio con IA...</h2>
            <p className="text-gray-500">Generando estructura, textos y diseño.</p>
          </motion.div>
        )}

        {step === "preview" && placeDetails && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Datos Extraídos</h3>
                <h2 className="text-xl font-bold mb-4">{placeDetails.name}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4" />
                    {placeDetails.formatted_address}
                  </div>
                  {placeDetails.rating && (
                    <div className="flex gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      {placeDetails.rating} ({placeDetails.user_ratings_total} reseñas)
                    </div>
                  )}
                </div>
              </Card>

              <Button 
                onClick={handleCreate} 
                disabled={creating}
                className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando sitio...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Crear Sitio Web
                  </>
                )}
              </Button>
              
              <Button variant="ghost" onClick={() => setStep("search")} className="w-full">
                Volver a buscar
              </Button>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border rounded-xl shadow-lg overflow-hidden h-[600px] overflow-y-auto relative">
                {/* Simple Preview */}
                <div className="bg-slate-900 text-white p-12 text-center">
                  <h1 className="text-3xl font-bold mb-4">{placeDetails.name}</h1>
                  <p className="text-gray-300">
                    {placeDetails.editorial_summary?.overview || "Tu negocio, ahora con una presencia online profesional."}
                  </p>
                </div>
                <div className="p-8 grid gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Sobre nosotros</h3>
                    <p className="text-gray-600">
                      En {placeDetails.name}, nos dedicamos a ofrecer el mejor servicio.
                      {placeDetails.rating > 4.5 && " Nuestros clientes nos avalan con una valoración excelente."}
                    </p>
                  </div>
                  {placeDetails.reviews && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Opiniones</h3>
                      <div className="grid gap-4">
                        {placeDetails.reviews.slice(0, 2).map((r: any, i: number) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-lg text-sm">
                            <p className="italic mb-2">"{r.text}"</p>
                            <p className="font-bold text-xs">- {r.author_name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
