import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { DataContextProvider } from "./contexts/DataContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  localStorage.clear();
  return (
    <DataContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </DataContextProvider>
  )
}

export default App
