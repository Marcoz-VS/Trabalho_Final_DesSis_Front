import { useEffect, useState } from "react";
import api from "../../services/api";
import { apiErrorMessage } from "../../utils/apiErrorMessage";

export default function ProfessorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/enrollment/me");
      setStudents(data.data || []);
    } catch (err) {
      setError(apiErrorMessage(err));
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-page-title">Meus Alunos</h1>
          <p className="admin-page-desc">
            Estudantes das turmas que você leciona.
          </p>
        </div>
      </div>

      {error ? (
        <p className="feedback feedback--error">{error}</p>
      ) : null}

      {loading ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Matrícula</th>
                <th>Turma</th>
              </tr>
            </thead>
            <tbody>
              {students.map((en) => {
                const student = en.student;
                const user = student?.user;

                return (
                  <tr key={en.id}>
                    <td>
                      <img
                        src={student?.avatar_url || "/default-avatar.png"}
                        alt="avatar"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{user?.name ?? "—"}</td>
                    <td>{user?.email ?? "—"}</td>
                    <td>{student?.registration ?? "—"}</td>
                    <td>{en.class?.name ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}