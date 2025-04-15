import { Outlet } from "react-router";
import { NavBar } from "./Home/NavBar";

function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen items-center">
      <NavBar />
      <main className="w-full h-full p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
