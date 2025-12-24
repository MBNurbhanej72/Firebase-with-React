import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { Slide, ToastContainer } from "react-toastify";


const App = () => {
  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  );
};

export default App;
