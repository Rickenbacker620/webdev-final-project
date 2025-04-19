import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "../components/Recipe";

function RecipeSearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  console.log(query);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  if (error) {
    return <div className="alert alert-error">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.meals?.map((recipe) => (
          <Recipe key={recipe.idMeal} recipe={recipe} isLoggedIn={true} />
        ))}
      </div>
    </div>
  );
}

export default RecipeSearchResult;
