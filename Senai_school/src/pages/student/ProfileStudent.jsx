import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "../../components/EditProfileModal";

export default function ProfileStudent() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      setLoading(true);
      setError(null);
      try {
        const studentId =
          typeof user.student === "object" ? user.student?.id : user.student;
        if (!studentId) {
          setStudent(null);
          return;
        }
        const res = await api.get(`/students/${studentId}`);
        setStudent(res.data.data);
      } catch {
        setError("Não foi possível carregar o perfil.");
        setStudent(null);
      } finally {
        setLoading(false);
      }
    }

    if (user?.student) {
      fetchStudent();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Perfil</h1>
        <p className="student-subtitle">Seus dados e matrícula acadêmica.</p>

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

        {!loading && student ? (
          <div className="list-card" style={{ maxWidth: "32rem" }}>
            <div className="avatar-wrap">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt="" />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "2rem",
                  }}
                  aria-hidden
                >
                  ·
                </div>
              )}
            </div>

            <p className="meta">
              <strong>Matrícula</strong>
              <br />
              {student.registration}
            </p>
            <p className="meta">
              <strong>Telefone</strong>
              <br />
              {student.phone || "—"}
            </p>
            <p className="meta">
              <strong>Nascimento</strong>
              <br />
              {student.birth_date || "—"}
            </p>

            <button
              type="button"
              className="btn btn--secondary"
              style={{ marginTop: "1.25rem", width: "auto" }}
              onClick={() => setOpenModal(true)}
            >
              Editar perfil
            </button>
          </div>
        ) : null}

        {openModal && student ? (
          <EditProfileModal
            student={student}
            onClose={() => setOpenModal(false)}
            onSave={setStudent}
          />
        ) : null}
      </div>
    </main>
  );
}
