import { BookmarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { $api } from "../api/client";
import { useLikeMutation } from "../hooks/useLikeMutation";

// Updated interface to match TheMealDB schema
interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strMealAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  // Ingredients and measures (1-20)
  strIngredient1?: string | null;
  strIngredient2?: string | null;
  strIngredient3?: string | null;
  // ... other ingredients
  strMeasure1?: string | null;
  strMeasure2?: string | null;
  strMeasure3?: string | null;
  // ... other measures
  liked?: boolean;
}

export function Recipe({
  recipe,
  isLoggedIn,
}: { recipe: MealDBRecipe; isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stat } = $api.useQuery(
    "get",
    "/api/v1/recipes/{recipe_id}/stats",
    {
      params: { path: { recipe_id: Number.parseInt(recipe.idMeal) } },
    },
  );

  const handleRecipeClick = async () => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  const {mutateLike, like} = useLikeMutation(recipe.idMeal);

  const handleBookmark = async () => {
    console.log(`Bookmarked recipe ${recipe.idMeal}`);
  };

  // Create a short description from instructions if no description is provided
  const getShortDescription = () => {
    if (!recipe.strInstructions) return "";
    return recipe.strInstructions.length > 100
      ? recipe.strInstructions.substring(0, 97) + "..."
      : recipe.strInstructions;
  };

  return (
    <div className="relative z-10 border border-gray-300 rounded-2xl p-8 transform duration-700 hover:border-gray-500">
      <img
        src={recipe.strMealThumb || "https://placehold.co/600x400"}
        alt={recipe.strMeal}
        className="w-full h-40 object-cover rounded cursor-pointer"
        onClick={handleRecipeClick}
      />
      <h3 className="text-xl font-semibold mt-2">{recipe.strMeal}</h3>
      <p className="text-sm text-gray-600">
        {recipe.strCategory} • {recipe.strArea}
      </p>
      <p className="text-sm text-gray-600 mt-2">{getShortDescription()}</p>
      {isLoggedIn && (
        <div className="flex space-x-4 mt-2">
          <button
            type="button"
            className="btn btn-ghost btn-circle text-red-600"
            onClick={() =>
              mutateLike({
                params: { path: { recipe_id: Number.parseInt(recipe.idMeal) } },
              })
            }
          >
            <HeartIcon
              className="w-6 h-6"
              fill={like ? "currentColor" : "none"}
            />
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
