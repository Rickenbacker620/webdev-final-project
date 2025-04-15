import { useState } from "react";
import { $api } from "../api/client";
import {Recipe} from "../components/Recipe";


function Home() {
  const { data: recipes } = $api.useQuery("get", "/api/v1/recipes")

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <section className="mx-10 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes?.map((recipe) => (
          <Recipe key={recipe.id} recipe={recipe} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </section>
  );
}

export default Home;
