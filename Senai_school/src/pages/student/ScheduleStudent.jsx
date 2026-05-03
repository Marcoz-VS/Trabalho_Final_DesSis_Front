import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DAYS = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
};

function formatTime(time) {
  return time?.slice(0, 5) ?? "";
}

export default function ScheduleStudent() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      setError(null);
      try {
        const studentId =
          typeof user.student === "object" ? user.student?.id : user.student;
        if (!studentId) {
          setSchedules([]);
          return;
        }
        const scheduleRes = await api.get(`/schedules/student/${studentId}`);
        setSchedules(scheduleRes.data.data || []);
      } catch {
        setError("Não foi possível carregar os horários.");
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.student) {
      fetchSchedules();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Horários</h1>
        <p className="student-subtitle">Disciplinas e horários das suas turmas.</p>

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

        {!loading && !error && schedules.length === 0 ? (
          <div className="empty-state">Nenhum horário encontrado.</div>
        ) : null}

        {!loading &&
          schedules.map((s) => (
            <article key={s.id} className="list-card">
              <h3>{s.subject}</h3>
              <p className="meta">
                {s.class?.name}
                {s.class?.year != null
                  ? ` · ${s.class.year}/${s.class.semester ?? "—"}`
                  : ""}
              </p>
              <p className="meta">
                <strong>{DAYS[s.day_of_week] || s.day_of_week}</strong>
                {" · "}
                {formatTime(s.start_time)} – {formatTime(s.end_time)}
              </p>
            </article>
          ))}
      </div>
    </main>
  );
}
