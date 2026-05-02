import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function ScoreStudent() {
  const [scores, setScores] = useState([]);
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

    
const isDark = theme === "dark";

const themeStyles = {
  backgroundColor: isDark ? "#0f172a" : "#f5f5f5",
  color: isDark ? "#f8fafc" : "#111827",
  minHeight: "100vh",
  padding: "40px",
  transition: "all 0.3s ease",
  marginTop: "50px"
};

useEffect(() => {
  async function fetchScores() {
    try {
      const studentId =
        typeof user.student === "object"
          ? user.student?.id
          : user.student;

      if (!studentId) return;

      const enrollmentRes = await api.get(`/enrollment/student/${studentId}`);
      const enrollments = enrollmentRes.data.data;

      const enrollmentId = enrollments[0]?.id;

      console.log(enrollmentId)

      if (!enrollmentId) return;

      const data = await api.get(`/scores/enrollment/${enrollmentId}`);

      console.log(data)
      setScores(data.data.data);



    } catch (err) {
      console.error(err);
    }
  }

  if (user?.student) {
    fetchScores();
  }
}, [user])

  return (
    <div style={themeStyles}>
      <h2 style={{marginBottom: '50px'}}>Minhas Notas</h2>
  {scores.map((score) => (
<div key={score.id}  style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}>
  <h2>Avaliação: {score.assessment}</h2>
  <h3>Nota: {score.value}</h3>
</div>
      ))}
    </div>
  );
}