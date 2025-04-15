import { BookmarkIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLoaderData } from "react-router";
import type { components } from "../api/schema";
import { $api } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export function Recipe({
  recipe,
  isLoggedIn,
}: { recipe: components["schemas"]["RecipeRead"]; isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRecipeClick = async () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const likeMutation = $api.useMutation(
    "post",
    "/api/v1/recipes/{recipe_id}/like",
    {
      onSuccess: () => {
        console.log("Recipe liked successfully");
      },
      onError: (error) => {
        console.error("Error liking recipe:", error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/recipes/liked-recipes"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/recipes"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/recipes/my-recipes"],
        });
      },
    },
  );

  const handleBookmark = async () => {
    console.log(`Bookmarked recipe ${recipe.id}`);
  };

  return (
    <div className="relative z-10 border border-gray-300 rounded-2xl p-8 transform duration-700 hover:border-gray-500">
      <img
        src={recipe.image_url ?? "https://placehold.co/600x400"}
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
            onClick={() =>
              likeMutation.mutate({
                params: { path: { recipe_id: recipe.id } },
              })
            }
          >
            <HeartIcon
              className="w-6 h-6"
              fill={recipe.liked ? "currentColor" : "none"}
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
