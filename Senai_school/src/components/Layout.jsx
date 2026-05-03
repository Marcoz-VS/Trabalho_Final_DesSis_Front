import Header from "./Header";
import HeaderTeacher from "./professor/HeaderTeacher";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children, showHeader = true }) {
  const { user } = useAuth();

  function renderHeader() {
    if (!showHeader) return null;

    if (user?.role === "professor") {
      return <HeaderTeacher />;
    }

    return <Header />;
  }

  return (
    <div>
      {renderHeader()}
      <main>{children}</main>
    </div>
  );
}