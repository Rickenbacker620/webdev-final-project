import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { $api } from "../api/client";
import { useState } from "react";
import { useLikeMutation } from "../hooks/useLikeMutation";
import { HeartIcon } from "@heroicons/react/24/outline";
import useAuth from "../hooks/useAuth";

function RecipeDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const { data: recipe } = useQuery({
    queryKey: ["recipe_detail", { id: Number.parseInt(id!) }],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: comments } = $api.useQuery(
    "get",
    "/api/v1/recipes/{recipe_id}/comments",
    {
      params: { path: { recipe_id: Number.parseInt(id!) } },
    },
  );

  const commentMutation = $api.useMutation(
    "post",
    "/api/v1/recipes/{recipe_id}/comments",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/api/v1/recipes/{recipe_id}/comments",
            {
              params: { path: { recipe_id: Number.parseInt(id!) } },
            },
          ],
        });
      },
    },
  );

  const { like, mutateLike } = useLikeMutation(id!);

  const { user } = useAuth();

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const meal = recipe.meals[0];
  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = meal[`strIngredient${i + 1}`];
    const measure = meal[`strMeasure${i + 1}`];
    return ingredient ? `${measure} ${ingredient}` : null;
  }).filter(Boolean);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full rounded-xl shadow-lg bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-green-700">
            {meal.strMeal}
          </h1>
          <button
            type="button"
            className="btn btn-ghost btn-circle text-red-600"
            onClick={() =>
              user
                ? mutateLike({
                    params: { path: { recipe_id: Number.parseInt(id!) } },
                  })
                : alert("Please log in to like recipes.")
            }
          >
            <HeartIcon
              className="w-6 h-6"
              fill={like ? "currentColor" : "none"}
            />
          </button>
        </div>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-center text-gray-600 mb-6">
          Category: {meal.strCategory} | Area: {meal.strArea}
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-green-600">
              Ingredients
            </h2>
            <ul className="mt-2 list-disc list-inside text-green-700">
              {ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-600">
              Instructions
            </h2>
            <p className="mt-2 text-green-700 whitespace-pre-line">
              {meal.strInstructions}
            </p>
          </div>
          {meal.strYoutube && (
            <div>
              <h2 className="text-xl font-semibold text-green-600">Video</h2>
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Watch on YouTube
              </a>
            </div>
          )}
          <div>
            <div className="mt-4 space-y-2">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-base-200 rounded-lg shadow-md"
                >
                  <p className="text-sm text-gray-600">
                    {new Date(comment.created_at).toLocaleDateString()} - User{" "}
                    {comment.user_id}
                  </p>
                  <p className="text-base text-gray-800">{comment.content}</p>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-green-600">Comments</h2>

            <textarea
              className="textarea textarea-bordered w-full mt-2"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                if (user) {
                  commentMutation.mutateAsync({
                    params: { path: { recipe_id: Number.parseInt(id!) } },
                    body: {
                      content: comment,
                    },
                  });
                } else {
                  alert("Please log in to comment.");
                }
              }}
              disabled={!user}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
