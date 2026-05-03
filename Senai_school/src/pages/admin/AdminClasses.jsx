import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";
import { isProfessor } from "../../utils/roles";

const emptyForm = {
  professor_id: "",
  name: "",
  description: "",
  year: new Date().getFullYear(),
  semester: 1,
};

export default function AdminClasses() {
  const [rows, setRows] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [cRes, uRes] = await Promise.all([
        api.get("/classes"),
        api.get("/users"),
      ]);
      const userList = uRes.data.data || [];
      setRows(cRes.data.data || []);
      setProfessors(userList.filter(isProfessor));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function openCreate() {
    setForm(emptyForm);
    try {
      const { data } = await api.get("/users");
      const userList = data.data || [];
      setProfessors(userList.filter(isProfessor));
    } catch {
    }
    setModal("create");
  }

  async function openEdit(row) {
    try {
      const { data } = await api.get("/users");
      const userList = data.data || [];
      setProfessors(userList.filter(isProfessor));
    } catch {
    }
    setModal("edit");
    setForm({
      professor_id: row.professor_id ?? row.professor?.id ?? "",
      name: row.name ?? "",
      description: row.description ?? "",
      year: row.year ?? new Date().getFullYear(),
      semester: row.semester ?? 1,
      _id: row.id,
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "year" || name === "semester" || name === "professor_id"
        ? (value === "" ? "" : Number(value))
        : value,
    }));
  }

  async function submitCreate(e) {
    e.preventDefault();
    try {
      await api.post("/classes", {
        professor_id: Number(form.professor_id),
        name: form.name.trim(),
        description: form.description?.trim() || null,
        year: Number(form.year),
        semester: Number(form.semester),
      });
      setModal(null);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function submitEdit(e) {
    e.preventDefault();
    try {
      const payload = {};
      if (form.professor_id !== "") payload.professor_id = Number(form.professor_id);
      if (form.name?.trim()) payload.name = form.name.trim();
      if (form.description !== undefined) payload.description = form.description?.trim() || "";
      if (form.year) payload.year = Number(form.year);
      if (form.semester) payload.semester = Number(form.semester);

      await api.put(`/classes/${form._id}`, payload);
      setModal(null);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir esta turma?")) return;
    try {
      await api.delete(`/classes/${id}`);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Turmas</h1>
          <p className="admin-page-desc">Turmas letivas e professor responsável.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          Nova turma
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
                <th>Ano / Sem.</th>
                <th>Professor</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    {c.year} / {c.semester}
                  </td>
                  <td>{c.professor?.name ?? "—"}</td>
                  <td>
                    <div className="admin-actions-inline">
                      <button type="button" className="btn btn--secondary" onClick={() => openEdit(c)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn--secondary" onClick={() => handleDelete(c.id)}>
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

      {modal === "create" ? (
        <div className="modal-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Nova turma</h2>
            <form onSubmit={submitCreate}>
              <div className="field">
                <label>Professor</label>
                <select
                  name="professor_id"
                  className="input"
                  required
                  value={form.professor_id === "" ? "" : String(form.professor_id)}
                  onChange={handleChange}
                >
                  <option value="">Selecione…</option>
                  {professors.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Nome</label>
                <input name="name" className="input" required minLength={3} value={form.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Descrição</label>
                <input name="description" className="input" value={form.description} onChange={handleChange} />
              </div>
              <div className="admin-grid-2">
                <div className="field">
                  <label>Ano</label>
                  <input name="year" type="number" className="input" required value={form.year} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Semestre</label>
                  <select name="semester" className="input" value={form.semester} onChange={handleChange}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              </div>
              <div className="btn-row btn-row--split">
                <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {modal === "edit" ? (
        <div className="modal-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Editar turma #{form._id}</h2>
            <form onSubmit={submitEdit}>
              <div className="field">
                <label>Professor</label>
                <select
                  name="professor_id"
                  className="input"
                  value={form.professor_id === "" || form.professor_id == null ? "" : String(form.professor_id)}
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  {professors.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Nome</label>
                <input name="name" className="input" value={form.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Descrição</label>
                <input name="description" className="input" value={form.description} onChange={handleChange} />
              </div>
              <div className="admin-grid-2">
                <div className="field">
                  <label>Ano</label>
                  <input name="year" type="number" className="input" value={form.year} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Semestre</label>
                  <select name="semester" className="input" value={form.semester} onChange={handleChange}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
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
