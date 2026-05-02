import { useState } from "react";
import api from "../services/api";

export default function UpdatePassModal({ open, onClose }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: ""
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null; 

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/users/change-password", form);

      alert(res.data.message || "Senha alterada com sucesso!");
      onClose();

    } catch (err) {
      alert(err.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Alterar Senha</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="password" 
            name="current_password"
            placeholder="Senha atual"
            value={form.current_password}
            onChange={handleChange}
            required
          />

          <input
            type="password" 
            name="new_password"
            placeholder="Nova senha"
            value={form.new_password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>

          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  margin: "100px auto",
  width: 300,
};