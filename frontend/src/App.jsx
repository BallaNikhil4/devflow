import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/project/:projectId" element={<ProjectBoard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;