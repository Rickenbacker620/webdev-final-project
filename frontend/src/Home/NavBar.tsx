import { Link, useNavigate } from "react-router";
import { PlusIcon } from "@heroicons/react/24/outline";
import useAuth from "../hooks/useAuth";

function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search"
      className="input input-bordered w-24 md:w-auto"
    />
  );
}

function AvatarDropdown() {

  const {logout} = useAuth()


  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://avatar.iran.liara.run/public/boy"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to="/profile"> Profile </Link>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a onClick={logout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}

function NavBar() {
  const navigate = useNavigate();

  const {user} = useAuth()

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">What to Eat</Link>
      </div>
      <div className="flex gap-2">
        {!user ? (
          <div className="space-x-4">
            <Link to="/login">
              <button className="btn btn-primary">Log in</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-secondary">Sign Up</button>
            </Link>
          </div>
        ) : (
          <>
            <SearchBar />
            <AvatarDropdown />
            <button
              className="btn btn-primary flex items-center space-x-1"
              onClick={() => navigate("/recipe/new")}
            >
              <PlusIcon className="w-6 h-6 inline" strokeWidth="2" />
              <span>Post Recipe</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export { NavBar, SearchBar, AvatarDropdown };
