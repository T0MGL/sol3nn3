import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiftingTape from "./pages/LiftingTape";
import RizadorElectrico from "./pages/RizadorElectrico";
import LashSerum from "./pages/LashSerum";
import RetinalCelimax from "./pages/RetinalCelimax";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import ComingSoon from "./pages/ComingSoon";
import { useDisableDevTools } from "@/hooks/useDisableDevTools";

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce re-fetches and background updates for landing page
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
    },
  },
});

const App = () => {
  // Disable right-click and DevTools shortcuts
  useDisableDevTools();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* COMING-SOON-OFF: store routes parked behind holding page.
                Reversion: uncomment this block and delete the catch-all
                <Route path="*" element={<ComingSoon />} /> below.
            <Route path="/" element={<Index />} />
            <Route path="/lifting-tape" element={<LiftingTape />} />
            <Route path="/rizador-electrico" element={<RizadorElectrico />} />
            <Route path="/serum-pestanas" element={<LashSerum />} />
            <Route path="/retinal-celimax" element={<RetinalCelimax />} />
            <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
            <Route path="*" element={<NotFound />} />
            COMING-SOON-OFF */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
