import { useQueries, useQuery } from "@tanstack/react-query";
import { $api } from "../api/client";
import { Recipe } from "../components/Recipe";

function Profile() {
  const { data } = $api.useQuery("get", "/api/v1/auth/users/me");

  const { data: likedRecipesIds } = $api.useQuery(
    "get",
    "/api/v1/recipes/liked-recipes",
  );

  const likedRecipes = useQueries({
    queries:
      likedRecipesIds?.map((id) => ({
        queryKey: ["recipe_detail", { id: Number.parseInt(id) }],
        queryFn: async () => {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        },
      })) || [],
  });

  return (
    <div className="w-auto h-full my-auto mx-2 bg-base-100 rounded-xl">
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="profile_tabs"
          className="tab"
          aria-label="Liked Recipes"
          defaultChecked
        />
        <div className="tab-content p-10">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedRecipes.map((recipe, index) => {
              if (recipe.isLoading) {
                return <div key={index}>Loading...</div>;
              }
              if (recipe.isError) {
                return <div key={index}>Error loading recipe</div>;
              }
              const meal = recipe.data?.meals[0];
              return (
                <Recipe
                  key={meal.idMeal}
                  recipe={meal}
                  isLoggedIn={!!data}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
