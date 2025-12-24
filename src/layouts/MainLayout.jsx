import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="app-bg">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
