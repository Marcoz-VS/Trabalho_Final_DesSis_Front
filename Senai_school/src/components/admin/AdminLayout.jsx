import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin", end: true, label: "Início" },
  { to: "/admin/users", label: "Usuários" },
  { to: "/admin/students", label: "Alunos" },
  { to: "/admin/classes", label: "Turmas" },
  { to: "/admin/enrollments", label: "Matrículas" },
  { to: "/admin/scores", label: "Notas" },
  { to: "/admin/schedules", label: "Horários" },
];

export default function AdminLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <p className="admin-brand">Administração</p>
        <nav className="admin-nav" aria-label="Menu administrativo">
          {LINKS.map(({ to, end, label }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={toggleTheme}
            aria-label={isDark ? "Tema claro" : "Tema escuro"}
          >
            {isDark ? "Claro" : "Escuro"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
