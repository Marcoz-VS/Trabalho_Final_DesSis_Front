import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function EnrollmentStudent() {
  const [ enrollments, setEnrollments] = useState([]);
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
    async function fetchEnrollments() {
      try {
         
const studentId =
  typeof user.student === "object"
    ? user.student?.id
    : user.student;

        const enrollmentRes = await api.get(`/enrollment/student/${studentId}`);
        const enrollment = enrollmentRes.data.data;

        console.log(enrollment);

        setEnrollments(enrollment);

      } catch (err) {
        console.error(err);
      }
    }

    fetchEnrollments();

  }, []);

  function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

return (
  <div style={themeStyles}>
    <h2 style={{ marginBottom: "30px" }}>Minhas Matrículas</h2>

    {enrollments.map((enrollment) => (
      <div
        key={enrollment.id}
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Turma: {enrollment.class?.name}</h2>

        <h3>Ano: {enrollment.class?.year}</h3>
        <h3>Semestre: {enrollment.class?.semester}</h3>

        <h4>Status: {enrollment.status}</h4>
        <h4>Data da matrícula: {formatDate(enrollment.enrolled_at)}</h4>
      </div>
    ))}
  </div>
);
}