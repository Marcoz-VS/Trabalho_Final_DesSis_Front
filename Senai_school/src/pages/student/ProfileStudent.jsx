import { useEffect, useState, useContext} from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from '../../components/EditProfileModal';
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfileStudent() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { theme } = useContext(ThemeContext);

    
const isDark = theme === "dark";

const themeStyles = {
  backgroundColor: isDark ? "#0f172a" : "#f5f5f5",
  color: isDark ? "#f8fafc" : "#111827",
  minHeight: "100vh",
  padding: "40px",
  transition: "all 0.3s ease",
  marginTop: "50px"
};

 const buttonStyle = {
    marginLeft: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: isDark ? "#334155" : "#e5e7eb",
    color: isDark ? "#f8fafc" : "#111827"
  };

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
    <div style={themeStyles}>
      <h2>Meu Perfil</h2>

      {!student ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: '8px', marginTop: '40px' }}>
          
          <img
            src={student.avatar_url}
            alt="avatar"
            width={100}
          />

          <p style={{fontSize: '20px'}}>
            <strong>Matrícula:</strong>{" "}
            {student.registration}
          </p>

          <p style={{fontSize: '20px'}}>
            <strong>Telefone:</strong>{" "}
            {student.phone || "Adicione um telefone"}
          </p>

          <p style={{fontSize: '20px'}}>
            <strong>Data de nascimento:</strong>{" "}
            {student.birth_date || "Adicione sua data"}
          </p>

          <button  style={buttonStyle} onClick={() => setOpenModal(true)}>
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