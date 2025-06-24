import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

export function Landing() {
    const navigate = useNavigate();

    async function landing() {
        navigate("/signin");
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(135deg, #a78bfa,rgb(19, 91, 133))",

            }}
        >
            <Header />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "2rem 2.5rem",
                        borderRadius: "16px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        maxWidth: "400px",
                        width: "100%",
                    }}
                >
                    <h1 style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
                        Welcome to Second Brain
                    </h1>
                    <p style={{ marginBottom: "2rem", color: "#555" }}>
                        Organize your thoughts, notes, and ideas in one place.
                    </p>
                    <Button
                        onClick={landing}
                        loading={false}
                        variant="primary"
                        text="Continue"
                        fullWidth={true}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}