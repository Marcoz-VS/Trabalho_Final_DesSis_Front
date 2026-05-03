import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";

export default function AdminScores() {
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [enrollPick, setEnrollPick] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createForm, setCreateForm] = useState({
    enrollment_id: "",
    assessment: "",
    value: "",
  });
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ assessment: "", value: "" });

  async function loadScores() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/scores");
      setRows(data.data || []);
    } catch (err) {
      setError(apiErrorMessage(err));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadClasses() {
    try {
      const { data } = await api.get("/classes");
      setClasses(data.data || []);
    } catch {
    }
  }

  useEffect(() => {
    loadScores();
    loadClasses();
  }, []);

  async function loadEnrollmentsForCreate(classId) {
    setClassFilter(classId);
    setCreateForm((f) => ({ ...f, enrollment_id: "" }));
    if (!classId) {
      setEnrollPick([]);
      return;
    }
    try {
      const { data } = await api.get(`/enrollment/class/${classId}`);
      setEnrollPick(data.data || []);
    } catch (err) {
      alert(apiErrorMessage(err));
      setEnrollPick([]);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.post("/scores", {
        enrollment_id: Number(createForm.enrollment_id),
        assessment: createForm.assessment.trim(),
        value: Number(createForm.value),
      });
      setCreateForm({ enrollment_id: "", assessment: "", value: "" });
      setClassFilter("");
      setEnrollPick([]);
      await loadScores();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir esta nota?")) return;
    try {
      await api.delete(`/scores/${id}`);
      await loadScores();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  function openEdit(row) {
    setEditRow(row);
    setEditForm({
      assessment: row.assessment ?? "",
      value: row.value ?? "",
    });
  }

  async function submitEdit(e) {
    e.preventDefault();
    if (!editRow) return;
    try {
      await api.patch(`/scores/${editRow.id}`, {
        assessment: editForm.assessment.trim(),
        value: Number(editForm.value),
      });
      setEditRow(null);
      await loadScores();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Notas</h1>
          <p className="admin-page-desc">Todas as avaliações. Criação por matrícula da turma.</p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadScores} disabled={loading}>
          Atualizar
        </button>
      </div>

      {error ? (
        <p className="feedback feedback--error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-card-form">
        <h3>Nova nota</h3>
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Turma (para listar matrículas)</label>
            <select
              className="input"
              value={classFilter}
              onChange={(e) => loadEnrollmentsForCreate(e.target.value)}
            >
              <option value="">Selecione…</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.year}/{c.semester})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Matrícula (enrollment)</label>
            <select
              className="input"
              required
              value={createForm.enrollment_id}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, enrollment_id: e.target.value }))
              }
            >
              <option value="">—</option>
              {enrollPick.map((en) => (
                <option key={en.id} value={en.id}>
                  #{en.id} — {en.student?.user?.name ?? en.student_id}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-grid-2">
            <div className="field">
              <label>Avaliação</label>
              <input
                className="input"
                required
                minLength={2}
                value={createForm.assessment}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, assessment: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Nota (0–10)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                min={0}
                max={10}
                required
                value={createForm.value}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, value: e.target.value }))
                }
              />
            </div>
          </div>
          <button type="submit" className="btn btn--primary" style={{ width: "auto" }}>
            Registrar nota
          </button>
        </form>
      </div>

      {loading ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Avaliação</th>
                <th>Nota</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.enrollment?.student?.user?.name ?? "—"}</td>
                  <td>{s.enrollment?.class?.name ?? "—"}</td>
                  <td>{s.assessment}</td>
                  <td>{s.value}</td>
                  <td>
                    <div className="admin-actions-inline">
                      <button type="button" className="btn btn--secondary" onClick={() => openEdit(s)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn--secondary" onClick={() => handleDelete(s.id)}>
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

      {editRow ? (
        <div className="modal-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && setEditRow(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Editar nota #{editRow.id}</h2>
            <form onSubmit={submitEdit}>
              <div className="field">
                <label>Avaliação</label>
                <input
                  className="input"
                  required
                  value={editForm.assessment}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, assessment: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Nota</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  min={0}
                  max={10}
                  required
                  value={editForm.value}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, value: e.target.value }))
                  }
                />
              </div>
              <div className="btn-row btn-row--split">
                <button type="button" className="btn btn--secondary" onClick={() => setEditRow(null)}>
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
