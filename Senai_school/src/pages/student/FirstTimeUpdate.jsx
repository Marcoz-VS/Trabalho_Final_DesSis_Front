import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function FirstTimePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/users/firstTimeUpdate/${user.id}`, { password });

      const next = { ...user, firstTime: false };
      setUser(next);
      localStorage.setItem("user", JSON.stringify(next));
      navigate(
        user.role === "admin"
          ? "/admin"
          : user.role === "professor"
            ? "/homeProfessor"
            : "/homeStudent",
        { replace: true },
      );
    } catch (err) {
      const msgs = err?.response?.data?.errors;
      setError(
        Array.isArray(msgs)
          ? msgs.join(" ")
          : err?.response?.data?.message || "Não foi possível salvar a senha.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>Primeiro acesso</h2>
        <p className="auth-lead">Defina uma nova senha para continuar usando o sistema.</p>

        <form onSubmit={handleSubmit}>
          {error ? (
            <p className="feedback feedback--error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="field">
            <label htmlFor="ft-pass">Nova senha</label>
            <input
              id="ft-pass"
              type="password"
              className="input"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label htmlFor="ft-confirm">Confirmar senha</label>
            <input
              id="ft-confirm"
              type="password"
              className="input"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Salvando…" : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
