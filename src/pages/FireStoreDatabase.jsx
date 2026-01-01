import "../App.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import catchErrorMessage from "../utility/catchErrorMessage";



//? For crud operation in firestore database.
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";



//? For upload data in firebase storage.
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";



//? For add timestamp in firestore database.
import { serverTimestamp } from "firebase/firestore";



//? Import firestore database instances from firebase configuration.
import { db, storage } from "../config/firebase";



const FireStoreDatabase = () => {

  const navigate = useNavigate();


  const { state: updateProduct } = useLocation();


  const [productName, setProductName] = useState("");

  const [price, setPrice] = useState("");

  const [colour, setColour] = useState("");

  const [category, setCategory] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [url, setUrl] = useState("");



  useEffect(() => {
    if (updateProduct) {
      setProductName(updateProduct?.productName || "");
      setPrice(updateProduct?.price || "");
      setColour(updateProduct?.extraDetails?.colour || "");
      setCategory(updateProduct?.extraDetails?.category || "");
    }
  }, [updateProduct]);





  // *****  Create data  ***** ////

  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!productName.trim() || !price || !colour.trim() || !category.trim()) {
      toast.error("Please fill all fields");
      return;
    }



    const productPrice = Number(price);

    if (Number.isNaN(productPrice)) {
      toast.error("Price must be a number");
      return;
    }



    setIsLoading(true);



    try {

      if (!updateProduct) {

        const res = await addDoc(collection(db, "products"), {
          productName: productName.trim(),
          price: productPrice,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log(res);



        //? *** For nested data entry in database. 
        const productId = res?.id;

        await addDoc(collection(db, `products/${productId}/extraDetails`), {
          colour: colour.trim(),
          category: category.trim(),
          tags: ["new", "trending"],
        });



        toast.success("Data added successfully 🎉");

        setProductName("");

        setPrice("");

        setColour("");

        setCategory("");
      }





      // *****  Update data  ***** ////

      else {

        if (!updateProduct?.extraDetails?.id) {
          toast.error("Extra details not found");
          return;
        }



        const ref = doc(db, "products", updateProduct.id);

        const subRef = doc(db, `products/${updateProduct.id}/extraDetails/${updateProduct.extraDetails.id}`);



        await Promise.all([
          updateDoc(ref, {
            productName: productName.trim(),
            price: productPrice,
            updatedAt: serverTimestamp()
          }),

          updateDoc(subRef, {
            colour: colour.trim(),
            category: category.trim()
          })
        ]);



        toast.success("Data updated successfully 🎉");

        navigate(".", { replace: true }); ////? Navigate to same page

        setProductName("");

        setPrice("");

        setColour("");

        setCategory("");
      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Upload data in Storage  ***** ////

  const handleUpload = async () => {

    if (!file) return alert("Please select a file");


    const fileRef = ref(storage, `uploads/${file.name}`);

    //? ref() for create reference for upload location in storage. It takes two params first storage instance and second name of folder. 


    await uploadBytes(fileRef, file);

    //? uploadBytes() for upload data in storage. It takes two params first created reference of file and second uploaded file object from frontend. 


    const downloadURL = await getDownloadURL(fileRef);

    //? getDownloadURL() for create url for uploaded data. It takes only one param which is created reference of file.


    setUrl(downloadURL);

    toast.success("File uploaded successfully 🎉");

  };





  return (
    <div className="form-wrapper">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{updateProduct ? "Update" : "Add"} Product</h2>

        <div className="input-group">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder=""
          />
          <label>Product Name</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder=""
          />
          <label>Price</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            placeholder=""
          />
          <label>Colour</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder=""
          />
          <label>Category</label>
        </div>

        <button className="save-button" type="submit" disabled={isLoading}>
          {!updateProduct ? isLoading ? "Saving..." : "Save Data" : isLoading ? "Updating..." : "Update Data"}
        </button>
      </form>
    </div>
  );
};

export default FireStoreDatabase;
