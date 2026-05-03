import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";

export default function GradesProfessor() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [gradeForm, setGradeForm] = useState({ id: null, assessment: "", value: "" });
  const [studentScores, setStudentScores] = useState([]);
  
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const classId = query.get("classId");

  const isDark = theme === "dark";

  const themeStyles = {
    backgroundColor: isDark ? "#0f172a" : "#f5f5f5",
    color: isDark ? "#f8fafc" : "#111827",
    minHeight: "100vh",
    padding: "40px",
    transition: "all 0.3s ease",
    marginTop: "50px"
  };

  async function fetchEnrollments() {
    if (!classId) return;
    try {
      const response = await api.get(`/enrollment/class/${classId}`);
      setEnrollments(response.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar matriculados:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEnrollments();
  }, [classId]);

  async function fetchStudentScores(enrollmentId) {
    try {
      const response = await api.get(`/scores/enrollment/${enrollmentId}`);
      setStudentScores(response.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar notas do aluno:", err);
    }
  }

  useEffect(() => {
    if (selectedEnrollment) {
      fetchStudentScores(selectedEnrollment.id);
      setGradeForm({ id: null, assessment: "", value: "" });
    }
  }, [selectedEnrollment]);

  async function handleSubmitGrade(e) {
    e.preventDefault();
    if (!selectedEnrollment) return;

    try {
      if (gradeForm.id) {
        await api.put(`/scores/${gradeForm.id}`, {
          assessment: gradeForm.assessment,
          value: parseFloat(gradeForm.value)
        });
        alert("Nota atualizada!");
      } else {
        await api.post("/scores", {
          enrollment_id: selectedEnrollment.id,
          assessment: gradeForm.assessment,
          value: parseFloat(gradeForm.value)
        });
        alert("Nota lançada!");
      }
      setGradeForm({ id: null, assessment: "", value: "" });
      fetchStudentScores(selectedEnrollment.id);
    } catch (err) {
      console.error("Erro ao salvar nota:", err);
      alert("Erro ao salvar nota.");
    }
  }

  async function handleDeleteGrade(id) {
    if (!window.confirm("Excluir esta nota?")) return;
    try {
      await api.delete(`/scores/${id}`);
      fetchStudentScores(selectedEnrollment.id);
    } catch (err) {
      console.error("Erro ao excluir nota:", err);
    }
  }

  function handleEditGrade(score) {
    setGradeForm({ id: score.id, assessment: score.assessment, value: score.value });
  }

  return (
    <div style={themeStyles}>
      <h2 style={{ marginBottom: "30px" }}>Gerenciar Notas da Turma</h2>

      {!classId ? (
        <p>Por favor, selecione uma turma na página de Turmas.</p>
      ) : loading ? (
        <p>Carregando alunos...</p>
      ) : (
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <h3>Lista de Alunos</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
              {enrollments.map((enr) => (
                <div 
                  key={enr.id} 
                  onClick={() => setSelectedEnrollment(enr)}
                  style={{
                    padding: "15px",
                    background: selectedEnrollment?.id === enr.id ? (isDark ? "#334155" : "#e5e7eb") : (isDark ? "#1e293b" : "#fff"),
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
                    transition: "all 0.2s"
                  }}
                >
                  <strong>{enr.student?.name}</strong>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8 }}>RA: {enr.student?.registration}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "2 1 400px" }}>
            {selectedEnrollment ? (
              <>
                <h3>Notas de {selectedEnrollment.student?.name}</h3>
                
                <form onSubmit={handleSubmitGrade} style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: isDark ? "#1e293b" : "#fff",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`
                }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Avaliação:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: P1"
                      value={gradeForm.assessment}
                      onChange={(e) => setGradeForm({...gradeForm, assessment: e.target.value})}
                      required
                      style={{ padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                  </div>
                  <div style={{ width: "100px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Nota:</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="10"
                      value={gradeForm.value}
                      onChange={(e) => setGradeForm({...gradeForm, value: e.target.value})}
                      required
                      style={{ padding: "10px", width: "100%", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                  </div>
                  <button type="submit" style={{
                    padding: "10px 20px",
                    backgroundColor: "#1a1a2e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}>
                    {gradeForm.id ? "Atualizar" : "Lançar"}
                  </button>
                  {gradeForm.id && (
                    <button 
                      type="button" 
                      onClick={() => setGradeForm({ id: null, assessment: "", value: "" })}
                      style={{ padding: "10px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                    >
                      Cancelar
                    </button>
                  )}
                </form>

                <div style={{ marginTop: "30px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: `2px solid ${isDark ? "#334155" : "#e5e7eb"}` }}>
                        <th style={{ padding: "10px" }}>Avaliação</th>
                        <th style={{ padding: "10px" }}>Nota</th>
                        <th style={{ padding: "10px" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentScores.map((score) => (
                        <tr key={score.id} style={{ borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}` }}>
                          <td style={{ padding: "10px" }}>{score.assessment}</td>
                          <td style={{ padding: "10px" }}>{score.value}</td>
                          <td style={{ padding: "10px" }}>
                            <button 
                              onClick={() => handleEditGrade(score)}
                              style={{ marginRight: "10px", background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }}
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteGrade(score.id)}
                              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                      {studentScores.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ padding: "20px", textAlign: "center", opacity: 0.6 }}>Nenhuma nota lançada para este aluno.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ 
                height: "200px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                marginTop: "20px",
                opacity: 0.6
              }}>
                Selecione um aluno na lista ao lado para gerenciar notas.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
