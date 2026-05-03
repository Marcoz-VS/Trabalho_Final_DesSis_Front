import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";
import StudentModal from "../../components/StudentModal";

export default function StudentsProfessor() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
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

  async function fetchStudents() {
    setLoading(true);
    try {
      const response = await api.get("/students");
      setStudents(response.data.data || response.data);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;
    try {
      await api.delete(`/students/${id}`);
      alert("Aluno excluído com sucesso!");
      fetchStudents();
    } catch (err) {
      console.error("Erro ao excluir aluno:", err);
      alert("Erro ao excluir aluno.");
    }
  }

  function handleOpenModal(student = null) {
    setSelectedStudent(student);
    setIsModalOpen(true);
  }

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={themeStyles}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Gerenciar Alunos</h2>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            padding: "12px 20px",
            backgroundColor: "#1a1a2e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          + Novo Aluno
        </button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <input 
          type="text" 
          placeholder="Buscar por nome ou matrícula..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "6px",
            border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
            background: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#f8fafc" : "#111827"
          }}
        />
      </div>

      {loading ? (
        <p>Carregando alunos...</p>
      ) : filteredStudents.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {filteredStudents.map((student) => (
            <div key={student.id} style={{
              background: isDark ? "#1e293b" : "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <img 
                    src={student.avatar_url || "https://via.placeholder.com/50"} 
                    alt={student.name} 
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ margin: 0 }}>{student.name}</h4>
                    <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>{student.registration}</p>
                  </div>
                </div>
                <p><strong>Email:</strong> {student.user?.email || "N/A"}</p>
                <p><strong>Telefone:</strong> {student.phone || "N/A"}</p>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button 
                  onClick={() => handleOpenModal(student)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#3b82f6",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(student.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => fetchStudents()} 
        />
      )}
    </div>
  );
}
