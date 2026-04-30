import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Preloader from "./components/Preloader";

const Home = lazy(() => import("./pages/Home"));
const Sorter = lazy(() => import("./pages/Sorter"));
const Results = lazy(() => import("./pages/Results"));
const Members = lazy(() => import("./pages/Members"));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-kawaii">
    <div className="flex gap-2">
      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-3 h-3 rounded-full bg-sakura-400 animate-bounce" style={{ animationDelay: "120ms" }} />
      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "240ms" }} />
    </div>
  </div>
);

function App() {
  const [bootReady, setBootReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  // Mark boot complete on next frame — gives time for the first lazy chunk
  // to start fetching while the preloader is on screen.
  useEffect(() => {
    const id = requestAnimationFrame(() => setBootReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader
          ready={bootReady}
          onDone={() => setShowPreloader(false)}
        />
      )}

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorter" element={<Sorter />} />
          <Route path="/results" element={<Results />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
