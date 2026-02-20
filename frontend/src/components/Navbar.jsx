import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/decode">Decode</Link>
        <Link to="/community">Community</Link>
        <Link to="/history">History</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}
