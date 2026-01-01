import Navbar from "../components/Navbar";

import { Outlet } from "react-router-dom";



const MainLayout = () => {
  return (
    <div className="app-bg">
      <Navbar />

      <div className="outlet-main">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
