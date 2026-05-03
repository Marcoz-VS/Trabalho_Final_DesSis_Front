import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";

const DAYS = [
  { v: "monday", l: "Segunda" },
  { v: "tuesday", l: "Terça" },
  { v: "wednesday", l: "Quarta" },
  { v: "thursday", l: "Quinta" },
  { v: "friday", l: "Sexta" },
  { v: "saturday", l: "Sábado" },
];

function sliceTime(t) {
  if (!t) return "";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

export default function AdminSchedules() {
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [createForm, setCreateForm] = useState({
    class_id: "",
    subject: "",
    day_of_week: "monday",
    start_time: "08:00",
    end_time: "09:40",
  });
  const [editForm, setEditForm] = useState({
    _id: null,
    subject: "",
    day_of_week: "monday",
    start_time: "",
    end_time: "",
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [sRes, cRes] = await Promise.all([
        api.get("/schedules"),
        api.get("/classes"),
      ]);
      setRows(sRes.data.data || []);
      setClasses(cRes.data.data || []);
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

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.post("/schedules", {
        class_id: Number(createForm.class_id),
        subject: createForm.subject.trim(),
        day_of_week: createForm.day_of_week,
        start_time: createForm.start_time,
        end_time: createForm.end_time,
      });
      setModal(null);
      setCreateForm({
        class_id: "",
        subject: "",
        day_of_week: "monday",
        start_time: "08:00",
        end_time: "09:40",
      });
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir este horário?")) return;
    try {
      await api.delete(`/schedules/${id}`);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  function openEdit(row) {
    setModal("edit");
    setEditForm({
      _id: row.id,
      subject: row.subject ?? "",
      day_of_week: row.day_of_week ?? "monday",
      start_time: sliceTime(row.start_time),
      end_time: sliceTime(row.end_time),
    });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      await api.put(`/schedules/${editForm._id}`, {
        subject: editForm.subject.trim(),
        day_of_week: editForm.day_of_week,
        start_time: editForm.start_time,
        end_time: editForm.end_time,
      });
      setModal(null);
      await load();
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Horários</h1>
          <p className="admin-page-desc">Grade semanal por turma (formato HH:mm).</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setModal("create")}>
          Novo horário
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
                <th>Turma</th>
                <th>Disciplina</th>
                <th>Dia</th>
                <th>Início</th>
                <th>Fim</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.class?.name ?? "—"}</td>
                  <td>{r.subject}</td>
                  <td>{DAYS.find((d) => d.v === r.day_of_week)?.l ?? r.day_of_week}</td>
                  <td>{sliceTime(r.start_time)}</td>
                  <td>{sliceTime(r.end_time)}</td>
                  <td>
                    <div className="admin-actions-inline">
                      <button type="button" className="btn btn--secondary" onClick={() => openEdit(r)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn--secondary" onClick={() => handleDelete(r.id)}>
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
            <h2>Novo horário</h2>
            <form onSubmit={handleCreate}>
              <div className="field">
                <label>Turma</label>
                <select
                  className="input"
                  required
                  value={createForm.class_id}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, class_id: e.target.value }))
                  }
                >
                  <option value="">Selecione…</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Disciplina</label>
                <input
                  className="input"
                  required
                  minLength={2}
                  value={createForm.subject}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, subject: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Dia</label>
                <select
                  className="input"
                  value={createForm.day_of_week}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, day_of_week: e.target.value }))
                  }
                >
                  {DAYS.map((d) => (
                    <option key={d.v} value={d.v}>
                      {d.l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-grid-2">
                <div className="field">
                  <label>Início</label>
                  <input
                    className="input"
                    type="time"
                    required
                    value={createForm.start_time}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, start_time: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Fim</label>
                  <input
                    className="input"
                    type="time"
                    required
                    value={createForm.end_time}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, end_time: e.target.value }))
                    }
                  />
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
            <h2>Editar horário #{editForm._id}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="field">
                <label>Disciplina</label>
                <input
                  className="input"
                  required
                  value={editForm.subject}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, subject: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Dia</label>
                <select
                  className="input"
                  value={editForm.day_of_week}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, day_of_week: e.target.value }))
                  }
                >
                  {DAYS.map((d) => (
                    <option key={d.v} value={d.v}>
                      {d.l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-grid-2">
                <div className="field">
                  <label>Início</label>
                  <input
                    className="input"
                    type="time"
                    required
                    value={editForm.start_time}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, start_time: e.target.value }))
                    }
                  />
                </div>
                <div className="field">
                  <label>Fim</label>
                  <input
                    className="input"
                    type="time"
                    required
                    value={editForm.end_time}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, end_time: e.target.value }))
                    }
                  />
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
