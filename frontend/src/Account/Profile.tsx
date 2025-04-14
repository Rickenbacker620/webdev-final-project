function Profile() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg w-full min-w-[300px] rounded-xl shadow-lg bg-white p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
          User Profile
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-600">
              Name
            </label>
            <p className="mt-1 text-green-700">John Doe</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-600">
              Email
            </label>
            <p className="mt-1 text-green-700">johndoe@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-600">
              Favorite Recipes
            </label>
            <ul className="mt-1 list-disc list-inside text-green-700">
              <li>Spaghetti Carbonara</li>
              <li>Chicken Tikka Masala</li>
              <li>Vegetable Stir Fry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
