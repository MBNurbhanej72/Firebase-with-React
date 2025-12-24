import "../App.css";
import { useState } from "react";
import { toast } from "react-toastify";



//? For store data in database.
import { push, ref, set } from "firebase/database";



//? For fire store database.
import { addDoc, collection } from "firebase/firestore";



//? Import real time database instances from firebase configuration.
import { realTimeDB } from "../config/firebase";



const Database = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  // *****  RealTime Database  ***** ////

  const handleSubmit = (e) => {

    e.preventDefault();


    if (!city || !pincode) {
      toast.error("Please fill all fields");
      return;
    }


    const pin = Number(pincode);

    if (Number.isNaN(pin)) {
      toast.error("Pincode must be a valid number");
      setIsLoading(false);
      return;
    }


    setIsLoading(true);


    push((ref(realTimeDB, "cities")), {   //? set(ref(realDB, "cities/1"), {city:city, pincode:pincode})
      city: city,
      pincode: pin
    })

      .then(res => {
        console.log(res);


        //? *** For nested data entry in database. 
        const cityId = res.key;

        push(ref(realTimeDB, `cities/${cityId}/areas`), {
          name: "Main Area",
          code: 72,
        });
        //? *** 


        toast.success("Data added successfully 🎉");

        setCity("");

        setPincode("");
      })

      .catch(err => toast.error(err.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    // ! In push() id generate automatically and in set() it's not possible.


    //? push() or set() for save data in database. This take two param first ref() and second pass the data, in ref() this take two param first pass database instance and second is folder path or name where data will be stored. 

  };



  // *****  Fire Store Database  ***** ////

  // const handleSubmit = (e) => {

  // e.preventDefault();


  // if (!city || !pincode) {
  //   toast.error("Please fill all fields");
  //   return;
  // }


  // setIsLoading(true);



  //   addDoc(collection(db, "cities"), {
  //     city,
  //     pincode
  //   })

  //     .then(res => console.log(res))

  //     .catch(err => toast.error(err.code
  //       .replace("auth/", "")
  //       .replace(/-/g, " ")
  //       .replace(/^\w/, (c) => c.toUpperCase())))

  //     .finally(() => {
  //       setIsLoading(false);
  //     });

  // };



  return (
    <div className="form-wrapper">
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
    </div>
  );
};

export default Database;
