import "../App.css";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { MdPermPhoneMsg } from "react-icons/md";
import catchErrorMessage from "../utility/catchErrorMessage";



//? Import authentication instances from firebase configuration.
import { auth } from "../config/firebase";



//? For sign up user with email & password, phone number, Google, GitHub, Facebook.
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier, signInWithPhoneNumber,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  getAdditionalUserInfo
} from "firebase/auth";



const SignUp = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);


  const [otpBoxShow, setOtpBoxShow] = useState(false);

  const [phone, setPhone] = useState("");

  const [confirmation, setConfirmation] = useState(null);

  const [otp, setOtp] = useState("");





  // *****  SignUp with email and password  ***** ////

  const handleSignUpUser = async (e) => {

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



    try {

      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);

      //? createUserWithEmailAndPassword() use for sign up using email & password. It takes three params first auth, second email and third password.



      console.log(res?.user);

      console.log(res?._tokenResponse);

      toast.success("Account created successfully 🎉");

      navigate("/");



      //? Send verification mail <-- Still not working...
      // const user = res?.user;

      // try {

      //   await sendEmailVerification(user,{ url: "https://firebase-with-react-by-mb.vercel.app" });



      //   setEmail("");

      //   setPassword("");

      //   await signOut(auth);

      //   navigate("/login");

      //   toast.info("Verification email sent. Please verify your email to continue.");

      // } catch (err) {
      //   toast.error("Failed to send verification email");
      // }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  SignUp with phone number  ***** ////

  const handlePhoneAuth = async () => {

    //? 🔹 CASE 1: Send OTP
    if (!confirmation) {

      if (!phone || phone.length < 10) {
        toast.error("Enter valid phone number");
        return;
      }



      setIsLoading(true);



      try {

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier =
            new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });

          //? new RecaptchaVerifier() this is class of recaptcha. It takes three params first auth, second id of recaptcha container and third type of captcha object.
        }



        const res = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);

        //? signInWithPhoneNumber() use for sign up & login using phone number. It takes three params first auth, second phone number and third window.recaptchaVerifier.



        console.log(res?.verificationId);

        setConfirmation(res);

        toast.success("OTP sent successfully!");

      } catch (err) {

        toast.error(err?.code
          .replace("auth/", "")
          .replace(/-/g, " ")
          .replace(/^\w/, (c) => c?.toUpperCase()));

      } finally {
        setIsLoading(false);
      }



      return;

    }



    //? 🔹 CASE 2: Verify OTP
    if (otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }



    setIsLoading(true);



    try {

      await confirmation.confirm(otp);

      //? confirmation.confirm(otp) for check verificationId === otp.



      toast.success("Phone number verified successfully 🎉");

      setOtpBoxShow(false);

      setConfirmation(null);

      setOtp("");

      setPhone("");

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };


  const handleClosePhoneModal = () => {

    setOtpBoxShow(false);

    setConfirmation(null);

    setOtp("");

    setPhone("");


    //! This code add into logout funtion for remove Recaptcha verifier 
    //// if (window.recaptchaVerifier) {
    ////     window.recaptchaVerifier.clear(); //////? Remove from DOM
    ////     window.recaptchaVerifier = null;  //////? Remove rom memory
    //// } 

  };





  // *****  SignUp with Google  ***** ////

  const googleProvider = new GoogleAuthProvider();


  const handleGoogleAuth = async () => {

    setIsLoading(true);



    try {

      const res = await signInWithPopup(auth, googleProvider);

      //? signInWithPopup() use for open Google popup. It takes two params first auth and second Google provider instance.



      console.log(res?._tokenResponse);

      console.log(res?.user);

      navigate("/");



      const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user --> return true otherwise false.


      if (isNewUser) {
        toast.success("Signed up with Google successfully 🎉");
      } else {
        toast.success("Logged in with Google successfully 🎉");
      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  SignUp with GitHub  ***** ////

  const gitHubProvider = new GithubAuthProvider();


  const handleGitHubAuth = async () => {

    setIsLoading(true);



    try {

      const res = await signInWithPopup(auth, gitHubProvider);

      //? signInWithPopup() use for open GitHub popup. It takes two params first auth and second GitHub provider instance.



      console.log(res?._tokenResponse);

      console.log(res?.user);

      navigate("/");



      const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user --> return true otherwise false.


      if (isNewUser) {
        toast.success("Signed up with GitHub successfully 🎉");
      } else {
        toast.success("Logged in with GitHub successfully 🎉");
      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  // *****  SignUp with Facebook  ***** ////

  const facebookProvider = new FacebookAuthProvider();


  const handleFacebookAuth = async () => {

    setIsLoading(true);



    try {

      const res = await signInWithPopup(auth, facebookProvider);

      //? signInWithPopup() use for open Facebook popup. It takes two params first auth and second Facebook provider instance.



      console.log(res?._tokenResponse);

      console.log(res?.user);

      navigate("/");



      const isNewUser = getAdditionalUserInfo(res)?.isNewUser; //? new user --> return true otherwise false.


      if (isNewUser) {
        toast.success("Signed up with Facebook successfully 🎉");
      } else {
        toast.success("Logged in with Facebook successfully 🎉");
      }

    }

    catch (err) { toast.error(catchErrorMessage(err)); }

    finally { setIsLoading(false); }

  };





  return (
    <>
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
                <button
                  type="button"
                  className="btn-social phone"
                  onClick={() => {
                    handleClosePhoneModal();
                    setOtpBoxShow(true);
                  }}
                >
                  <MdPermPhoneMsg size={20} />
                </button>

                <button type="button" className="btn-social google" onClick={handleGoogleAuth}>
                  <FcGoogle size={20} />
                </button>

                <button type="button" className="btn-social github" onClick={handleGitHubAuth}>
                  <FaGithub size={20} />
                </button>

                <button type="button" className="btn-social facebook" onClick={handleFacebookAuth}>
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


      {otpBoxShow && (
        <div className="otp-overlay">
          <div className="otp-modal">

            {!confirmation ? (
              <>
                <h3 style={{ marginBottom: 20 }}>Signup with Phone number</h3>

                {/* Phone input */}
                <div className="phone-input">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: 20 }}>Enter OTP</h3>

                {/* OTP input */}
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  shouldAutoFocus
                  inputType="tel"
                  renderSeparator={<span style={{ width: "8px" }} />}
                  renderInput={(props) => <input {...props} />}
                  containerStyle="otp-container"
                  inputStyle="otp-box"
                  focusStyle="otp-box-focus"
                />
              </>
            )}

            <button className="btn-primary" type="button" onClick={handlePhoneAuth}>
              {isLoading ?
                <svg fill="#FFFFFFFF" height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" /><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" /></path></svg>

                : !confirmation ? "Send OTP" : "Verify OTP"}
            </button>

            <button className="otp-cancel" type="button" onClick={handleClosePhoneModal}>Cancel</button>

          </div>
        </div>
      )}

      {/* recaptcha */}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default SignUp;
