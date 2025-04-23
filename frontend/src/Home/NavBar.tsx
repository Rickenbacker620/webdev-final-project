import {
  MagnifyingGlassCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      console.log("Searching for:", query);
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <label className="input">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input type="search" required placeholder="Search" value={query} onKeyDown={handleKeyDown} 
      onChange={(e) => setQuery(e.target.value)}
      />
    </label>
  );
}

function AvatarDropdown() {
  const { logout, user } = useAuth();


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
        {
          user?.role === "admin" && (
            <li>
              <Link to="/user-management">
              User Management
              </Link>
            </li>
          )
        }
        <li>
          <Link to={`/profile/${user?.id}`}> Profile </Link>
        </li>
        <li>
          <Link to={`/settings`} > Settings </Link>
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

  const { user } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          What to Eat
        </Link>
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
          <div className="flex items-center gap-2">
            <SearchBar />
            <AvatarDropdown />
            <div>{user.username}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export { NavBar, SearchBar, AvatarDropdown };
