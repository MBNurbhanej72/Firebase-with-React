import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? For logout user.
import { onAuthStateChanged, signOut } from "firebase/auth";



const Home = () => {

  const navigate = useNavigate();


  const [user, setUser] = useState(null);
  console.log("🚀 ~ Home ~ user:", user);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const logout = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }

      setIsLoading(false);
    });


    return () => logout();



    //? onAuthStateChanged() for check user still login or not. This take two params first is auth and second is callback function. In callback function we get currentUser.

  }, []);



  // *****  Logout user  ***** ////

  const handleLogOutUser = () => {

    setIsLoading(true);


    signOut(auth)

      .then(() => toast.success("Logged out successfully 🎉"))

      .catch(err => toast.error(err.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });

  };



  if (isLoading) return <div className="loader-main"><span className="loader" /></div>;



  return (
    <>
      <Navbar />

      <div className="home-main">
        <h1>Dashboard Page</h1>

        {user?.displayName ? <h2>{user?.displayName}</h2> : <h2>{user?.email}</h2>}

        <button className="logout-btn" onClick={handleLogOutUser}>Logout</button>
      </div>
    </>
  );
};

export default Home


