import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Sorter = lazy(() => import("./pages/Sorter"));
const Results = lazy(() => import("./pages/Results"));
const Members = lazy(() => import("./pages/Members"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-emerald-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorter" element={<Sorter />} />
        <Route path="/results" element={<Results />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Suspense>
  );
}

export default App;