import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/indexpage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import axios from "axios";
import Homepage from "./pages/Homepage";
import { UserContextProvider } from "./UserContextProvider";
import CommunityQuizzes from "./pages/quiz/communityquizzes";
import ApiQuizzes from "./pages/quiz/apiquizzes";
import MyQuizzes from "./pages/quiz/myquizzes";
import QuizTaker from './pages/quiz/quiztaker'; 
axios.defaults.baseURL="http://localhost:4000"
axios.defaults.withCredentials=true
function App() {
  return (
    <UserContextProvider>

    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/myquizzes"element={<MyQuizzes/>} /> 
        <Route path="/communityquizzes" element={<CommunityQuizzes />} /> 
        <Route path="/apiquizzes" element={<ApiQuizzes />} /> 
        <Route path="/quiztaker/:quizId" element={<QuizTaker/>} />      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route index element={<IndexPage />} />

    </Routes>
    </UserContextProvider>

  );
}

export default App;
