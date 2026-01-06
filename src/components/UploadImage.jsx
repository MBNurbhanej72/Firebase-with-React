import "../App.css";
import { toast } from "react-toastify";



//? For upload data in firebase storage.
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";



//? Import firebase storage instances from firebase configuration.
import { storage } from "../config/firebase";





// *****  Upload data in Storage  ***** ////

export const handleUpload = async (selectedFile, productId) => { ///? selectedFile <--- from UploadImage.jsx

  if (!selectedFile || !productId) return toast.error("Please select a file");



  try {

    ///! In this scenario, old uploaded image delete logic is required because the file name is included in the storage path, so each upload creates a new file in storage. 
    //// const fileRef = ref(storage, `products/${productId}-${selectedFile.name}`);


    ///! In this scenario, old uploaded image delete logic is not required because the image is replaced at the same location. 
    const fileRef = ref(storage, `products/${productId}`);

    //? ref() for create reference for upload location in storage. It takes two params first storage instance and second name of folder. 



    await uploadBytes(fileRef, selectedFile);

    //? uploadBytes() for upload data in storage. It takes two params first created reference of file and second uploaded file object from frontend. 



    const downloadURL = await getDownloadURL(fileRef);

    //? getDownloadURL() for create url for uploaded data. It takes only one param which is created reference of file.



    return downloadURL;

  }

  catch (err) { toast.error(catchErrorMessage(err)); }

};





const UploadImage = ({ file, setFile, updateProduct }) => {

  const handleFileChange = (e) => {

    const selectedFile = e.target.files?.[0];



    if (!selectedFile) return;



    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image");

      e.target.value = "";

      return;
    }



    setFile(selectedFile);

  };





  return (
    <div className="upload-wrapper">
      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

        <div className="upload-left">
          <span className="upload-text">
            {(file || updateProduct?.product_img) ? "Selected" : "Select Image"}
          </span>
        </div>

        <div className="upload-right">
          {(file || updateProduct?.product_img) ? file?.name : "No file chosen"}
        </div>
      </label>
    </div>
  );
};

export default UploadImage;
