import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

export default function EditProfileModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({
    phone: student.phone || "",
    birth_date: student.birth_date || "",
    avatar_url: student.avatar_url || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      phone: student.phone || "",
      birth_date: student.birth_date || "",
      avatar_url: student.avatar_url || "",
    });
    setError(null);
  }, [student]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.put(`/students/${student.id}`, form);
      onSave(res.data.data);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msgs = err.response?.data?.errors;
        setError(
          Array.isArray(msgs)
            ? msgs.join(" ")
            : err.response?.data?.message || "Não foi possível salvar.",
        );
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-profile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-profile-title">Editar perfil</h2>

        {error ? (
          <p className="feedback feedback--error" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="edit-phone">Telefone</label>
            <input
              id="edit-phone"
              name="phone"
              className="input"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="edit-birth">Data de nascimento</label>
            <input
              id="edit-birth"
              name="birth_date"
              type="date"
              className="input"
              value={form.birth_date}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="edit-avatar">URL do avatar</label>
            <input
              id="edit-avatar"
              name="avatar_url"
              className="input"
              placeholder="https://…"
              value={form.avatar_url}
              onChange={handleChange}
            />
          </div>

          <div className="btn-row btn-row--split">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
