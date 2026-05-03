import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function formatDateOnly(value) {
  if (!value) return "—";
  const s = String(value);
  const [y, m, d] = s.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return s;
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
}

export default function EnrollmentStudent() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchEnrollments() {
      setLoading(true);
      setError(null);
      try {
        const studentId =
          typeof user.student === "object" ? user.student?.id : user.student;
        if (!studentId) {
          setEnrollments([]);
          return;
        }
        const enrollmentRes = await api.get(`/enrollment/student/${studentId}`);
        setEnrollments(enrollmentRes.data.data || []);
      } catch {
        setError("Não foi possível carregar as matrículas.");
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.student) {
      fetchEnrollments();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Matrículas</h1>
        <p className="student-subtitle">Turmas e situação da matrícula.</p>

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

        {!loading && !error && enrollments.length === 0 ? (
          <div className="empty-state">Nenhuma matrícula encontrada.</div>
        ) : null}

        {!loading &&
          enrollments.map((enrollment) => (
            <article key={enrollment.id} className="list-card">
              <h3>{enrollment.class?.name ?? "Turma"}</h3>
              <p className="meta">
                Ano {enrollment.class?.year ?? "—"} · Semestre{" "}
                {enrollment.class?.semester ?? "—"}
              </p>
              <p className="meta">
                <strong>Status</strong> {enrollment.status ?? "—"}
              </p>
              <p className="meta">
                <strong>Data</strong> {formatDateOnly(enrollment.enrolled_at)}
              </p>
            </article>
          ))}
      </div>
    </main>
  );
}
