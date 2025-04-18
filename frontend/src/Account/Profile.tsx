import { $api } from "../api/client";
import { Recipe } from "../components/Recipe";

function Profile() {
  const { data } = $api.useQuery("get", "/api/v1/auth/users/me");
  const { data: myRecipes } = $api.useQuery(
    "get",
    "/api/v1/recipes/my-recipes",
  );

  const { data: likedRecipes } = $api.useQuery(
    "get",
    "/api/v1/recipes/liked-recipes",
  );

  return (
    <div className="w-auto h-full my-auto mx-2 bg-base-100 rounded-xl">
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="profile_tabs"
          className="tab"
          aria-label="My Recipes"
          defaultChecked
        />
        <div className="tab-content p-10">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myRecipes?.map((recipe) => (
              <Recipe key={recipe.id} recipe={recipe} isLoggedIn={true} />
            ))}
          </div>
        </div>

        <input
          type="radio"
          name="profile_tabs"
          className="tab"
          aria-label="Liked Recipes"
        />
        <div className="tab-content p-10">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedRecipes?.map((recipe) => (
              <Recipe key={recipe.id} recipe={recipe} isLoggedIn={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="flex items-center justify-center min-h-screen">
  //     <div className="max-w-lg w-full min-w-[300px] rounded-xl shadow-lg bg-white p-6">
  //       <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
  //         User Profile
  //       </h1>
  //       <div className="space-y-4">
  //         <div>
  //           <label className="block text-sm font-medium text-green-600">
  //             Name
  //           </label>
  //           <p className="mt-1 text-green-700">John Doe</p>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-green-600">
  //             Email
  //           </label>
  //           <p className="mt-1 text-green-700">johndoe@example.com</p>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-green-600">
  //             Favorite Recipes
  //           </label>
  //           <ul className="mt-1 list-disc list-inside text-green-700">
  //             <li>Spaghetti Carbonara</li>
  //             <li>Chicken Tikka Masala</li>
  //             <li>Vegetable Stir Fry</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default Profile;
