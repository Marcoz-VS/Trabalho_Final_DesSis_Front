import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ScoreStudent() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      setError(null);
      try {
        const studentId =
          typeof user.student === "object" ? user.student?.id : user.student;
        if (!studentId) {
          setRows([]);
          return;
        }

        const enrollmentRes = await api.get(`/enrollment/student/${studentId}`);
        const enrollments = enrollmentRes.data.data || [];
        if (enrollments.length === 0) {
          setRows([]);
          return;
        }

        const results = await Promise.all(
          enrollments.map(async (en) => {
            try {
              const { data } = await api.get(`/scores/enrollment/${en.id}`);
              const scores = data.data || [];
              return scores.map((s) => ({
                ...s,
                className: en.class?.name,
                classYear: en.class?.year,
                classSemester: en.class?.semester,
              }));
            } catch {
              return [];
            }
          }),
        );

        setRows(results.flat());
      } catch {
        setError("Não foi possível carregar as notas.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.student) {
      fetchScores();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Notas</h1>
        <p className="student-subtitle">Avaliações por turma.</p>

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

        {!loading && !error && rows.length === 0 ? (
          <div className="empty-state">Nenhuma nota registrada ainda.</div>
        ) : null}

        {!loading &&
          rows.map((score) => (
            <article key={score.id} className="list-card">
              <h3>{score.assessment}</h3>
              <p className="meta">
                <strong>Nota</strong> {score.value}
              </p>
              {(score.className || score.classYear) && (
                <p className="meta">
                  {score.className}
                  {score.classYear != null
                    ? ` · ${score.classYear}/${score.classSemester ?? "—"}`
                    : ""}
                </p>
              )}
            </article>
          ))}
      </div>
    </main>
  );
}
