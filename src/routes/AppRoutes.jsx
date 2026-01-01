import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import AuthPageRoute from "./AuthPageRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MainLayout from "../layouts/MainLayout";
import RealTimeDatabase from "../pages/RealTimeDatabase";
import FireStoreDatabase from "../pages/FireStoreDatabase";
import CRUD from "../pages/CRUD";



export const router = createBrowserRouter([
  {
    path: "/", element: <MainLayout />, children: [

      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },

          { path: "realtime-db", element: <RealTimeDatabase /> },

          { path: "firestore-db", element: <FireStoreDatabase /> },

          { path: "crud", element: <CRUD /> },
        ]
      },


      {
        element: <AuthPageRoute />,
        children: [
          { path: "login", element: <Login /> },

          { path: "signup", element: <SignUp /> }
        ]
      }

    ]
  },
]);
