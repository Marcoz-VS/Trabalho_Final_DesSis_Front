import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import UpdatePassModal from "./UpdatePassModal";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const isDark = theme === "dark";

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
        <div style={{ fontWeight: "bold" }}>
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

          <button
            style={buttonStyle}
            onClick={() => navigate("/student/profile")}
          >
            👤 Perfil
          </button>
        </div>
      </header>

      <UpdatePassModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}