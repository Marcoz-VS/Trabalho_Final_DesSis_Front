import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginStudent from './pages/student/LoginStudent'
import RegisterStudent from './pages/student/RegisterStudent'
import HomeStudent from './pages/student/HomeStudent'
import ScoreStudent from './pages/student/ScoreStudent'
import ProfileStudent from './pages/student/ProfileStudent'
import FirstTimePassword from "./pages/student/FirstTimeUpdate";
import ClassStudent from "./pages/student/ClassStudent"
import ScheduleStudent from './pages/student/ScheduleStudent'
import EnrollmentStudent from './pages/student/EnrollmentStudent'
import Layout from "./components/Layout"
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

export default function App() {
  const { theme } = useContext(ThemeContext);
  const {user} = useAuth()

  return (
    <div className={theme}>
      <Layout>
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
        <Route
        path="/student/class"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <ClassStudent />
        }
      />
        <Route
        path="/student/schedule"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <ScheduleStudent />
        }
      />
      <Route
        path="/student/enrollment"
        element={
          user?.firstTime ? <Navigate to="/first-login" /> : <EnrollmentStudent />
        }
      />
    </Routes>
    </Layout>
    </div>
  );
}
