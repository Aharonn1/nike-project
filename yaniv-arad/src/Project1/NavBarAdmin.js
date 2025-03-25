import { Link } from "react-router-dom";

export const NavBarAdmin = () => {
  return (
    <nav>
      <div className="nav-links">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/categoryshoes">Categories</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/shoes">Products</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/users">Customers</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/graphs">Graphs</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </nav>
  );
};
