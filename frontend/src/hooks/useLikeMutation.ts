import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../api/client";

export function useLikeMutation(recipeId: string) {
  const queryClient = useQueryClient();
  const { data: like } = $api.useQuery(
    "get",
    "/api/v1/recipes/{recipe_id}/like",
    {
      params: { path: { recipe_id: Number.parseInt(recipeId) } },
    }
  );
  const {mutateAsync: mutateLike} = $api.useMutation("post", "/api/v1/recipes/{recipe_id}/like", {
    onSuccess: () => {
      console.log("Recipe liked successfully");
    },
    onError: (error) => {
      console.error("Error liking recipe:", error);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: [
    "get",
    "/api/v1/recipes/liked-recipes/{user_id}",
        ]
      }
      )
      queryClient.invalidateQueries({
        queryKey: [
          "get",
          "/api/v1/recipes/{recipe_id}/like",
          {
            params: {
              path: {
                recipe_id: Number.parseInt(recipeId),
              },
            },
          },
        ],
      });
    },
  });

  return {
    mutateLike,
    like: like?.is_liked
  }
}
