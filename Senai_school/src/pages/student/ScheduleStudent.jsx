import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function ScheduleStudent() {
  const [ schedules, setSchedules] = useState([]);
  const { user } = useAuth();
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

  useEffect(() => {
    async function fetchSchedules() {
      try {
         
const studentId =
  typeof user.student === "object"
    ? user.student?.id
    : user.student;

        const scheduleRes = await api.get(`/schedules/student/${studentId}`);
        const schedules = scheduleRes.data.data;

        console.log(schedules);

        setSchedules(schedules);



      } catch (err) {
        console.error(err);
      }
    }

    fetchSchedules();

  }, []);

  function translateDay(day) {
  const days = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
  };

  return days[day] || day;
}

function formatTime(time) {
  return time?.slice(0, 5); 
}

return (
  <div style={themeStyles}>
    <h2 style={{ marginBottom: "50px" }}>Meus Horários</h2>

    {schedules.map((schedule) => (
      <div key={schedule.id}  style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}>
        
        <h2>Matéria: {schedule.subject}</h2>

        <h3>Turma: {schedule.class?.name}</h3>
        <h3>Ano: {schedule.class?.year}</h3>
        <h3>Semestre: {schedule.class?.semester}</h3>

        <h4>Dia: {translateDay(schedule.day_of_week)}</h4>
        <h4>
          Horário: {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
        </h4>

      </div>
    ))}
  </div>
);
}