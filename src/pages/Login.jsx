import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? For sign in user using email & password, Google.
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider } from "firebase/auth";



const Login = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  // *****  Login with email and password  ***** ////

  const handleLoginUser = (e) => {

    e.preventDefault();


    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }


    setIsLoading(true);


    signInWithEmailAndPassword(auth, email.trim(), password)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");

        toast.success("Logged in successfully 🎉");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? signInWithEmailAndPassword() for sign in using email & password. It takes three params first auth, second email and third password.

  };



  // *****  Reset Password using email  ***** ////

  const resetPassword = () => {

    if (email.trim() == "") {
      toast.error("Please enter your email first");
      return;
    }


    setIsLoading(true);


    sendPasswordResetEmail(auth, email.trim(), { url: "http://localhost:5173/" })

      .then(() => toast.info("Password reset email sent 📩"))

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? sendPasswordResetEmail() for reset password using email. It takes three params first auth, second param pass email and third param optional which is {url: "http://localhost:5173/"}. When we pass url then firebase reset password popup redirect to our website or when not pass url param so not redirect to our website. 

  };



  // *****  Login with Google  ***** ////

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {

    setIsLoading(true);


    signInWithPopup(auth, googleProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");

        toast.success("Logged in with Google successfully 🎉");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? signInWithPopup() for open Google popup. It takes two params first auth and second Google provider instance.

  };



  // *****  Login with GitHub  ***** ////

  const gitHubProvider = new GithubAuthProvider();

  const signInWithGitHub = () => {

    setIsLoading(true);


    signInWithPopup(auth, gitHubProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");

        toast.success("Logged in with GitHub successfully 🎉");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? signInWithPopup() for open GitHub popup. It takes two params first auth and second GitHub provider instance.

  };



  // *****  Login with Facebook  ***** ////

  const facebookProvider = new FacebookAuthProvider();

  const signInWithFacebook = () => {

    setIsLoading(true);


    signInWithPopup(auth, facebookProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");

        toast.success("Logged in with Facebook successfully 🎉");
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? signInWithPopup() for open Facebook popup. It takes two params first auth and second Facebook provider instance.

  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Please sign in to your account</p>
        </div>

        {isLoading ? <span className="loader" /> :

          <form>
            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>

            {/* Forgot password */}
            <div className="forgot-row">
              <span style={{ cursor: "pointer" }} onClick={resetPassword}>Forgot password?</span>
            </div>

            {/* Submit */}
            <button className="btn-primary" onClick={handleLoginUser}>Sign In</button>

            {/* Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* Social Login */}
            <div className="btn-social-main">
              <button type="button" className="btn-social google" onClick={signInWithGoogle}>
                <FcGoogle size={20} />
              </button>

              <button type="button" className="btn-social github" onClick={signInWithGitHub}>
                <FaGithub size={20} />
              </button>

              <button type="button" className="btn-social facebook" onClick={signInWithFacebook}>
                <FaFacebookF size={20} />
              </button>
            </div>

            <p className="switch-auth">
              Don’t have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          </form>

        }

      </div >
    </div >
  );
};

export default Login;
