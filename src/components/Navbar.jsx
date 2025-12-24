import { NavLink } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <div className="nav-main">
      <nav className="navbar">
        <NavLink to="/" className="nav-logo">
          🔥<span>Firebase with React</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/db">Database</NavLink>
          <NavLink to="/login">Sign In</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
