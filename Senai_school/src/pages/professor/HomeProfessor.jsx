import { useAuth } from "../../context/AuthContext";

export default function HomeProfessor() {
  const { user } = useAuth();

  return (
    <main className="student-main">
      <div className="student-inner">
        <h1 className="student-title">Olá, {user?.name?.split?.(" ")?.[0] || user?.name}</h1>
        <p className="student-subtitle">Você está no painel do professor.</p>
      </div>
    </main>
  );
}
