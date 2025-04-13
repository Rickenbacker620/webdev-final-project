import { BookmarkIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLoaderData } from "react-router";
import { NavBar } from "./NavBar";

function Recipe({ recipe, isLoggedIn }) {
  const navigate = useNavigate();

  const handleRecipeClick = async () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleLike = async () => {
    console.log(`Liked recipe ${recipe.id}`);
  };

  const handleBookmark = async () => {
    console.log(`Bookmarked recipe ${recipe.id}`);
  };

  return (
    <div className="relative z-10 border border-gray-300 rounded-2xl p-8 transform duration-700 hover:border-gray-500">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-40 object-cover rounded cursor-pointer"
        onClick={handleRecipeClick}
      />
      <h3 className="text-xl font-semibold mt-2">{recipe.title}</h3>
      <p className="text-sm text-gray-600">{recipe.description}</p>
      {isLoggedIn && (
        <div className="flex space-x-4 mt-2">
          <button
            type="button"
            className="btn btn-ghost btn-circle text-red-600"
            onClick={() => handleLike()}
          >
            <HeartIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-circle text-green-600"
            onClick={() => handleBookmark()}
          >
            <BookmarkIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search"
      className="input input-bordered w-28 md:w-auto"
    />
  );
}

function AvatarDropdown() {
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
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a>Logout</a>
        </li>
      </ul>
    </div>
  );
}

function Home() {
  const recipes = useLoaderData(); // Fetch data from the loader
  const isLoggedIn = true; // Replace with real auth state

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <Recipe key={recipe.id} recipe={recipe} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </section>
  );
}

export default Home;
