import { useState } from "react";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Button,
} from "@headlessui/react";
import { useNavigate } from "react-router";

function RecipeEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recipe submitted:", { title, description, image });
    navigate("/"); // Redirect to home page after submission
    // Add logic to send data to the backend
  };

  return (
    <div className="flex min-w-[300px] max-w-lg w-1/4 items-center justify-center min-h-screen">
      <div className="w-full rounded-2xl shadow-lg bg-gray-50/80">
        <Fieldset className="space-y-6 p-6 sm:p-10">
          <Legend className="text-2xl font-bold text-green-700 text-center">
            Post a Recipe
          </Legend>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Title
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Enter the recipe title"
              required
            />
          </Field>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Description
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Enter the recipe description"
              required
            />
          </Field>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Image URL
            </Label>
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Enter the image URL"
              required
            />
          </Field>
          <Button
            type="submit"
            className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-2xl data-[hover]:bg-orange-600 data-[active]:bg-orange-700 transition duration-200 cursor-pointer"
            onClick={handleSubmit}
          >
            Submit Recipe
          </Button>
        </Fieldset>
      </div>
    </div>
  );
}

export default RecipeEditor;
