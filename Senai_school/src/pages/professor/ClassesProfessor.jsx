import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function ClassesProfessor() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

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
    async function fetchClasses() {
      try {
        const response = await api.get("/classes");
        setClasses(response.data.data || response.data);
      } catch (err) {
        console.error("Erro ao buscar turmas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  return (
    <div style={themeStyles}>
      <h2 style={{ marginBottom: "50px" }}>Gerenciamento de Turmas</h2>

      {loading ? (
        <p>Carregando turmas...</p>
      ) : classes.length === 0 ? (
        <p>Nenhuma turma encontrada.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {classes.map((item) => (
            <div key={item.id} style={{
              background: isDark ? "#1e293b" : "#fff",
              border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{item.name}</h3>
              <p><strong>Ano:</strong> {item.year}</p>
              <p><strong>Semestre:</strong> {item.semester}</p>
              <button 
                onClick={() => navigate(`/professor/grades?classId=${item.id}`)}
                style={{
                  marginTop: "15px",
                  padding: "8px 16px",
                  backgroundColor: "#1a1a2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Ver Alunos / Notas
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
