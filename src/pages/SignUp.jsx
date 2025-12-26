import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? For sign up user using email & password, Google, Facebook.
import { createUserWithEmailAndPassword, getAdditionalUserInfo, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, FacebookAuthProvider, sendEmailVerification } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";



const SignUp = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  // *****  SignUp with email and password  ***** ////

  const handleSignUpUser = (e) => {

    e.preventDefault();


    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }


    setIsLoading(true);


    createUserWithEmailAndPassword(auth, email.trim(), password)

      .then(res => {
        console.log(res?.user);

        console.log(res?._tokenResponse);


        setIsLoading(true);


        const user = res?.user;

        //? Send verification mail
        sendEmailVerification(user, { url: "http://localhost:5173/" })

          .then(() => toast.info("Verification email sent. Please verify your email to continue."))

          .catch(() => toast.error("Failed to send verification email"));
      })

      .catch(err => toast.error(err?.code
        .replace("auth/", "")
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c?.toUpperCase())))

      .finally(() => {
        setIsLoading(false);
      });



    //? createUserWithEmailAndPassword() for sign up using email & password. It takes three params first auth, second email and third password.

  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload().then(() => {
          if (user.emailVerified) {
            toast.success("Account created successfully 🎉");
            navigate("/");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);



  // *****  SignUp with Google  ***** ////

  const googleProvider = new GoogleAuthProvider();

  const signUpWithGoogle = () => {

    setIsLoading(true);


    signInWithPopup(auth, googleProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");


        const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user return true otherwise false.

        if (isNewUser) {
          toast.success("Signed up with Google successfully 🎉");
        } else {
          toast.info("Account already exists. Logged in successfully 🎉");
        }
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



  // *****  SignUp with GitHub  ***** ////

  const gitHubProvider = new GithubAuthProvider();

  const signUpWithGitHub = () => {

    setIsLoading(true);


    signInWithPopup(auth, gitHubProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");


        const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user return true otherwise false.

        if (isNewUser) {
          toast.success("Signed up with GitHub successfully 🎉");
        } else {
          toast.info("Account already exists. Logged in successfully 🎉");
        }
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



  // *****  SignUp with Facebook  ***** ////

  const facebookProvider = new FacebookAuthProvider();

  const signUpWithFacebook = () => {

    setIsLoading(true);


    signInWithPopup(auth, facebookProvider)

      .then(res => {
        console.log(res?._tokenResponse);

        console.log(res?.user);

        navigate("/");


        const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user return true otherwise false.

        if (isNewUser) {
          toast.success("Signed up with Facebook successfully 🎉");
        } else {
          toast.info("Account already exists. Logged in successfully 🎉");
        }
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
    <div className="auth-container" style={{ marginTop: 84 }}>
      <div className="auth-card">
        <div>
          <h2>Create Account ✨</h2>
          <p className="subtitle">Sign up to get started</p>
        </div>

        {isLoading ? <span className="loader" /> :

          <form>
            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
            </div>

            {/* Submit */}
            <button className="btn-primary" onClick={handleSignUpUser}>Sign Up</button>

            {/* Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* Social Signup */}
            <div className="btn-social-main">
              <button type="button" className="btn-social google" onClick={signUpWithGoogle}>
                <FcGoogle size={20} />
              </button>

              <button type="button" className="btn-social github" onClick={signUpWithGitHub}>
                <FaGithub size={20} />
              </button>

              <button type="button" className="btn-social facebook" onClick={signUpWithFacebook}>
                <FaFacebookF size={20} />
              </button>
            </div>

            <p className="switch-auth">
              Already have an account? <span onClick={() => navigate("/")}>Sign In</span>
            </p>
          </form>

        }

      </div>
    </div>
  );
};

export default SignUp;
