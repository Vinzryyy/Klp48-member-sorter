import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sorter from "./pages/Sorter"; 
import Results from "./pages/Results";
import Members from "./pages/Members";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sorter" element={<Sorter />} />
      <Route path="/results" element={<Results />} />
      <Route path="/members" element={<Members />} />
    </Routes>
  );
}

export default App;