import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./Home";
import RecipeDetail from "./Recipe/RecipeDetail";
import { NavBar } from "./Home/NavBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as the parent
    children: [
      {
        index: true, // Default child route
        element: <Home />,
        loader: async () => {
          return Array.from({ length: 4 }, (_, i) => ({
            id: i + 1,
            title: `Recipe ${i + 1}`,
            description: `Description for Recipe ${i + 1}`,
            image: `https://placehold.co/600x400/00${i}00${i}/FFFFFF`,
          }));
        },
      },
      {
        path: "recipe/:id",
        element: <RecipeDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="relative h-screen bg-amber-50 overflow-hidden flex justify-center">
      <div className="absolute top-20 left-32 w-72 h-72 bg-green-900 opacity-30 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-80 right-20 w-96 h-96 bg-amber-900 opacity-20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500 opacity-25 rounded-full blur-[70px] pointer-events-none z-0" />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
