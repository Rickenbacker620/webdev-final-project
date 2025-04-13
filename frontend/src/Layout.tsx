import { Outlet } from "react-router";
import { NavBar } from "./Home/NavBar";

function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <NavBar />
      <main className="max-w-7xl mx-auto p-4 pt-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
