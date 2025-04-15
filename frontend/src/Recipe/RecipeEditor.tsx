import { useState } from "react";
import { useNavigate } from "react-router";
import { $api } from "../api/client";

function RecipeEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const navigate = useNavigate();

  const recipePostMutation = $api.useMutation(
    "post",
    "/api/v1/recipes/",
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recipePostMutation.mutateAsync(
      {
        body: {
          title: title,
          description: description,
          ingredients: ingredients,
          steps: steps,
        }
      }
    )
    navigate("/");
  };

  return (
    <div className="max-w-lg w-1/4 min-w-[300px] mt-2 rounded-xl shadow-lg bg-base-200 mx-auto">
      <form className="space-y-6 p-6 sm:p-10" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-primary text-center">Post a Recipe</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered border-primary text-primary"
            placeholder="Enter the recipe title"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered border-primary text-primary"
            placeholder="Enter the recipe description"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Ingredients</span>
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="textarea textarea-bordered border-primary text-primary"
            placeholder="Enter the ingredients"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary">Steps</span>
          </label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="textarea textarea-bordered border-primary text-primary"
            placeholder="Enter the steps"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-secondary w-full hover:bg-secondary-focus active:bg-secondary-content transition duration-200"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
}

export default RecipeEditor;
