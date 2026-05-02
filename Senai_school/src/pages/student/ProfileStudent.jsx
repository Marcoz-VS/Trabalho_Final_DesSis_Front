import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from '../../components/EditProfileModal';

export default function ProfileStudent() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const studentId =
          typeof user.student === "object"
            ? user.student?.id
            : user.student;

        if (!studentId) return;

        const res = await api.get(`/students/${studentId}`);
        console.log(res)
        setStudent(res.data.data);

      } catch (err) {
        console.error(err);
      }
    }

    if (user?.student) {
      fetchStudent();
    }
  }, [user]);

  return (
    <div>
      <h2>Meu Perfil</h2>

      {!student ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: 20 }}>
          
          <img
            src={student.avatar_url || "https://via.placeholder.com/100"}
            alt="avatar"
            width={100}
          />

          <p>
            <strong>Matrícula:</strong>{" "}
            {student.registration || "Adicione sua matrícula"}
          </p>

          <p>
            <strong>Telefone:</strong>{" "}
            {student.phone || "Adicione um telefone"}
          </p>

          <p>
            <strong>Data de nascimento:</strong>{" "}
            {student.birth_date || "Adicione sua data"}
          </p>

          <button onClick={() => setOpenModal(true)}>
            Editar perfil
          </button>
        </div>
      )}

      {openModal && (
        <EditProfileModal
          student={student}
          onClose={() => setOpenModal(false)}
          onSave={setStudent}
        />
      )}
    </div>
  );
}