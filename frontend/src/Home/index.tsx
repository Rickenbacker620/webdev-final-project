import { Button } from "@headlessui/react";
import { BookmarkIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";

const mockData = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  title: `Recipe ${i + 1}`,
  description: `Description for Recipe ${i + 1}`,
  image: `https://placehold.co/600x400/00${i}00${i}/FFFFFF`,
}));

function handleLike(recipeId: number) {
  console.log(`Liked recipe ${recipeId}`);
}

function handleBookmark(recipeId: number) {
  console.log(`Bookmarked recipe ${recipeId}`);
}

function Recipe({ recipe, isLoggedIn }) {
  const navigate = useNavigate();

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="relative z-10 backdrop-blur-md bg-gray-400/30 border border-white/20 rounded-2xl p-8 shadow-lg transform duration-700 hover:shadow-2xl">
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
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => handleLike(recipe.id)}
          >
            <HeartIcon className="size-5 text-red-500" />
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => handleBookmark(recipe.id)}
          >
            <BookmarkIcon className="size-5 text-green-500" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Home() {
  // Replace with real auth state
  const isLoggedIn = true;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Home</h1>
        {!isLoggedIn ? (
          <div className="space-x-4">
            <Link to="/login">
              <Button className="btn btn-orange">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="btn btn-green">Sign Up</Button>
            </Link>
          </div>
        ) : (
          <Button className="btn btn-green-light">
            <PlusIcon className="size-5 text-white inline" />
            Post Recipe
          </Button>
        )}
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
