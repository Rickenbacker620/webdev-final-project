import { useParams } from "react-router";

function RecipeDetail() {
  const { id } = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full rounded-xl shadow-lg bg-white p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
          Recipe Detail
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Viewing details for recipe ID: {id}
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-green-600">Ingredients</h2>
            <ul className="mt-2 list-disc list-inside text-green-700">
              <li>Ingredient 1</li>
              <li>Ingredient 2</li>
              <li>Ingredient 3</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-600">Instructions</h2>
            <ol className="mt-2 list-decimal list-inside text-green-700">
              <li>Step 1: Do something</li>
              <li>Step 2: Do something else</li>
              <li>Step 3: Finish up</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;