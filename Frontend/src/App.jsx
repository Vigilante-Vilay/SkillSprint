import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/SignupPage";
import OtpPage from "./pages/OtpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import CreateCourses from "./pages/CreateCourses";


function App(){
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/verify-otp" element={<OtpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/create-course" element={<CreateCourses/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;