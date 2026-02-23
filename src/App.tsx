import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { initMetaPixel } from "@/lib/metaPixel";
import Index from "./pages/Index";
import { initClarity } from "./components/clarity";

// Lazy-load the 404 page — rarely visited, no need in the critical bundle
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID;
    if (clarityId) {
      initClarity(clarityId);
    }
  }, []);

  return (
    <CartProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
