import { useQueries, useQuery } from "@tanstack/react-query";
import { $api, fetchClient } from "../api/client";
import { Recipe } from "../components/Recipe";
import { useState } from "react";

function useRecipesUnderList(recipeListId: number| undefined) {
  return useQuery({
    queryKey: ["recipe_list", { id: recipeListId }],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${recipeListId}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!recipeListId,
  });
}


function Profile() {
  const { data } = $api.useQuery("get", "/api/v1/auth/users/me");

  const { data: likedRecipesIds } = $api.useQuery(
    "get",
    "/api/v1/recipes/liked-recipes",
  );

  const { data: recipeLists } = $api.useQuery(
    "get",
    "/api/v1/recipes/recipe-lists",
  );

  const [currentSelectedList, setCurrentSelectedList] = useState<number | undefined>(undefined);

  const { data: recipesUnderList } = useQuery({
    queryKey: ["recipe_list", { id: currentSelectedList }],
    queryFn: async () => {
      const recipe_ids = await fetchClient.GET("/api/v1/recipes/recipe-lists/{recipe_list_id}", {
        params: {
          path: {
            recipe_list_id: currentSelectedList,
          }
        }
      })

      console.log(recipe_ids.data)

      const recipeDetails = await Promise.all(
        recipe_ids.data.map(async ({recipe_id}) => {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe_id}`,
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
      )

      return recipeDetails
    },
    enabled: !!currentSelectedList,
    initialData: () => {
      return []
    }
  }
  )



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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

        {recipeLists?.map((list, listIndex) => (
          <>
            <input
              type="radio"
              name="profile_tabs"
              className="tab"
              aria-label={list.name}
              onClick={() => {
                setCurrentSelectedList(list.id);
              }}
            />
            <div className="tab-content p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipesUnderList?.map((recipe, index) => (
                  <Recipe
                    key={index}
                    recipe={recipe.meals[0]}
                    isLoggedIn={!!data}
                  />
                ))}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Profile;
