import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? To check if the user is logged in or not.
import { onAuthStateChanged } from "firebase/auth";



// ? For logout user.
import { signOut } from "firebase/auth";



const Navbar = () => {

  const navigate = useNavigate();


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



  // *****  Logout user  ***** ////

  const handleLogOutUser = () => {

    setIsLoading(true);


    signOut(auth)

      .then(() => {
        setUser(null);

        navigate("/login");

        toast.success("Logged out successfully 🎉");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });

  };



  if (isLoading) return null;



  return (
    <div className="nav-main">
      <nav className="navbar">
        <NavLink to="/" className="nav-logo">
          🔥<span>Firebase with React</span>
        </NavLink>

        <div className="nav-links">
          {!user ?
            <>
              <NavLink to="/login">Sign In</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
            :
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/realtime-db">RealTime Database</NavLink>
              <NavLink to="/firestore-db">FireStore Database</NavLink>

              <button className="logout-btn" onClick={handleLogOutUser}>Logout</button>
            </>
          }
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
