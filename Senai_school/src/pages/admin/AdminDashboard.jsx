import { Link } from "react-router-dom";

const CARDS = [
  { to: "/admin/users", title: "Usuários", hint: "Listar e excluir contas" },
  { to: "/admin/students", title: "Alunos", hint: "Perfis e vínculo com usuário" },
  { to: "/admin/classes", title: "Turmas", hint: "CRUD e professor responsável" },
  { to: "/admin/enrollments", title: "Matrículas", hint: "Matricular e por turma" },
  { to: "/admin/scores", title: "Notas", hint: "Todas as avaliações" },
  { to: "/admin/schedules", title: "Horários", hint: "Grade por turma" },
];

export default function AdminDashboard() {
  return (
    <>
      <h1 className="admin-page-title">Painel</h1>
      <p className="admin-page-desc">Escolha um módulo para gerenciar o sistema.</p>
      <div className="card-grid card-grid--2">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="nav-card"
            style={{ textDecoration: "none" }}
          >
            <span className="nav-card__label">{c.title}</span>
            <span className="nav-card__hint">{c.hint}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
