import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectsScreen } from "@/screens/ProjectsScreen";
import { ProjectDetailScreen } from "@/screens/ProjectDetailScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsScreen />} />
        <Route path="/projects/:id" element={<ProjectDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
