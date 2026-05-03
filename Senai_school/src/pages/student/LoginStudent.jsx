import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import axios from "axios";

export default function LoginStudent() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email != null || location.state?.password != null) {
      setForm({
        email: location.state.email ?? "",
        password: location.state.password ?? "",
      });
    }
  }, [location.state]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/login", form);

      const role = data.user.role;
      if (role !== "student" && role !== "admin" && role !== "professor") {
        setError("Perfil não suportado neste acesso.");
        return;
      }

      login(data.user, data.token);

      if (data.user.firstTime) {
        navigate("/first-login", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "professor") {
        navigate("/homeProfessor", { replace: true });
      } else {
        navigate("/homeStudent", { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Não foi possível entrar.");
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>Entrar</h2>
        <p className="auth-lead">Use o e-mail e a senha fornecidos no cadastro.</p>

        <form onSubmit={handleSubmit}>
          {error ? (
            <p className="feedback feedback--error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="input"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-1">
          <Link to="/registerStudent" className="link-accent">
            Criar conta (aluno)
          </Link>
          {" · "}
          <Link to="/registerProfessor" className="link-accent">
            Cadastro professor
          </Link>
        </p>
      </div>
    </div>
  );
}
