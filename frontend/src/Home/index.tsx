import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { $api } from "../api/client";
import { Recipe } from "../components/Recipe";
import useAuth from "../hooks/useAuth";

function Home() {
  const { data: recipes } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?f=a",
      );
      return response.json();
    },
    staleTime: 1000 * 60 * 60,
  });

  const { user } = useAuth();

  return (
    <section className="mx-10 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes?.meals?.map((recipe) => (
          <Recipe key={recipe.idMeal} recipe={recipe} isLoggedIn={!!user} />
        ))}
      </div>
    </section>
  );
}

export default Home;
