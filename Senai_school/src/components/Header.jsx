import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import UpdatePassModal from "./UpdatePassModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const isDark = theme === "dark";

  const getHomePath = () => {
    if (user?.role === "admin") return "/homeAdmin";
    if (user?.role === "professor") return "/homeProfessor";
    return "/homeStudent";
  };

  const getProfilePath = () => {
    if (user?.role === "professor") return "/professor/profile";
    if (user?.role === "admin") return "/admin/profile";
    return "/student/profile";
  };

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  background: isDark ? "#1e293b" : "#fff",
  color: isDark ? "#f8fafc" : "#111827",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000
};

  const buttonStyle = {
    marginLeft: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: isDark ? "#334155" : "#e5e7eb",
    color: isDark ? "#f8fafc" : "#111827"
  };

  return (
    <>
      <header style={headerStyle}>
        <div 
          style={{ fontWeight: "bold", cursor: "pointer" }} 
          onClick={() => navigate(getHomePath())}
        >
          Sistema Escolar
        </div>

        <div>
          <button style={buttonStyle} onClick={toggleTheme}>
            {isDark ? "🌞 Light" : "🌙 Dark"}
          </button>

          <button
            style={buttonStyle}
            onClick={() => setOpenModal(true)}
          >
            🔐 Senha
          </button>

          {user && (
            <>
              <button
                style={buttonStyle}
                onClick={() => navigate(getProfilePath())}
              >
                👤 Perfil
              </button>
              <button
                style={{ ...buttonStyle, background: "#ef4444", color: "white" }}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                🚪 Sair
              </button>
            </>
          )}
        </div>
      </header>

      <UpdatePassModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}