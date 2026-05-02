import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginStudent from './pages/student/LoginStudent.jsx'
import RegisterStudent from './pages/student/RegisterStudent.jsx'
import HomeStudent from './pages/student/HomeStudent'
import ScoreStudent from './pages/student/ScoreStudent'
import ProfileStudent from './pages/student/ProfileStudent'
import FirstTimePassword from "./pages/student/FirstTimeUpdate.jsx";

export default function App() {
  const { user } = useAuth();
  console.log("USER:", user.firstTime);

  return (
    <Routes>
      <Route path="/" element={<LoginStudent />} />
      <Route path="/registerStudent" element={<RegisterStudent />} />

      <Route path="/first-login" element={<FirstTimePassword />} />

      <Route
        path="/homeStudent"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <HomeStudent />
        }
      />

      <Route
        path="/student/scores"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <ScoreStudent />
        }
      />

      <Route
        path="/student/profile"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <ProfileStudent />
        }
      />
    </Routes>
  );
}