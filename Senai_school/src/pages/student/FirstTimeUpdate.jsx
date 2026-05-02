import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function FirstTimePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      return alert("As senhas não coincidem");
    }

    if (password.length < 6) {
      return alert("Senha deve ter no mínimo 6 caracteres");
    }

    try {
      setLoading(true);

const res = await api.patch(`/users/firstTimeUpdate/${user.id}`, {
  password
});

setUser({
  ...user,
  firstTime: false
});

localStorage.setItem("user", JSON.stringify({
  ...user,
  firstTime: false
}));

navigate("/homeStudent");

    } catch (err) {
      alert(err.response?.data?.message || "Erro ao definir senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2>Primeiro acesso </h2>
        <p>Defina sua nova senha para continuar</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f5f5f5"
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};