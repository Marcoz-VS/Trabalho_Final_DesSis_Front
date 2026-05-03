import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

export default function StudentModal({ student, onClose, onSave }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    name: "",
    registration: "",
    phone: "",
    birth_date: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        registration: student.registration || "",
        phone: student.phone || "",
        birth_date: student.birth_date || "",
        avatar_url: student.avatar_url || ""
      });
    }
  }, [student]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let response;
      if (student?.id) {
        response = await api.put(`/students/${student.id}`, form);
        alert("Aluno atualizado com sucesso!");
      } else {
        response = await api.post("/students", form);
        alert("Aluno criado com sucesso!");
      }
      onSave(response.data.data || response.data);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar aluno:", err);
      alert("Erro ao salvar aluno. Verifique os dados.");
    }
  }

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000
  };

  const contentStyle = {
    background: isDark ? "#1e293b" : "#fff",
    color: isDark ? "#f8fafc" : "#111827",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0 20px 0",
    borderRadius: "6px",
    border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
    background: isDark ? "#0f172a" : "#fff",
    color: isDark ? "#f8fafc" : "#111827"
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3>{student ? "Editar Aluno" : "Novo Aluno"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Nome Completo:</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Matrícula:</label>
          <input
            style={inputStyle}
            value={form.registration}
            onChange={(e) => setForm({ ...form, registration: e.target.value })}
            required
          />

          <label>Telefone:</label>
          <input
            style={inputStyle}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label>Data de Nascimento:</label>
          <input
            style={inputStyle}
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          />

          <label>URL do Avatar:</label>
          <input
            style={inputStyle}
            placeholder="http://..."
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: isDark ? "#334155" : "#e5e7eb",
                color: isDark ? "#f8fafc" : "#111827"
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#1a1a2e",
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
