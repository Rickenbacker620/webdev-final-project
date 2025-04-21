import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "./Account/Login";
import Profile from "./Account/Profile";
import Signup from "./Account/Signup";
import Home from "./Home";
import { NavBar } from "./Home/NavBar";
import Layout from "./Layout";
import RecipeDetail from "./Recipe/RecipeDetail";
import RecipeEditor from "./Recipe/RecipeEditor";
import RecipeSearchResult from "./Recipe/RecipeSearchResult";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as the parent
    children: [
      {
        index: true, // Default child route
        element: <Home />,
      },
      {
        path: "/recipe/new",
        element: <RecipeEditor />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetail />,
      },
      {
        path: "/profile/:userid",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "search",
        element: <RecipeSearchResult />,
      }
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
