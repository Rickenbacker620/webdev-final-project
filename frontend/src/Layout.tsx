import { Outlet } from "react-router";
import { NavBar } from "./Home/NavBar";

function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">
      <NavBar />
      <main className="w-full h-full p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
