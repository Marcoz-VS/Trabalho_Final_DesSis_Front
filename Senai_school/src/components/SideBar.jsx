import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import UpdatePassModal from "./UpdatePassModal";

export default function SettingsSidebar() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
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


        <button
          onClick={toggleTheme}
          style={item}
        >
          {theme === "light" ? "Tema escuro" : "Tema claro"}
        </button>

        <button
          style={item}
          onClick={() => setOpenModal(true)}
        >
          Alterar Senha
        </button>
      </div>

      {/* Modal */}
      <UpdatePassModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

const item = {
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  cursor: "pointer"
};