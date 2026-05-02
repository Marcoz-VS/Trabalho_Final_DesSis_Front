import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function ClassStudent() {
  const [classes, setClass] = useState([]);
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
    async function fetchClass() {
      try {
        const studentId =
          typeof user.student === "object"
            ? user.student?.id
            : user.student;

        if (!studentId) return;

        const classRes = await api.get(`/enrollment/student/${studentId}`);
        const classess = classRes.data.data;

        setClass(classess);

        console.log(classess);
      } catch (err) {
        console.error(err);
      }
    }

    if (user?.student) {
      fetchClass();
    }
  }, [user]);

  return (
    <div style={themeStyles}>
      <h2 style={{ marginBottom: "50px" }}>Minhas Turmas</h2>

      {classes.map((classe) => (
        <div key={classe.id}  style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}>
          <h2>Turma: {classe.class?.name}</h2>
          <h3>Ano: {classe.class?.year}</h3>
          <h3>Semestre: {classe.class?.semester}</h3>
        </div>
      ))}
    </div>
  );
}