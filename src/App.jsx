import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sorter from "./pages/Sorter"; // We'll create this next
import Results from "./pages/Results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sorter" element={<Sorter />} />
      <Route path="/results" element={<Results />} />
      
    </Routes>
  );
}

export default App;