import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import GameDetailPage from "./pages/GameDetailPage";
import MyLibraryPage from "./pages/MyLibraryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="games/:id" element={<GameDetailPage />} />
        <Route path="library" element={<MyLibraryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
