import "../App.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { TbTrashFilled } from "react-icons/tb";
import catchErrorMessage from "../utility/catchErrorMessage";



//? For store data in database.
import { push, get, ref, set } from "firebase/database";



//? Import realtime database instances from firebase configuration.
import { realTimeDB } from "../config/firebase";



const RealTimeDatabase = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [cities, setCities] = useState([]);





  useEffect(() => {
    handleGetData();
  }, []);





  // *****  Create realtime data  ***** ////

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



    setIsSaving(true);



    try {

      const dataRef = ref(realTimeDB, "cities");

      //? In this scenario, ref() is used to get a reference where data will be store. It takes two params first realTimeDB instance and second name of collection.


      const res = await push(dataRef, {
        cityName: city.trim(),
        pincode: pin
      });



      console.log(res);



      //? *** For nested data entry in realtime database. 
      const cityId = res?.key; ///? Return document id



      const subRef = ref(realTimeDB, `cities/${cityId}/areas`);

      //? In this scenario, ref() is used to get a reference where data will be store. It takes two params first realTimeDB instance and second name of collection.



      await push(subRef, ["hmt", "ahm", "del"]);

      // ! In push() id generate automatically and in set() it's not possible.


      //? push() or set() is used to save data in database. It takes two params first ref() and second pass the data, in ref() it takes two params first pass database instance and second is name of collection where data will be stored.

      ////// const res = await set(ref(realDB, "cities/1"), {
      //////   city: city.trim(),
      //////   pincode: pincode
      ////// });




      toast.success("Data added successfully 🎉");

      setCity("");

      setPincode("");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally {
      handleGetData();

      setIsSaving(false);
    }

  };





  // *****  Read / Get realtime data  ***** ////

  const handleGetData = async () => {

    setIsLoading(true);



    try {

      const dataRef = ref(realTimeDB, "cities");

      //? In this scenario, ref() is used to get a reference of colletion data. It takes two params first realTimeDB instance and second name of collection.



      const getData = await get(dataRef);

      //? get() is used to get data from perticular collection. It takes only one param which is reference of data.



      const finalData = getData.val(); ///? val() ---> Get values in object format.

      console.log("🚀 ~ finalData:", finalData);



      if (!finalData) {
        setCities([]);
        return;
      }



      const latestAtTop = Object.entries(finalData).map(([key, value]) => ({
        id: key,
        ...value,
        areas: Object.entries(value.areas)[0][1],
      }
      ));



      setCities(latestAtTop.reverse()); ///? <--- reverse() is used to get the latest data at to top



      console.log("🚀 ~ finalData converted into Array: ", Object.entries(finalData).map(([key, value]) => ({
        id: key,
        ...value,
        areas: Object.entries(value.areas)[0][1],
      })));

      ///? Object.entries() is used to convert object into array. ([key, value]) it means, see finalData output which shows key value pair of document id and its object.  

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  return (
    <>
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

          <button className="save-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Data"}
          </button>
        </form>
      </div>

      <div className="city-list">
        {!isLoading ?
          Array.isArray(cities) && cities.length ? cities?.map(city => (
            <div className="city-card" key={city?.id}>

              <div className="city-info">
                <h3>{city?.cityName}</h3>
                <p>Pincode: {city?.pincode}</p>
              </div>

              <div className="city-actions">
                <button className="icon-btn edit-btn">
                  <AiFillEdit size={22} />
                </button>

                <button className="icon-btn delete-btn">
                  <TbTrashFilled size={22} />
                </button>
              </div>

            </div>
          )) :
            <h1>No data found!</h1> :
          <div className="loader-main"><span className="loader" /></div>}
      </div>

    </>
  );
};

export default RealTimeDatabase;
