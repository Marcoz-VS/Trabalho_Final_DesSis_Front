import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import axios from "axios";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/register/student", { ...form });
      setSuccess({
        email: data.data.email,
        temporaryPassword: data.data.temporaryPassword,
      });
    } catch (err) {
      let message = "Erro ao cadastrar";
      if (axios.isAxiosError(err)) {
        const backendErrors = err.response?.data?.errors;
        message = backendErrors
          ? backendErrors.join(" · ")
          : err.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    if (!success) return;
    navigate("/", {
      state: {
        email: success.email,
        password: success.temporaryPassword,
      },
    });
  }

  if (success) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h2>Conta criada</h2>
          <p className="auth-lead">
            Guarde estes dados para o primeiro acesso. Você pode copiar cada
            campo e colar no login.
          </p>

          <div className="credential-block">
            <dl style={{ margin: 0 }}>
              <dt>E-mail</dt>
              <dd>{success.email}</dd>
              <dt>Senha provisória</dt>
              <dd>{success.temporaryPassword}</dd>
            </dl>
            <div className="credential-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => copyText(success.email)}
              >
                Copiar e-mail
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => copyText(success.temporaryPassword)}
              >
                Copiar senha
              </button>
            </div>
          </div>

          <button type="button" className="btn btn--primary" onClick={goToLogin}>
            Ir para o login
          </button>

          <p className="text-center mt-1">
            <Link to="/" className="link-muted">
              Já tenho outra conta
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>Criar conta</h2>
        <p className="auth-lead">Informe seu nome completo. O sistema gerará e-mail e senha.</p>

        <form onSubmit={handleSubmit}>
          {error ? (
            <p className="feedback feedback--error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="field">
            <label htmlFor="reg-name">Nome completo</label>
            <input
              id="reg-name"
              name="name"
              className="input"
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Cadastrando…" : "Cadastrar"}
          </button>
        </form>

        <p className="text-center mt-1">
          <Link to="/registerProfessor" className="link-muted">
            Cadastro professor
          </Link>
          {" · "}
          <Link to="/" className="link-accent">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
