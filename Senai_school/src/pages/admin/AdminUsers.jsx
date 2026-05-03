import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { apiErrorMessage } from "../../utils/apiErrorMessage";

const emptyEdit = {
  id: null,
  name: "",
  email: "",
  role: "student",
  password: "",
};

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyEdit);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/users");
      setRows(data.data || []);
    } catch (err) {
      setError(apiErrorMessage(err));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(u) {
    setForm({
      id: u.id,
      name: u.name ?? "",
      email: u.email ?? "",
      role: String(u.role ?? "student").trim().toLowerCase(),
      password: "",
    });
    setModal("edit");
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submitEdit(e) {
    e.preventDefault();
    const editingSelf = form.id != null && String(form.id) === String(me?.id);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      };
      if (!editingSelf) {
        payload.role = form.role;
      }
      if (form.password?.trim()) {
        payload.password = form.password.trim();
      }
      await api.put(`/users/${form.id}`, payload);
      setModal(null);
      setForm(emptyEdit);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (String(id) === String(me?.id)) {
      alert("Você não pode excluir a própria conta nesta tela.");
      return;
    }
    if (!window.confirm("Excluir este usuário? Esta ação pode remover dados ligados.")) return;
    try {
      await api.delete(`/users/${id}`);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  const editingSelf = form.id != null && String(form.id) === String(me?.id);

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Usuários</h1>
          <p className="admin-page-desc">Contas do sistema (sem senhas).</p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={load} disabled={loading}>
          Atualizar
        </button>
      </div>

      {error ? (
        <p className="feedback feedback--error" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="admin-actions-inline">
                      <button type="button" className="btn btn--secondary" onClick={() => openEdit(u)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleDelete(u.id)}
                        disabled={String(u.id) === String(me?.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal === "edit" ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Editar usuário #{form.id}</h2>
            <form onSubmit={submitEdit}>
              <div className="field">
                <label htmlFor="adm-u-name">Nome</label>
                <input
                  id="adm-u-name"
                  name="name"
                  className="input"
                  required
                  minLength={3}
                  value={form.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label htmlFor="adm-u-email">E-mail</label>
                <input
                  id="adm-u-email"
                  name="email"
                  type="email"
                  className="input"
                  required
                  value={form.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label htmlFor="adm-u-role">Função</label>
                <select
                  id="adm-u-role"
                  name="role"
                  className="input"
                  value={form.role}
                  onChange={handleEditChange}
                  disabled={editingSelf}
                >
                  <option value="admin">admin</option>
                  <option value="professor">professor</option>
                  <option value="student">student</option>
                </select>
                {editingSelf ? (
                  <p className="feedback feedback--info" style={{ marginTop: "0.5rem" }}>
                    Você não pode alterar sua própria função aqui (evita bloquear o acesso).
                  </p>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="adm-u-pw">Nova senha (opcional)</label>
                <input
                  id="adm-u-pw"
                  name="password"
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  placeholder="Deixe em branco para manter"
                  value={form.password}
                  onChange={handleEditChange}
                />
              </div>
              <div className="btn-row btn-row--split">
                <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
