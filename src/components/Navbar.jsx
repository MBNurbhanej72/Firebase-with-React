import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import catchErrorMessage from "../utility/catchErrorMessage";
import { RxCross2 } from "react-icons/rx";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? To check if the user is logged in or not.
import { onAuthStateChanged } from "firebase/auth";



// ? For logout user.
import { signOut } from "firebase/auth";
import { HiMenu } from "react-icons/hi";



const Navbar = () => {

  const navigate = useNavigate();


  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [isOpenMenu, setIsOpenMenu] = useState(false);



  useEffect(() => {

    const checkUser = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setIsLoading(false);
    });


    return () => checkUser();



    //? onAuthStateChanged() is used to check user still login or not. It takes two params first is auth and second is callback function. In callback function we get currentUser.

  }, []);



  // *****  Logout user  ***** ////

  const handleLogOutUser = async () => {

    setIsLoading(true);



    try {

      await signOut(auth);  ////? Return undefined 



      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear(); ////? Remove from DOM
        window.recaptchaVerifier = null;  ////? Remove from memory
      }



      setUser(null);

      navigate("/login");

      toast.success("Logged out successfully 🎉");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };



  if (isLoading || user === undefined) return null;



  return (
    <div className="nav-main">
      <nav className="navbar">
        <NavLink to="/" className="nav-logo">
          <img src="/assets/logo.svg" height={25} alt="Logo Image" />
          <span>Firebase with React</span>
        </NavLink>

        <div className="nav-links">
          {!user ?
            <>
              <NavLink to="/login">Sign In</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
            :
            <>
              <NavLink to="">Home</NavLink>
              <NavLink to="realtime-db">RealTime Database</NavLink>
              <NavLink to="firestore-db">FireStore Database</NavLink>
              <NavLink to="crud">CRUD</NavLink>

              <button className="logout-btn" onClick={handleLogOutUser}>Logout</button>
            </>
          }
        </div>

        <HiMenu onClick={() => setIsOpenMenu(true)} color="black" size={25} className="menu-icon" />
      </nav>


      <div className={`mobile-sidebar ${isOpenMenu ? "open" : ""}`}>
        <div className="sidebar-header">
          <RxCross2
            onClick={() => setIsOpenMenu(false)}
            size={28}
            color="black"
            className="close-btn"
          />
        </div>
        <ul className="sidebar-menu list-unstyled">
          {!user ?
            <>
              <li><NavLink to="/login">Sign In</NavLink></li>
              <li><NavLink to="/signup">Sign Up</NavLink></li>
            </>
            :
            <>
              <li><NavLink onClick={() => setIsOpenSidebar(false)} to="">Home</NavLink></li>
              <li><NavLink onClick={() => setIsOpenSidebar(false)} to="realtime-db">RealTime Database</NavLink></li>
              <li><NavLink onClick={() => setIsOpenSidebar(false)} to="firestore-db">FireStore Database</NavLink></li>
              <li><NavLink onClick={() => setIsOpenSidebar(false)} to="crud">CRUD</NavLink></li>

              <li><button className="logout-btn" onClick={() => {
                handleLogOutUser();
                setIsOpenMenu(false);
              }}>Logout</button></li>
            </>
          }
        </ul>
      </div>

      {/* Background Overlay */}
      {isOpenMenu && <div className="overlay"></div>}

    </div>
  );
};

export default Navbar;
