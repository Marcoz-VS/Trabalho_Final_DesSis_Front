import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function SettingsSidebar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Botão */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          fontSize: 20,
          padding: "10px",
          cursor: "pointer"
        }}
      >
        ⚙️
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-300px",
          width: "300px",
          height: "100%",
          background: "#222",
          color: "#fff",
          padding: "20px",
          transition: "0.3s"
        }}
      >
        <h2>Configurações</h2>

        {/* Tema */}
        <button
          onClick={toggleTheme}
          style={{
            width: "100%",
            margin: "10px 0",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          {theme === "light" ? "🌙 Tema escuro" : "☀️ Tema claro"}
        </button>

        {/* Senha */}
        <button
          style={{
            width: "100%",
            margin: "10px 0",
            padding: "10px",
            cursor: "pointer"
          }}
          onClick={() => alert("Abrir modal de senha")}
        >
          🔒 Alterar Senha
        </button>
      </div>
    </>
  );
}