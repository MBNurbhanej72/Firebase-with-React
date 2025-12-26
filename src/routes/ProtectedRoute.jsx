import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? To check if the user is logged in or not.
import { onAuthStateChanged } from "firebase/auth";



const ProtectedRoute = () => {

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const checkUser = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setIsLoading(false);
    });


    return () => checkUser();



    //? onAuthStateChanged() for check user still login or not. It takes two params first is auth and second is callback function. In callback function we get currentUser.

  }, []);



  if (isLoading) return <div className="loader-main"><span className="loader" /></div>;



  if (!user) return <Navigate to="/login" replace />;;



  return <Outlet />;
};

export default ProtectedRoute;