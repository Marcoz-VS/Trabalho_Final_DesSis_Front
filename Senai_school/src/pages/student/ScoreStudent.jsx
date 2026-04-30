import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ScoreStudent() {
  const [scores, setScores] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchScores() {
      try {
        const studentRes = await api.get(`/student/${user?.id}`)
        const student = studentRes

        const enrollmentRes = await api.get(`/enrollment/student/${student?.id}`);
        const enrollment = enrollmentRes.data;

        // 2. usa o enrollment_id
        const { data } = await api.get(`/scores/enrollment/${enrollment.id}`);

        setScores(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (user) {
      fetchScores();
    }
  }, [user]);

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