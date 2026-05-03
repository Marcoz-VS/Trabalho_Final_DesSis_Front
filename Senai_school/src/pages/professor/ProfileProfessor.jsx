import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfileProfessor() {
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

  return (
    <div style={themeStyles}>
      <h2>Meu Perfil (Professor)</h2>

      <div style={{ 
        border: "1px solid #ccc", 
        padding: "30px", 
        borderRadius: '8px', 
        marginTop: '40px',
        background: isDark ? "#1e293b" : "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
           <div style={{ 
             width: "80px", 
             height: "80px", 
             borderRadius: "50%", 
             background: "#1a1a2e", 
             color: "white",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             fontSize: "32px"
           }}>
             {user?.name?.charAt(0)}
           </div>
           <div>
             <h3 style={{ margin: 0 }}>{user?.name}</h3>
             <p style={{ margin: 0, opacity: 0.7 }}>{user?.email}</p>
           </div>
        </div>

        <p style={{ fontSize: '18px' }}>
          <strong>Cargo:</strong> Professor
        </p>

        <p style={{ fontSize: '18px' }}>
          <strong>Acesso:</strong> Sistema Acadêmico
        </p>
        
        <button style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1a1a2e",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Editar Dados (Em breve)
        </button>
      </div>
    </div>
  );
}
