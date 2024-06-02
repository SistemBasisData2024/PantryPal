import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="p-7 w-full flex">
      <h3 className="font-bold ml-20 text-xl">PantryPal</h3>
      <div>
        <ul className="position absolute top-7 right-10">
          {!user ? (
            <div className="flex">
              <Link to="/login">
                <li className="mx-16">Login</li>
              </Link>
              <Link to="/register">
                <li className="mx-16">Register</li>
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </ul>
      </div>
    </div>
  );
}
