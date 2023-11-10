import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import BrainStorm from "./pages/BrainStormPage";
import { DataContextProvider } from "./contexts/DataContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <DataContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/BrainStorm" element={<BrainStorm />} />
        </Routes>
      </BrowserRouter>
    </DataContextProvider>
  )
}

export default App
