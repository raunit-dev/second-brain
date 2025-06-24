import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Second Brain" }: HeaderProps) {
  const navigate = useNavigate();

  function signin() {
    navigate("/signin");
  }

  function signup() {
    navigate("/signup");
  }

  return (
    <div
      style={{
        padding: "1rem 2rem",
        background: "linear-gradient(135deg, var(--color-purple-500) 0%, var(--color-purple-600) 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.5px" }}>
        {title}
      </h1>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Button
          onClick={signin}
          loading={false}
          variant="primary"
          text="Sign In"
          fullWidth={false}
        />
        <Button
          onClick={signup}
          loading={false}
          variant="secondary"
          text="Sign Up"
          fullWidth={false}
        />
      </div>
    </div>
  );
}

export default Header;
