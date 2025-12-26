import "../App.css";
import { useState } from "react";
import { toast } from "react-toastify";



//? For fire store database.
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";



//? Import fire store database instances from firebase configuration.
import { db } from "../config/firebase";



const FireStoreDatabase = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  // *****  Create data  ***** ////

  const handleSubmit = (e) => {

    e.preventDefault();


    if (!city || !pincode) {
      toast.error("Please fill all fields");
      return;
    }


    const pin = Number(pincode);

    if (Number.isNaN(pin)) {
      toast.error("Pincode must be a valid number");
      return;
    }


    setIsLoading(true);


    addDoc(collection(db, "cities"), {
      cityName: city.trim(),
      pincode: pin
    })

      .then(res => {
        console.log(res);


        //? *** For nested data entry in database. 
        const cityId = res?.id;

        return addDoc(collection(db, "cities", cityId, "areas"), {
          areas: ["hmt", "ahm", "delhi"]
        });
      })

      .then(() => {
        toast.success("Data added successfully 🎉");

        setCity("");

        setPincode("");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? addDoc() for save data in database. It takes only one param which is collection(), in collection() it takes two params first db instance and second name of collection where data will be stored. 

  };



  // *****  Read / Get single data  ***** ////

  const getCity = () => {

    setIsLoading(true);


    const ref = doc(db, "cities", "M87BzuGM2l2sLAKnCJPc");

    //? doc() for get reference of perticular single data. It takes three params first db instance, second name of collection and third is data id. 


    getDoc(ref)

      .then(res => {
        if (!res.exists()) {
          toast.error("City not found");
          return;
        }

        console.log({ id: res?.id, ...res?.data() });
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? getDoc() for get data from database. It takes only one param which is reference of data.

  };



  // *****  Read / Get all collection data  ***** ////

  const getCities = () => {

    setIsLoading(true);


    const ref = collection(db, "cities");

    //? collection() for get reference of multiple data. It takes two params first db instance and second name of collection. 


    getDocs(ref)

      .then(res => res?.docs?.map(doc => console.log({ id: doc?.id, ...doc?.data() })))

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? getDocs() for get data from database. It takes only one param which is reference of data.

  };



  // *****  Read / Get condition based data  ***** ////

  const getCitiesByQuery = () => {

    setIsLoading(true);


    const ref = collection(db, "cities");

    //? collection() for get reference of multiple data. It takes two params first db instance and second name of collection. 


    // const dataQuery = query(ref, where("cityName", "!=", "ahmedabad"));

    // const dataQuery = query(ref, where("pincode", ">", 380000));

    const dataQuery = query(ref, where("cityName", "==", "delhi"), where("pincode", "==", 383322));

    // const dataQuery = query(ref, where("areas", "array-contains-any", ["Area1", "Area"])); //// Work in array

    // const dataQuery = query(ref, where("areas", "array-contains", ["Area1", "Area"])); //// Work in array

    // const dataQuery = query(ref, where("cityName", "in", ["delhi", "ahmedabad"])); //// Not work in array

    // const dataQuery = query(ref, where("cityName", "not-in", ["delhi", "ahmedabad"])); //// Not work in array

    //? query() for get reference of condition based data. It takes two params first db instance and second where(), where() takes three params first key of data, second conditional operator and third value of data. 


    getDocs(dataQuery)

      .then(res => res?.docs?.map(doc => console.log({ id: doc?.id, ...doc?.data() })))

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? getDocs() for get data from database. It takes only one param which is reference of query data.

  };



  return (
    <div className="form-wrapper" style={{ flexDirection: "column" }}>
      <form className="city-form" onSubmit={handleSubmit}>
        <h2>📍 Add City & Pincode</h2>

        <div className="input-group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <label>City Name</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
          <label>Pincode</label>
        </div>

        <button className="save-button" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Data"}
        </button>
      </form>


      <div style={{ marginTop: 30 }}>
        <button className="btn-primary" onClick={getCity} style={{ width: "fit-content", marginRight: 20 }}>Get Ahm City</button>

        <button className="btn-primary" onClick={getCities} style={{ width: "fit-content", marginRight: 20 }}>Get Cities</button>

        <button className="btn-primary" onClick={getCitiesByQuery} style={{ width: "fit-content", marginRight: 20 }}>Get Cities By Query</button>
      </div>
    </div>
  );
};

export default FireStoreDatabase;
