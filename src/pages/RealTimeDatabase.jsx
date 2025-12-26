import "../App.css";
import { useState } from "react";
import { toast } from "react-toastify";



//? For store data in database.
import { push, ref, set } from "firebase/database";



//? Import real time database instances from firebase configuration.
import { realTimeDB } from "../config/firebase";



const RealTimeDatabase = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  // *****  Realtime database  ***** ////

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


    push((ref(realTimeDB, "cities")), {   //? set(ref(realDB, "cities/1"), {city:city, pincode:pincode})
      cityName: city.trim(),
      pincode: pin
    })

      .then(res => {
        console.log(res);


        //? *** For nested data entry in database. 
        const cityId = res?.key;

        return push(ref(realTimeDB, `cities/${cityId}/areas`), ["hmt", "ahm", "del"]);
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



    // ! In push() id generate automatically and in set() it's not possible.


    //? push() or set() for save data in database. It takes two params first ref() and second pass the data, in ref() it takes two params first pass database instance and second is name of collection where data will be stored. 

  };



  // *****  Read / Get data  ***** ////



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

export default RealTimeDatabase;
