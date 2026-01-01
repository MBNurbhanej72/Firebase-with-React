import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? To check if the user is logged in or not.
import { onAuthStateChanged } from "firebase/auth";



const AuthPageRoute = () => {

  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const checkUser = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setIsLoading(false);
    });


    return () => checkUser();



    //? onAuthStateChanged() for check user still login or not. It takes two params first is auth and second is callback function. In callback function we get currentUser.

  }, []);



  if (isLoading || user === undefined) return <div className="loader-main"><span className="loader" /></div>;



  return !user ? <Outlet/> : <Navigate to="/" replace />;
};



export default AuthPageRoute;