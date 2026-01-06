import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import catchErrorMessage from "../utility/catchErrorMessage";



//? For add, read, update, delete data in firestore database.
import {
  doc, collection,
  addDoc,
  getDoc, getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  query
} from "firebase/firestore";



//? Import firestore database & storage instances from firebase configuration.
import { db, storage } from "../config/firebase";



//? For delete image from storage.
import { deleteObject, ref as imageRef } from "firebase/storage";



const CRUD = () => {

  const navigate = useNavigate();


  const [productData, setProductData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    getProducts();
  }, []);





  // *****  Create data  ***** ////

  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!productName || !price || !colour || !category) {
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

      const ref = collection(db, "products");

      //? In this scenario, collection() is used to get a reference to a firestore collection. It takes two params first db instance and second name of collection where data will be stored.



      const res = await addDoc(ref, {
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
        tags: ["New", "Trending"],
      });

      //? addDoc() is used to save data in database. It takes only one param which is collection().



      toast.success("Data added successfully 🎉");

      setProductName("");

      setPrice("");

      setColour("");

      setCategory("");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Read / Get single data  ***** ////

  const getProduct = async (dataId) => {

    setIsLoading(true);



    try {

      const ref = doc(db, "products", dataId);

      //? In this scenario, In this scenario, doc() is used to get a reference of perticular single data.and third is data id. 



      const res = await getDoc(ref);

      //? getDoc() is used to get single data from database. It takes only one param which is reference of data.



      if (!res.exists()) {
        toast.error("City not found");
        return;
      }

      console.log({ id: res?.id, ...res?.data() }); ///? data() ---> Get data in object format.

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Read / Get all collection data  ***** ////

  const getProducts = async () => {

    setIsLoading(true);



    try {

      const ref = collection(db, "products");

      //? In this scenario, collection() is used to get a reference of multiple data. It takes two params first db instance and second name of collection. 



      const latestAtTop = query(ref, orderBy("createdAt", "desc"));

      //? query() is used to get a reference of filtered data. It takes two params first collection reference and second many query constraints (where, orderBy, limit, etc.).  

      //? orderBy() is used to sort data into ascending / descending order. It takes two params first value name and second asc / desc.



      const res = await getDocs(latestAtTop);

      //? getDocs() is used to get multiple data from database. It takes only one param which is reference of data.



      const allProducts = await Promise.all(
        res?.docs?.map(async (doc) => {

          const product = {
            id: doc.id,
            ...doc.data(), ///? data() ---> Get data in object format.
          };



          const subRef = collection(db, `products/${doc.id}/extraDetails`);

          const subRes = await getDocs(subRef);

          //? getDocs() is used to get multiple data from database. It takes only one param which is reference of data.



          let extraDetails = null;

          if (!subRes.empty) {
            extraDetails = {
              id: subRes.docs[0].id,
              ...subRes.docs[0].data(), ///? data() ---> Get data in object format.
            };
          }



          return {
            ...product,
            extraDetails
          };

        })

        //? Promise.all() waits for all promises. Executes when all promises return values. 

      );



      setProductData(allProducts);

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Read / Get condition based data  ***** ////

  const getProductsByQuery = async () => {

    setIsLoading(true);



    try {

      const ref = collection(db, "products");

      //? In this scenario, collection() is used to get a reference of multiple data. It takes two params first db instance and second name of collection. 



      // productName "jeans" na ho
      const dataQuery = query(ref, where("productName", "!=", "jeans"));

      // // productName "shirt" ho aur price 100 ya usse zyada ho
      // const q3 = query(ref,  where("productName", "==", "shirt"), where("price", ">=", 100));

      // // tags array me "New" ho
      // const q6 = query(ref, where("tags", "array-contains", "New")); //// Work in array

      // // tags array me "New" ya "Trending" me se koi ek ho
      // const q7 = query(ref, where("tags", "array-contains-any", ["New", "Trending"])); //// Work in array

      // // category in ["cloth", "jeans"]
      // const q8 = query(ref, where("category", "in", ["cloth", "jeans"])); //// Not work in array

      // // category not in ["cloth", "shoes"]
      // const q9 = query(ref, where("category", "not-in", ["cloth", "shoes"])); //// Not work in array

      // // newest product top me lane ke liye
      // const q10 = query(ref, orderBy("createdAt", "desc"));

      // // newest + category filter
      // const q11 = query(ref, where("category", "==", "cloth"), orderBy("createdAt", "desc"));

      // // price ke hisaab se sasta → mehnga
      // const q12 = query(ref, orderBy("price", "asc"));

      // // sirf top 5 newest products
      // const q13 = query(ref, orderBy("createdAt", "desc"), limit(5));


      //? query() is used to get a reference of filtered data. It takes two params first collection reference and second many query constraints (where, orderBy, limit, etc.). 

      //? where() is used to filter data based on a condition. It takes three params first key of data, second conditional operator and third value of data.



      const res = await getDocs(dataQuery);

      //? getDocs() is used to get multiple data from database. It takes only one param which is reference of query data.



      res?.docs?.map(doc =>
        setProductData({ id: doc?.id, ...doc?.data() }) ///? data() ---> Get data in object format. 
      );

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Update data  ***** ////

  const updateProduct = async (dataId, imageUrl) => {

    const productPrice = Number(price);



    if (Number.isNaN(productPrice)) {
      toast.error("Price must be a number");
      return;
    }



    if (!updateProduct?.extraDetails?.id) {
      toast.error("Extra details not found");
      return;
    }



    setIsLoading(true);



    try {

      ///! *** Old uploaded image delete logic is required when the file name is included in the storage path.  
      if (imageUrl && productData?.product_img && imageUrl !== productData?.product_img) {

        try {

          const imgReference = imageRef(storage, imageUrl);

          //? ref as imageRef() is used to get a reference of perticular image from storage. It takes two params first storage instance and second pass imageUrl.



          await deleteObject(imgReference);

          //? deleteObject() is used to delete image from storage. It takes only one param which is reference of image url.

        } catch (err) { toast.info("Image not found or already deleted"); }

      }



      const ref = doc(db, "products", updateProduct.id);



      const subRef = doc(db, `products/${updateProduct.id}/extraDetails/${updateProduct.extraDetails.id}`);

      //? In this scenario, In this scenario, doc() is used to get a reference of perticular single data.and third is data id. 



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

        //? updateDoc() is used to update data in database. Return undefined. It takes two params first reference of data and second pass the updated data.
      ]);



      toast.success("Data updated successfully 🎉");

      navigate(".", { replace: true }); ////? Navigate to same page

      setProductName("");

      setPrice("");

      setColour("");

      setCategory("");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Delete data  ***** ////

  const deleteProduct = async (dataId, imageUrl) => {

    setIsLoading(true);



    try {

      //? ***  Delete image from storage.  
      if (imageUrl) {

        try {

          const imgReference = imageRef(storage, imageUrl);

          //? ref as imageRef() is used to get a reference of perticular image from storage. It takes two params first storage instance and second pass imageUrl.



          await deleteObject(imgReference);

          //? deleteObject() is used to delete image from storage. It takes only one param which is reference of image url.

        } catch (err) { toast.info("Image not found or already deleted"); }

      }



      const ref = doc(db, "products", dataId);

      //? In this scenario, doc() is used to get a reference of perticular single data. It takes three params first db instance, second name of collection and third is data id. 



      const subColletion = collection(db, `products/${dataId}/extraDetails`);

      //? In this scenario, collection() is used to get a reference of multiple data of sub-collection. It takes two params first db instance and second name of collection. 



      const subRef = await getDocs(subColletion);

      //? getDocs() is used to get multiple data from database. It takes only one param which is reference of data.



      await Promise.all(
        subRef?.docs?.map(subRes => deleteDoc(
          doc(db, `products/${dataId}/extraDetails`, subRes.id)
        ))
      ); ////? SubCollection data delete.



      await deleteDoc(ref); ////? Parent data delete.

      //? deleteDoc() is used to delete data in database. Return undefined. It takes only one param which is reference of data.



      // getProducts();

      setProductData(prev => prev.filter(item => item.id !== dataId));

      toast.success("Data deleted successfully 🎉");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  return (
    <div className="product-wrapper">
      {!isLoading ?
        Array.isArray(productData) && productData.length ? productData?.map(product => (
          <div className="product-card animated-red-border" key={product?.id}>

            <div className="product-card-img">
              <img src={product?.product_img} alt="" />
            </div>

            <div className="product-card-content">
              <div className="card-header">
                <h3>{product?.productName}</h3>
                <span className="price">₹{product?.price}</span>
              </div>

              <div className="card-body">
                <p><strong>Colour:</strong> {product?.extraDetails?.colour}</p>
                <p><strong>Category:</strong> {product?.extraDetails?.category}</p>

                {product?.extraDetails?.tags &&
                  <p><strong>Tags:</strong> {product?.extraDetails?.tags?.join(", ")}</p>
                }

                <p className="date" style={{ marginTop: 20 }}>
                  <strong>Created At:</strong> {dayjs(product.createdAt.toDate()).format("DD/MM/YYYY hh:mm a")}
                </p>

                <p className="date">
                  <strong>Updated At:</strong> {dayjs(product.updatedAt.toDate()).format("DD/MM/YYYY hh:mm a")}
                </p>
              </div>

              <div className="card-actions">
                <button className="btn edit" onClick={() => navigate("/firestore-db", { state: product })}>Update</button>

                <button className="btn delete" onClick={() => deleteProduct(product?.id, product?.product_img)}>Delete</button>
              </div>

            </div>
          </div>)) :

          <h1
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)"
            }}>
            No data found!
          </h1>

        :

        <div className="loader-main crud-loader"><span className="loader" /></div>
      }
    </div>
  );
};

export default CRUD;