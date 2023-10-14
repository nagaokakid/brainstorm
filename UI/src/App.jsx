import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        {/* Change the bottom line to test any pages */ }
        <Route path="/" element={<LoginPage />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
