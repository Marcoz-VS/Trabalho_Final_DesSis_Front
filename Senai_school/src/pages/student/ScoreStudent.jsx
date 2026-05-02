import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ScoreStudent() {
  const [scores, setScores] = useState([]);
  const { user } = useAuth();

useEffect(() => {
  async function fetchScores() {
    try {
      const studentId =
        typeof user.student === "object"
          ? user.student?.id
          : user.student;

      if (!studentId) return;

      const enrollmentRes = await api.get(`/enrollment/student/${studentId}`);
      const enrollments = enrollmentRes.data.data;

      const enrollmentId = enrollments[0]?.id;

      console.log(enrollmentId)

      if (!enrollmentId) return;

      const data = await api.get(`/scores/enrollment/${enrollmentId}`);

      console.log(data)
      setScores(data.data.data);



    } catch (err) {
      console.error(err);
    }
  }

  if (user?.student) {
    fetchScores();
  }
}, [user])

  return (
    <div style={{padding: '30px'}}>
      <h2 style={{marginBottom: '50px'}}>Minhas Notas</h2>
  {scores.map((score) => (
<div key={score.id}>
  <h2>Prova: {score.assessment}</h2>
  <h3>Nota: {score.value}</h3>
</div>
      ))}
    </div>
  );
}