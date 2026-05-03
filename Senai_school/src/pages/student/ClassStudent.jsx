import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ClassStudent() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchClass() {
      setLoading(true);
      setError(null);
      try {
        const studentId =
          typeof user.student === "object" ? user.student?.id : user.student;
        if (!studentId) {
          setClasses([]);
          return;
        }
        const classRes = await api.get(`/enrollment/student/${studentId}`);
        setClasses(classRes.data.data || []);
      } catch {
        setError("Não foi possível carregar as turmas.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.student) {
      fetchClass();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Turmas</h1>
        <p className="student-subtitle">Turmas em que você está matriculado.</p>

        {error ? (
          <p className="feedback feedback--error" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="empty-state" role="status">
            Carregando…
          </div>
        ) : null}

        {!loading && !error && classes.length === 0 ? (
          <div className="empty-state">Nenhuma turma encontrada.</div>
        ) : null}

        {!loading &&
          classes.map((row) => (
            <article key={row.id} className="list-card">
              <h3>{row.class?.name ?? "Turma"}</h3>
              <p className="meta">
                Ano {row.class?.year ?? "—"} · Semestre {row.class?.semester ?? "—"}
              </p>
              {row.status ? (
                <p className="meta">
                  <strong>Matrícula</strong> {row.status}
                </p>
              ) : null}
            </article>
          ))}
      </div>
    </main>
  );
}
