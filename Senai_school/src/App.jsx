import LoginStudent from './pages/student/LoginStudent.jsx'
import RegisterStudent from './pages/student/RegisterStudent.jsx'
import HomeStudent from './pages/student/HomeStudent'
import ScoreStudent from './pages/student/ScoreStudent'
import { Routes, Route } from "react-router-dom";


export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginStudent/>} />
        <Route path="/registerStudent" element={<RegisterStudent/>}/>
        <Route path="/homeStudent" element={<HomeStudent/>}/>
        <Route path="/student/scores" element={<ScoreStudent/>}/>
      </Routes> 
  )
}