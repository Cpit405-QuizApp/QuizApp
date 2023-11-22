import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/indexpage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import axios from "axios";

axios.defaults.baseURL="http://localhost:4000"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="/register" element={<RegisterPage />} />
        <Route index element={<IndexPage />} />

      <Route path="/login" element={<LoginPage />} />
      </Route>
    
    </Routes>
  );
}

export default App;
