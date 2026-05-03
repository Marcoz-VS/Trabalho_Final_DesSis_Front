import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { label: "Turmas", hint: "Disciplinas matriculadas", path: "/student/class" },
  { label: "Horários", hint: "Grade semanal", path: "/student/schedule" },
  { label: "Notas", hint: "Avaliações e médias", path: "/student/scores" },
  { label: "Matrículas", hint: "Status e datas", path: "/student/enrollment" },
];

export default function HomeStudent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Olá, {user?.name?.split?.(" ")?.[0] || user?.name}</h1>
        <p className="student-subtitle">Escolha uma área para continuar.</p>

        <div className="card-grid card-grid--2">
          {NAV.map((item) => (
            <button
              key={item.path}
              type="button"
              className="nav-card"
              onClick={() => navigate(item.path)}
            >
              <span className="nav-card__label">{item.label}</span>
              <span className="nav-card__hint">{item.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
