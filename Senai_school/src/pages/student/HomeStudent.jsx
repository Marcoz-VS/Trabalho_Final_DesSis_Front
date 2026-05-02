import { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SettingsSidebar from '../../components/Sidebar'
import { ThemeContext } from '../../context/ThemeContext';

export default function HomeStudent() {
  const navigate = useNavigate();
  const { user } = useAuth()
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext); 

    const themeStyles = {
    backgroundColor: theme === 'light' ? '#f5f5f5' : '#222',
    color: theme === 'light' ? '#000' : '#fff',
    minHeight: '100vh',
    padding: '40px',
    transition: 'all 0.3s ease',
  };

  function Card({ title, path }) {
    return (
      <div
        onClick={() => navigate(path)}
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          fontWeight: "bold"
        }}
      >
        {title}
      </div>
    );
  }

  return (
   <div style={themeStyles}>
    
    <SettingsSidebar />

      <h1>Bem-vindo {user?.name} 👋</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        marginTop: "20px"
      }}>
        <Card title="📚 Turma" path="/student/class" />
        <Card title="🗓️ Horários" path="/student/schedule" />
        <Card title="📊 Notas" path="/student/scores" />
        <Card title="🎓 Matrícula" path="/student/enrollment" />
        <Card title="👤 Perfil" path="/student/profile" />
      </div>
    </div>
  );
}