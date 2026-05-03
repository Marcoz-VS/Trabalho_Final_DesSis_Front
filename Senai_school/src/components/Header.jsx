import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import UpdatePassModal from "./UpdatePassModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDark = theme === "dark";

  function goProfile() {
    if (user?.role === "professor") navigate("/homeProfessor");
    else navigate("/student/profile");
  }

  return (
    <>
      <header className="app-header">
        <span className="app-header__brand">Sistema escolar</span>
        <div className="app-header__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {isDark ? "Claro" : "Escuro"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setOpenModal(true)}
          >
            Senha
          </button>
          <button type="button" className="btn btn--ghost" onClick={goProfile}>
            Perfil
          </button>
        </div>
      </header>

      <UpdatePassModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
