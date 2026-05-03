import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";

export default function AdminEnrollments() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [byClass, setByClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClass, setLoadingClass] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ student_id: "", class_id: "" });

  async function loadRefs() {
    setLoading(true);
    setError(null);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get("/classes"),
        api.get("/students"),
      ]);
      setClasses(cRes.data.data || []);
      setStudents(sRes.data.data || []);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRefs();
  }, []);

  async function loadEnrollmentsForClass(id) {
    if (!id) {
      setByClass([]);
      return;
    }
    setLoadingClass(true);
    try {
      const { data } = await api.get(`/enrollment/class/${id}`);
      setByClass(data.data || []);
    } catch (err) {
      alert(apiErrorMessage(err));
      setByClass([]);
    } finally {
      setLoadingClass(false);
    }
  }

  useEffect(() => {
    if (classId) loadEnrollmentsForClass(classId);
    else setByClass([]);
  }, [classId]);

  async function handleEnroll(e) {
    e.preventDefault();
    try {
      await api.post("/enrollment", {
        student_id: Number(form.student_id),
        class_id: Number(form.class_id),
      });
      setForm({ student_id: "", class_id: "" });
      if (String(form.class_id) === String(classId)) {
        await loadEnrollmentsForClass(classId);
      }
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  async function handleCancelEnrollment(id) {
    if (!window.confirm("Cancelar esta matrícula?")) return;
    try {
      await api.delete(`/enrollment/${id}`);
      if (classId) await loadEnrollmentsForClass(classId);
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  }

  return (
    <>
      <h1 className="admin-page-title">Matrículas</h1>
      <p className="admin-page-desc">Matricular alunos em turmas e consultar por turma.</p>

      {error ? (
        <p className="feedback feedback--error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-card-form">
        <h3>Nova matrícula</h3>
        <form onSubmit={handleEnroll}>
          <div className="admin-grid-2">
            <div className="field">
              <label>Aluno</label>
              <select
                className="input"
                required
                value={form.student_id}
                onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))}
              >
                <option value="">Selecione…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.registration} — {s.user?.name ?? s.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Turma</label>
              <select
                className="input"
                required
                value={form.class_id}
                onChange={(e) => setForm((f) => ({ ...f, class_id: e.target.value }))}
              >
                <option value="">Selecione…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.year}/{c.semester})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn--primary" style={{ width: "auto", marginTop: "0.5rem" }} disabled={loading}>
            Matricular
          </button>
        </form>
      </div>

      <div className="admin-card-form">
        <h3>Alunos por turma</h3>
        <div className="field">
          <label htmlFor="pick-class">Turma</label>
          <select
            id="pick-class"
            className="input"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Selecione uma turma…</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year}/{c.semester})
              </option>
            ))}
          </select>
        </div>

        {loadingClass ? (
          <p className="feedback feedback--info">Carregando matrículas…</p>
        ) : classId && byClass.length === 0 ? (
          <div className="empty-state">Nenhuma matrícula nesta turma.</div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Matrícula #</th>
                  <th>Aluno</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {byClass.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.student?.user?.name ?? "—"}</td>
                    <td>{row.student?.user?.email ?? "—"}</td>
                    <td>{row.status}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleCancelEnrollment(row.id)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
