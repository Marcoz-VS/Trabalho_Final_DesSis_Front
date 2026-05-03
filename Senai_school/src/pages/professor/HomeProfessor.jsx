import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function HomeProfessor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  const themeStyles = {
    backgroundColor: isDark ? "#0f172a" : "#f5f5f5",
    color: isDark ? "#f8fafc" : "#111827",
    minHeight: "83vh",
    padding: "40px",
    transition: "all 0.3s ease",
    marginTop: "50px"
  };

  function Card({ title, path }) {
    return (
      <div
        onClick={() => navigate(path)}
        style={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          background: isDark ? "#1e293b" : "#fff",
          color: isDark ? "#f8fafc" : "#111827",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {title}
      </div>
    );
  }

  return (
    <div style={themeStyles}>
      <h1 style={{ marginBottom: '50px' }}>Painel do Professor - {user?.name} 👨‍🏫</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        <Card title="Minhas Turmas" path="/professor/classes" />
        <Card title="Alunos" path="/professor/students" />
        <Card title="Lançar Notas" path="/professor/grades" />
      </div>
    </div>
  );
}
