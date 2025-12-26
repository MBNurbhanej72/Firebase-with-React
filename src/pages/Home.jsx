import "../App.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



const Home = () => {

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const currentUser = auth.currentUser;

    setUser(currentUser);

    setIsLoading(false);
  }, []);



  if (isLoading) return <div className="loader-main"><span className="loader" /></div>;



  return (
    <>
      <Navbar />

      <div className="home-main">
        <h1>Dashboard Page</h1>

        {user?.displayName ? <h2>{user?.displayName}</h2> : <h2>{user?.email}</h2>}
      </div>
    </>
  );
};

export default Home


