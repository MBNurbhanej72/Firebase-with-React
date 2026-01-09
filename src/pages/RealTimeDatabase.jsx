import "../App.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { TbTrashFilled } from "react-icons/tb";
import catchErrorMessage from "../utility/catchErrorMessage";



//? For store data in database.
import { push, get, ref, set, remove, query, update, onValue, orderByChild, startAt, equalTo, endAt, orderByKey, limitToLast, limitToFirst, serverTimestamp } from "firebase/database";



//? Import realtime database instances from firebase configuration.
import { realTimeDB } from "../config/firebase";



const RealTimeDatabase = () => {

  const [city, setCity] = useState("");

  const [pincode, setPincode] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [cities, setCities] = useState([]);

  const [editId, setEditId] = useState(null);





  useEffect(() => {
    // handleGetData();

    const cleanup = handleGetDataUsingOnValue();

    return () => cleanup && cleanup();
  }, []);





  // *****  Create realtime data  ***** ////

  const handleSubmitOrUpdate = async (e) => {

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

      if (!editId) {

        const dataRef = ref(realTimeDB, "cities");

        //? In this scenario, ref() is used to get a reference where data will be store. It takes two params first realTimeDB instance and second name of collection.


        const res = await push(dataRef, {
          cityName: city.trim().toLowerCase(),
          pincode: pin,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });



        console.log(res);



        //? *** For nested data entry in realtime database. 
        const cityId = res?.key; ///? Return document id



        const subRef = ref(realTimeDB, `cities/${cityId}/areas`);

        //? In this scenario, ref() is used to get a reference where data will be store. It takes two params first realTimeDB instance and second name of collection.



        await push(subRef, ["hmt", "ahm", "del"]);

        // ! In push() id generate automatically and in set() it's not possible.


        //? push() or set() is used to save data in database. It takes two params first reference of data and second pass the data.

        ////// const res = await set(ref(realDB, "cities/1"), {
        //////   city: city.trim().toLowerCase(),
        //////   pincode: pincode
        ////// });



        toast.success("Data added successfully 🎉");

      }





      // *****  Update realtime data  ***** ////

      else {

        const updateRef = ref(realTimeDB, `cities/${editId}`);

        //? In this scenario, ref() is used to get a reference where data will be updated. It takes two params first realTimeDB instance and second name of collection.



        await update(updateRef, {
          cityName: city.trim().toLowerCase(),
          pincode: pincode,
          updatedAt: serverTimestamp(),
        });

        //? update() is used to update data in the database. It takes two params first reference of data and second pass the data.



        toast.success("Data updated successfully 🎉");

      }



      setCity("");

      setPincode("");

      setEditId(null);

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally {
      handleGetDataUsingOnValue();

      // handleGetData();

      setIsSaving(false);
    }

  };





  // *****  Read / Get instant realtime data using onValue()  ***** ////

  const handleGetDataUsingOnValue = () => {

    const dataRef = ref(realTimeDB, "cities");

    //? In this scenario, ref() is used to get a reference of colletion data. It takes two params first realTimeDB instance and second name of collection.



    const q = dataRef;


    //* For filtering remove reverse() in setCities. 

    // const q = query(dataRef, orderByChild("createdAt"), limitToLast(5));

    // const q = query(dataRef, orderByChild("createdAt"), limitToFirst(5));

    // const q = query(dataRef, orderByChild("cityName"), startAt("g"), endAt("g\uf8ff"));

    // const q = query(dataRef, orderByChild("cityName"), equalTo("ahmedabad"));

    // const q = query(dataRef, orderByChild("pincode"), equalTo(383220));

    // const q = query(dataRef, orderByChild("pincode"), startAt(300000), endAt(383200));

    //? query() is used to get a reference of filtered data. It takes two params first collection reference and second many query constraints (orderByChild, limitToLast, etc.). 



    const cleanup = onValue(q, (res) => {

      //? onValue() is used to get instant data from realtime database. It takes two params first reference of data and second callback function.



      const finalData = res.val(); ///? val() ---> Get values in object format.

      console.log("🚀 ~ handleGetDataUsingOnValue ~ finalData:", finalData);



      if (!finalData) {
        setCities([]);

        setIsLoading(false);

        return;
      }



      const latestAtTop = Object.entries(finalData).map(([key, value]) => ({
        id: key,
        ...value,
        areas: value?.areas
          ? Object.entries(value.areas)[0]?.[1] ?? null
          : null,
      }
      ));



      setCities(latestAtTop.reverse()); ///? <--- reverse() is used to get the latest data at to top



      console.log("🚀 ~ finalData converted into Array: ", Object.entries(finalData).map(([key, value]) => ({
        id: key,
        ...value,
        areas: value?.areas
          ? Object.entries(value.areas)[0]?.[1] ?? null
          : null,
      }
      )));

      ///? Object.entries() is used to convert object into array. ([key, value]) it means, see finalData output which shows key value pair of document id and its object.  



      setIsLoading(false);

    });



    return () => cleanup();

  };





  // *****  Read / Get realtime data  ***** ////

  const handleGetData = async () => {

    try {

      const dataRef = ref(realTimeDB, "cities");

      //? In this scenario, ref() is used to get a reference of colletion data. It takes two params first realTimeDB instance and second name of collection.



      const getData = await get(dataRef); ///? Using get() we can't get instant data without refresh page. 

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
        areas: value?.areas
          ? Object.entries(value.areas)[0]?.[1] ?? null
          : null,
      }
      ));



      setCities(latestAtTop.reverse()); ///? <--- reverse() is used to get the latest data at to top



      console.log("🚀 ~ finalData converted into Array: ", Object.entries(finalData).map(([key, value]) => ({
        id: key,
        ...value,
        areas: value?.areas
          ? Object.entries(value.areas)[0]?.[1] ?? null
          : null,
      }
      )));

      ///? Object.entries() is used to convert object into array. ([key, value]) it means, see finalData output which shows key value pair of document id and its object.  

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Delete realtime data  ***** ////

  const handleDeleteData = async (dataId) => {

    try {

      const dataRef = ref(realTimeDB, `cities/${dataId}`);

      //? In this scenario, ref() is used to get a reference of colletion data. It takes two params first realTimeDB instance and second name of collection.



      await remove(dataRef);

      //? remove() is used to remove single data from realtime database. It takes only one param which is reference of data.



      handleGetDataUsingOnValue();

      // handleGetData();

      setCity("");

      setPincode("");

      setEditId(null);

      toast.success("Data deleted successfully 🎉");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

  };





  return (
    <>
      <div className="form-wrapper">
        <form className="city-form" onSubmit={handleSubmitOrUpdate}>
          <h2>📍{!editId ? "Add" : "Update"} City & Pincode</h2>

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
            {isSaving ?
              editId ? "Updating..." : "Saving..." :
              editId ? "Update Data" : "Save Data"}
          </button>
        </form>
      </div>

      <div className="city-list">
        {!isLoading ?
          Array.isArray(cities) && cities.length ? cities?.map(city => (
            <div className="city-card" key={city?.id}>

              <div className="city-info">
                <h3 style={{ textTransform: "capitalize" }}>{city?.cityName}</h3>
                <p>Pincode: {city?.pincode}</p>
              </div>

              <div className="city-actions">
                <button className="icon-btn edit-btn">
                  <AiFillEdit onClick={() => {
                    setEditId(city?.id);
                    setCity(city?.cityName);
                    setPincode(city?.pincode);
                  }} size={22} />
                </button>

                <button className="icon-btn delete-btn">
                  <TbTrashFilled onClick={() => handleDeleteData(city?.id)} size={22} />
                </button>
              </div>

            </div>
          )) :
            <h1 style={{ textAlign: "center" }}>No data found!</h1> :
          <div className="loader-main"><span className="loader" /></div>}
      </div>

    </>
  );
};

export default RealTimeDatabase;
