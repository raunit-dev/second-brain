export function Footer() {
    return (
        <footer style={{ padding: '1rem', 
         background: "linear-gradient(135deg, var(--color-purple-500) 0%, var(--color-purple-600) 100%)",
         color: '#fff', textAlign: 'center' }}>
            <h1>Second Brain</h1>
            <p>&copy; {new Date().getFullYear()} Second Brain. All rights reserved.</p>
            <nav>
                <a href="/about" style={{ color: '#61dafb', margin: '0 1rem' }}>About</a>
                <a href="/contact" style={{ color: '#61dafb', margin: '0 1rem' }}>Contact</a>
                <a href="/privacy" style={{ color: '#61dafb', margin: '0 1rem' }}>Privacy Policy</a>
            </nav>
        </footer>
    );
};

export default Footer;