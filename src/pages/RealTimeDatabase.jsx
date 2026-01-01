import "../App.css";
import { useState } from "react";
import { toast } from "react-toastify";
import catchErrorMessage from "../utility/catchErrorMessage";



//? For store data in database.
import { push, ref, set } from "firebase/database";



//? Import real time database instances from firebase configuration.
import { realTimeDB } from "../config/firebase";



const RealTimeDatabase = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(false);





  // *****  Realtime database  ***** ////

  const handleSubmit = async (e) => {

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



    try {

      const res = await push((ref(realTimeDB, "cities")), {   //? set(ref(realDB, "cities/1"), {city:city, pincode:pincode})
        cityName: city.trim(),
        pincode: pin
      });

      // ! In push() id generate automatically and in set() it's not possible.


      //? push() or set() use for save data in database. It takes two params first ref() and second pass the data, in ref() it takes two params first pass database instance and second is name of collection where data will be stored. 



      console.log(res);



      //? *** For nested data entry in database. 
      const cityId = res?.key;

      await push(ref(realTimeDB, `cities/${cityId}/areas`), ["hmt", "ahm", "del"]);



      toast.success("Data added successfully 🎉");

      setCity("");

      setPincode("");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  return (
    <div className="form-wrapper">
      <form className="city-form" onSubmit={handleSubmit}>
        <h2>📍 Add City & Pincode</h2>

        <div className="input-group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder=""
          />
          <label>City Name</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder=""
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
