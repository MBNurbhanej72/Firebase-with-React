import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Database from "../pages/Database";
import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },

  {
    path: "/", element: <MainLayout />, children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "db", element: <Database /> }
    ]
  },
]);