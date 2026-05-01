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
      const enrollments = enrollmentRes.data;

      const enrollmentId = enrollments[0]?.id;

      if (!enrollmentId) return;

      const { data } = await api.get(`/scores/enrollment/${enrollmentId}`);

      setScores(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (user?.student) {
    fetchScores();
  }
}, [user])

  return (
    <div>
      <h2>Minhas Notas</h2>

      {scores.map((score) => (
        <div key={score.id}>
          {score.value}
        </div>
      ))}
    </div>
  );
}