import "../App.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import catchErrorMessage from "../utility/catchErrorMessage";
import UploadImage, { handleUpload } from "../components/UploadImage";



//? For crud operation in firestore database.
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";



//? For add timestamp in firestore database.
import { serverTimestamp } from "firebase/firestore";



//? Import firestore database instances from firebase configuration.
import { db } from "../config/firebase";



const FireStoreDatabase = () => {

  const navigate = useNavigate();


  const { state: updateProduct } = useLocation();


  const [productName, setProductName] = useState("");

  const [price, setPrice] = useState("");

  const [colour, setColour] = useState("");

  const [category, setCategory] = useState("");

  const [isSaving, setIsSaving] = useState("save");

  const [isUpdating, setIsUpdating] = useState("update");

  const [isSavingOrUpdating, setIsSavingOrUpdating] = useState(false);

  const [file, setFile] = useState(null);



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



    if (!updateProduct && !file) {
      toast.error("Please select product image");
      return;
    }



    setIsSavingOrUpdating(true);



    try {

      setIsSaving("saving");



      if (!updateProduct) {

        const ref = collection(db, "products");



        const res = await addDoc(ref, {
          productName: productName.trim(),
          price: productPrice,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });



        console.log(res);



        const productId = res?.id;



        //? *** For nested data entry in database. 
        await addDoc(collection(db, `products/${productId}/extraDetails`), {
          colour: colour.trim(),
          category: category.trim(),
          tags: ["New", "Trending"],
        });



        //? *** For upload image in storage. 
        let imageURL = "";



        imageURL = await handleUpload(file, productId); /// <--- imageURL === returned the downloadURL from handleUpload()



        await updateDoc(doc(db, "products", productId), {
          product_img: imageURL,
        });



        navigate("/crud");

        toast.success("Data added successfully 🎉");

        setProductName("");

        setPrice("");

        setColour("");

        setCategory("");
      }





      // *****  Update data  ***** ////

      else {

        setIsUpdating("updating");


        if (!updateProduct?.extraDetails?.id) {
          toast.error("Extra details not found");
          return;
        }



        const ref = doc(db, "products", updateProduct.id);

        const subRef = doc(db, `products/${updateProduct.id}/extraDetails/${updateProduct.extraDetails.id}`);



        //? *** Update image in updating mode. 
        const updateProductId = updateProduct?.id;



        let oldImageURL = updateProduct?.product_img;



        if (file) {
          oldImageURL = await handleUpload(file, updateProductId); /// <--- imageURL === returned the downloadURL from handleUpload()
        }



        await Promise.all([
          updateDoc(ref, {
            productName: productName.trim(),
            price: productPrice,
            product_img: oldImageURL,
            updatedAt: serverTimestamp()
          }),

          updateDoc(subRef, {
            colour: colour.trim(),
            category: category.trim()
          })
        ]);



        toast.success("Data updated successfully 🎉");

        navigate("/crud");

        // navigate(".", { replace: true }); ////? Navigate to same page

        setProductName("");

        setPrice("");

        setColour("");

        setCategory("");
      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsSavingOrUpdating(false); }

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

        <UploadImage file={file} setFile={setFile} updateProduct={updateProduct} />

        <button className="save-button" type="submit" disabled={isSavingOrUpdating}>
          {!updateProduct ?
            isSaving !== "save" ? "Saving..." : "Save Data"
            :
            isUpdating !== "update" ? "Updating..." : "Update Data"}
        </button>
      </form>
    </div>
  );
};

export default FireStoreDatabase;
