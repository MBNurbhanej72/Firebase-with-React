import "../App.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import catchErrorMessage from "../utility/catchErrorMessage";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? Import messaging instances from firebase configuration.
import { messaging } from "../config/firebase";



//? For cloud messaging.
import { getToken, onMessage } from "firebase/messaging";



const Home = () => {

  const [user, setUser] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const currentUser = auth.currentUser;

    setUser(currentUser);

    setIsLoading(false);



    // *****  Send foreground message  ***** ////

    const message = onMessage(messaging, async (payload) => {

      //? onMessage() is used to send foreground message. It takes two params first instance of messaging and second anonymous function which function take payload param.



      console.log("Foreground Message : ", payload);



      toast(
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

          {payload?.notification?.image &&
            <img src="/assets/logo.svg" height={20} />
          }

          <div>
            <p style={{ fontSize: 12, fontWeight: 600 }}>{payload?.notification?.title}</p>
            <p style={{ color: "black", fontWeight: 600 }}>{payload?.notification?.body}</p>
          </div>

        </div>
      );

    });



    return () => message();

  }, []);





  // *****  Send notification from firebase  ***** ////

  const handleNotification = async () => {

    try {

      //? For get notification permission of user.
      const notification = await Notification.requestPermission();



      if (notification === "granted") {

        const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_NOTIFICATION_KEY });

        //? getToken() is used to get token from perticular device & browser. It takes two params first instance of messaging and second object of vapidKey.



        if (!token) return;


        if (!user) return;

        // 🔹 user document ref
        const userRef = doc(db, "users", user.uid);

        // 🔹 token save / update
        await setDoc(
          userRef,
          { notifyToken: token },
          { merge: true } // ❗ existing data safe rahe
        );

        console.log("🚀 Token:", token);

        toast.success("Notification permission granted.");

      } else if (notification === "denied") {

        toast.success("Notification permission denied.");

      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  if (isLoading) return <div className="loader-main"><span className="loader" /></div>;



  return (
    <div className="home-main">
      <h1>Welcome! {user?.displayName ? user?.displayName : user?.email ? user?.email : "User"} 🎉</h1>

      <button id="notify-btn" onClick={handleNotification}>Notification</button>
    </div>
  );
};

export default Home


