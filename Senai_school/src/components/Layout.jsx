import Header from "./Header";

export default function Layout({ children, showHeader = true }) {
  return (
    <div>
      {showHeader ? <Header /> : null}
      <main>{children}</main>
    </div>
  );
}