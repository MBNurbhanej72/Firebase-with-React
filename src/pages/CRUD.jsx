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



//? Import firestore database instances from firebase configuration.
import { db } from "../config/firebase";



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



    const ref = collection(db, "products");

    //? collection() use for get reference of specific firestore collection. It takes two params first db instance and second name of collection where data will be stored.



    try {

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
        tags: ["new", "trending"],
      });

      //? addDoc() use for save data in database. It takes only one param which is collection().



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



    const ref = doc(db, "products", dataId);

    //? doc() use for get reference of perticular single data. It takes three params first db instance, second name of collection and third is data id. 



    try {

      const res = await getDoc(ref);

      //? getDoc() use for get data from database. It takes only one param which is reference of data.



      if (!res.exists()) {
        toast.error("City not found");
        return;
      }

      console.log({ id: res?.id, ...res?.data() });

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Read / Get all collection data  ***** ////

  const getProducts = async () => {

    setIsLoading(true);



    const ref = collection(db, "products");

    //? collection() use for get reference of multiple data. It takes two params first db instance and second name of collection. 



    const newestAtTop = query(ref, orderBy("createdAt", "desc"));

    //? query() use for create reference of filtered data. It takes two params first collection reference and second many query constraints (where, orderBy, limit, etc.).  

    //? orderBy() use for sort data into ascending / descending order. It takes two params first value name and second asc / desc.



    try {

      const res = await getDocs(newestAtTop);

      //? getDocs() use for get data from database. It takes only one param which is reference of data.



      const allProducts = await Promise.all(
        res?.docs?.map(async (doc) => {

          const product = {
            id: doc.id,
            ...doc.data(),
          };



          const subRef = collection(db, `products/${doc.id}/extraDetails`);

          const subRes = await getDocs(subRef);

          //? getDocs() use for get data from database. It takes only one param which is reference of data.



          let extraDetails = null;

          if (!subRes.empty) {
            extraDetails = {
              id: subRes.docs[0].id,
              ...subRes.docs[0].data(),
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



    const ref = collection(db, "products");

    //? collection() use for get reference of multiple data. It takes two params first db instance and second name of collection. 



    // productName "jeans" na ho
    const dataQuery = query(ref, where("productName", "!=", "jeans"));

    // // productName "shirt" ho aur price 100 ya usse zyada ho
    // const q3 = query(ref,  where("productName", "==", "shirt"), where("price", ">=", 100));

    // // tags array me "new" ho
    // const q6 = query(ref, where("tags", "array-contains", "new")); //// Work in array

    // // tags array me "new" ya "trending" me se koi ek ho
    // const q7 = query(ref, where("tags", "array-contains-any", ["new", "trending"])); //// Work in array

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


    //? query() use for create reference of filtered data. It takes two params first collection reference and second many query constraints (where, orderBy, limit, etc.). 

    //? where() use for filter data based on a condition. It takes three params first key of data, second conditional operator and third value of data.



    try {

      const res = await getDocs(dataQuery);

      //? getDocs() use for get data from database. It takes only one param which is reference of query data.



      res?.docs?.map(doc =>
        setProductData({ id: doc?.id, ...doc?.data() })
      );

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  Update Data  ***** ////

  const updateProduct = async (dataId) => {

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



    const ref = doc(db, "products", updateProduct.id);



    const subRef = doc(db, `products/${updateProduct.id}/extraDetails/${updateProduct.extraDetails.id}`);

    //? doc() use for get reference of perticular single data. It takes three params first db instance, second name of collection and third is data id. 



    try {

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

        //? updateDoc() use for update data in database. Return undefined. It takes two params first reference of data and second pass the updated data.
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





  // *****  Delete Data  ***** ////

  const deleteProduct = async (dataId) => {

    setIsLoading(true);



    const ref = doc(db, "products", dataId);

    //? doc() use for get reference of perticular single data. It takes three params first db instance, second name of collection and third is data id. 



    try {

      await deleteDoc(ref);

      //? deleteDoc() use for delete data in database. Return undefined. It takes only one param which is reference of data.



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
          <div className="product-card" key={product?.id}>

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

              <button className="btn delete" onClick={() => deleteProduct(product?.id)}>Delete</button>
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