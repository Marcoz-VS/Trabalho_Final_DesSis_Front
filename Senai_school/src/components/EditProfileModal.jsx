import { useState } from "react";
import api from "../services/api";

export default function EditProfileModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({
    phone: student.phone || "",
    birth_date: student.birth_date || "",
    avatar_url: student.avatar_url || "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await api.put(`/students/${student.id}`, form);

      onSave(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Editar Perfil</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
          />

          <input
            name="avatar_url"
            placeholder="URL do avatar"
            value={form.avatar_url}
            onChange={handleChange}
          />

          <button type="submit">Salvar</button>
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