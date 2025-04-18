import { useEffect, useState } from "react";
import { $api } from "../api/client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";

interface AddToListModalProps {
  recipeId: string;
  onClose: () => void;
}

interface RecipeList {
  id: string;
  name: string;
}

export function AddToListModal({ recipeId, onClose }: AddToListModalProps) {
  const { data: recipeLists } = $api.useQuery(
    "get",
    "/api/v1/recipes/recipe-lists",
    {},
  );

  const [newListName, setNewListName] = useState<string>("");

  const queryClient = useQueryClient();

  const createRecipeListMutation = $api.useMutation(
    "post",
    "/api/v1/recipes/recipe-lists",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/recipes/recipe-lists"],
        });
      },
    },
  );

  const addToRecipeListMutation = $api.useMutation(
    "post",
    "/api/v1/recipes/recipe-lists/{recipe_list_id}"
  );

  const handleCreateNewList = () => {
    createRecipeListMutation.mutateAsync(
        {
            body: newListName
        }
    )
  };

  const handleAddToList = (listId: string) => {
    // Logic to add the recipe to the selected list
    console.log(`Add recipe ${recipeId} to list ${listId}`);

    addToRecipeListMutation.mutateAsync({
        params: {
            path: {
                recipe_list_id: listId
            }
        }, 
        body: Number.parseInt(recipeId)
    })

    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add to Recipe List</h3>
        <ul className="mt-4">
          {recipeLists?.map((list) => (
            <li key={list.id} className="mb-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => handleAddToList(list.id)}
              >
                {list.name}
              </button>
            </li>
          ))}
          <li className="flex space-x-1">
            <input
              type="text"
              placeholder="New List Name"
              className="input input-bordered w-full mb-2"
              value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={handleCreateNewList}>
              <PlusIcon className="w-5 h-5 inline-block" />
            </button>
          </li>
        </ul>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
