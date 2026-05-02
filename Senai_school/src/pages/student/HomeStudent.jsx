import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function HomeStudent() {
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
        textAlign: "center"
      }}
    >
      {title}
    </div>
  );
}

  return (
    <div style={themeStyles}>
      <h1 style={{marginBottom: '50px'}}>Bem-vindo {user?.name} 👋</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        marginTop: "20px"
      }}>
        <Card title="📚 Turmas" path="/student/class" />
        <Card title="🗓️ Horários" path="/student/schedule" />
        <Card title="📊 Notas" path="/student/scores" />
        <Card title="🎓 Matrículas" path="/student/enrollment" />
      </div>
    </div>
  );
}