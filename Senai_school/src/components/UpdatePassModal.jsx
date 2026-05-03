import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

export default function UpdatePassModal({ open, onClose }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setForm({ current_password: "", new_password: "" });
      setMessage(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.put("/users/change-password", form);
      setMessage(res.data.message || "Senha alterada.");
      setForm({ current_password: "", new_password: "" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msgs = err.response?.data?.errors;
        setError(
          Array.isArray(msgs)
            ? msgs.join(" ")
            : err.response?.data?.message || "Não foi possível alterar a senha.",
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
        aria-labelledby="modal-pass-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-pass-title">Alterar senha</h2>

        {error ? (
          <p className="feedback feedback--error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="feedback feedback--success" role="status">
            {message}
          </p>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="modal-current">Senha atual</label>
            <input
              id="modal-current"
              type="password"
              name="current_password"
              className="input"
              value={form.current_password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="field">
            <label htmlFor="modal-new">Nova senha</label>
            <input
              id="modal-new"
              type="password"
              name="new_password"
              className="input"
              value={form.new_password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="btn-row btn-row--split">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Fechar
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
