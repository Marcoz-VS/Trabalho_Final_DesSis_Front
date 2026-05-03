import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";
import { isStudent } from "../../utils/roles";

const emptyCreate = {
  user_id: "",
  registration: "",
  birth_date: "",
  phone: "",
  avatar_url: "",
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    registration: "",
    birth_date: "",
    phone: "",
    avatar_url: "",
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [stRes, uRes] = await Promise.all([
        api.get("/students"),
        api.get("/users"),
      ]);
      setStudents(stRes.data.data || []);
      setUsers(uRes.data.data || []);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const studentUserIds = new Set(students.map((s) => s.user_id));
  const candidateUsers = users.filter(
    (u) => isStudent(u) && !studentUserIds.has(u.id),
  );

  function handleCreateChange(e) {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function openEdit(s) {
    const bd = s.birth_date;
    const birthStr =
      bd == null || bd === ""
        ? ""
        : typeof bd === "string"
          ? bd.slice(0, 10)
          : "";
    setEditForm({
      id: s.id,
      registration: s.registration ?? "",
      birth_date: birthStr,
      phone: s.phone ?? "",
      avatar_url: s.avatar_url ?? "",
    });
    setModal("edit");
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const payload = {
        user_id: Number(createForm.user_id),
        registration: createForm.registration.trim(),
      };
      if (createForm.birth_date) payload.birth_date = createForm.birth_date;
      if (createForm.phone?.trim()) payload.phone = createForm.phone.trim();
      if (createForm.avatar_url?.trim()) payload.avatar_url = createForm.avatar_url.trim();

      await api.post("/students", payload);
      setOpenCreate(false);
      setCreateForm(emptyCreate);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        registration: editForm.registration.trim(),
      };
      if (editForm.birth_date) {
        payload.birth_date = editForm.birth_date;
      } else {
        payload.birth_date = null;
      }
      if (editForm.phone?.trim()) {
        payload.phone = editForm.phone.trim();
      } else {
        payload.phone = null;
      }
      if (editForm.avatar_url?.trim()) {
        payload.avatar_url = editForm.avatar_url.trim();
      } else {
        payload.avatar_url = null;
      }

      await api.put(`/students/${editForm.id}`, payload);
      setModal(null);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir registro de aluno?")) return;
    try {
      await api.delete(`/students/${id}`);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Alunos</h1>
          <p className="admin-page-desc">Registro acadêmico vinculado a usuário com papel aluno.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setOpenCreate(true)}>
          Novo aluno
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
                <th>Matrícula</th>
                <th>Usuário</th>
                <th>E-mail</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.registration}</td>
                  <td>{s.user?.name ?? "—"}</td>
                  <td>{s.user?.email ?? "—"}</td>
                  <td>
                    <div className="admin-actions-inline">
                      <button type="button" className="btn btn--secondary" onClick={() => openEdit(s)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleDelete(s.id)}
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

      {openCreate ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setOpenCreate(false)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Novo aluno</h2>
            <form onSubmit={handleCreate}>
              <div className="field">
                <label htmlFor="st-user">Usuário (aluno sem perfil)</label>
                <select
                  id="st-user"
                  name="user_id"
                  className="input"
                  required
                  value={createForm.user_id === "" ? "" : String(createForm.user_id)}
                  onChange={handleCreateChange}
                >
                  <option value="">Selecione…</option>
                  {candidateUsers.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.name} ({u.email}) #{u.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="st-reg">Matrícula</label>
                <input
                  id="st-reg"
                  name="registration"
                  className="input"
                  required
                  minLength={3}
                  value={createForm.registration}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="field">
                <label htmlFor="st-birth">Nascimento (opcional)</label>
                <input
                  id="st-birth"
                  name="birth_date"
                  type="date"
                  className="input"
                  value={createForm.birth_date}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="field">
                <label htmlFor="st-phone">Telefone (opcional)</label>
                <input
                  id="st-phone"
                  name="phone"
                  className="input"
                  value={createForm.phone}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="field">
                <label htmlFor="st-avatar">URL avatar (opcional)</label>
                <input
                  id="st-avatar"
                  name="avatar_url"
                  className="input"
                  value={createForm.avatar_url}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="btn-row btn-row--split">
                <button type="button" className="btn btn--secondary" onClick={() => setOpenCreate(false)}>
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

      {modal === "edit" ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Editar aluno #{editForm.id}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="field">
                <label htmlFor="ed-reg">Matrícula</label>
                <input
                  id="ed-reg"
                  name="registration"
                  className="input"
                  required
                  minLength={3}
                  value={editForm.registration}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label htmlFor="ed-birth">Nascimento</label>
                <input
                  id="ed-birth"
                  name="birth_date"
                  type="date"
                  className="input"
                  value={editForm.birth_date}
                  onChange={handleEditChange}
                />
                <p className="feedback feedback--info" style={{ marginTop: "0.35rem" }}>
                  Limpe o campo para remover a data.
                </p>
              </div>
              <div className="field">
                <label htmlFor="ed-phone">Telefone</label>
                <input
                  id="ed-phone"
                  name="phone"
                  className="input"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label htmlFor="ed-avatar">URL avatar</label>
                <input
                  id="ed-avatar"
                  name="avatar_url"
                  className="input"
                  value={editForm.avatar_url}
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
