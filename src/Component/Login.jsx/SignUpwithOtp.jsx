import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FaArrowLeft, FaMobileAlt } from "react-icons/fa";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";
import { Signup } from "./Signup";
import "../../../src/index.css";
import axios from "axios";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const SignUpwithOtp = ({
  setShowRegisterForm,
  setShowSignUp,
  setPhoneNumber,
  phoneNumber,
  setLoginForm,
  loginForm,
}) => {
  const [closeSignup, setCloseSignUp] = useState(true);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [saveRecaptca, setSaveRecaptcha] = useState("null");

  const startResendTimer = () => {
    setResendDisabled(true);
    let minutes = 1;
    let seconds = 59;

    const formatTime = (minutes, seconds) => {
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    setTimer(formatTime(minutes, seconds));

    const interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          setResendDisabled(false);
        } else {
          minutes -= 1;
          seconds = 59;
        }
      } else {
        seconds -= 1;
      }
      setTimer(formatTime(minutes, seconds));
    }, 1000);
  };

  const getVerifyOtp = (e) => {
   // alert("it is running")
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
    let verifyData = new FormData();
    verifyData.append("accesskey", "90336");
    verifyData.append("type", "verify-user");
    verifyData.append("mobile", "+91" + phoneNumber);
    setisLoading(true);
    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/user-registration.php",
        verifyData,
        config
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
          });
          setisLoading(false);
        } else {
          //alert("phone number1");
          if (phoneNumber.length >= 10) {
          //  alert("phone number2")
            setExpandForm(true);
            genrateReCaptcha();
            // if (!window.recaptchaVerifier) {
            //   genrateReCaptcha();
            // }
            setisLoading(false);

            let appVerifier = window.recaptchaVerifier;

            const formatPh = "+91" + phoneNumber;
           // console.log("auth formatph appVerifier",auth,formatPh,appVerifier)
            signInWithPhoneNumber(auth, formatPh, appVerifier)
              .then((confirmationResult) => {
               // alert("phone number3")
                window.confirmationResult = confirmationResult;
                toast.success("OTP has been sent successfully", {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 500,
                });
              })
              .catch((error) => {


                console.log("Error during signInWithPhoneNumber",error);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An Error Occurred. Please Try Again Later.");
      });
  };

  const genrateReCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          setSaveRecaptcha(response);
        },
      }
    );
  };

  const requstOtp = (e) => {
    e.preventDefault();
    getVerifyOtp();
    startResendTimer();
  };

  const verifyOtp = (e) => {
    e.preventDefault();

    if (OTP?.length === 6) {
      window.confirmationResult
        .confirm(OTP)
        .then((res) => {
          toast.success("Verification Successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 300,
          });
          setShowRegisterForm(true);
          setShowSignUp(false);
        })
        .catch((err) => {
          console.log("Error during OTP verification:",err);
        });
    }
  };

  const resendOtp = () => {
    getVerifyOtp();
    setResendDisabled(true);
    startResendTimer();
  };

  const handleCloseSignUp = () => {
    setShowSignUp(false);
    setLoginForm(true);
  };
  const isPhoneNumberValid = (phone) => {
    return phone.replace(/\D/g, "").length === 10;
  };

  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleLoginShow = () => {
    setShowSignUp(false);
    setLoginForm(true);
    setPhoneNumber("");
  };

  return (
    <>
      <div>
        {closeSignup && (
          <>
            <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
              <div></div>
              <div className="relative w-[518px] h-[430px] my-6 mx-auto max-w-3xl bg-white rounded-lg">
                <div id="recaptcha-container"></div>
                <div className="px-5 py-2 flex justify-between text-center items-center rounded-sm-y">
                  <span>
                    {" "}
                    <FaArrowLeft
                      className="bg-white cursor-pointer"
                      onClick={handleLoginShow}
                    />
                  </span>
                  <h3 className="text-2xl  text-center text-GrayBlinkit">
                    Register{" "}
                  </h3>

                  <span
                    className="text-2xl text-graycol cursor-pointer"
                    onClick={handleCloseSignUp}
                  >
                    x
                  </span>
                </div>
                <div className="border-b border-b-light_gray mt-3"></div>

                <div className="relative p-6 flex-auto ">
                  <form className="bg-white md:rounded px-8 pt-4  justify-center items-center text-center">
                    <div id="recaptcha-container"></div>

                    <p
                      htmlFor=""
                      className="justify-center items-center text-center mb-8 text-[20px] text-GrayBlinkit whitespace-pre-line"
                    >
                      Enter your phone number to {"\n"} Login/Sign up
                    </p>

                    <div className="mb-3 flex justify-center items-center gap-2 w-[74%] ml-16  border border-border_gray ">
                      <label htmlFor="" className="text-[16px]">
                        <FaMobileAlt className="text-GrayBlinkit " />
                      </label>
                      <input
                        className="w-[74%]  p-3 rounded-lg outline-none"
                        type="text"
                        disabled={expandForm}
                        value={`+91${phoneNumber}`}
                        onChange={(e) => {
                          const inputPhone = e.target.value.slice(
                            3,
                            e.target.value.length
                          );
                          if (inputPhone?.length <= 10) {
                            setPhoneNumber(inputPhone);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Phone"
                      />
                    </div>

                    {expandForm === true ? (
                      <div className="mb-3">
                        {" "}
                        <p
                          htmlFor=""
                          className="justify-center items-center text-center mb-4 text-[20px]  text-GrayBlinkit "
                        >
                          Enter verification code
                        </p>
                        <div className="">
                          <OtpInput
                            value={OTP}
                            onChange={setOTP}
                            separator={<span className="mx-2">-</span>}
                            isInputNum={true}
                            inputStyle="border border-GrayBlinkit rounded-md text-left px-1 text-2xl  mx-auto"
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                          />
                        </div>
                      </div>
                    ) : null}

                    {expandForm === false ? (
                      <button
                        className={`${
                          isPhoneNumberValid(phoneNumber)
                            ? "bg-lime hover:bg-customGreen text-white cursor-pointer"
                            : "bg-lava_grey text-white"
                        } rounded-full xs:rounded-lg xs:text-xs w-[74%] ml-8 h-10 md:text-base md:font-medium inline-block font-medium`}
                        onClick={requstOtp}
                        disabled={
                          !isPhoneNumberValid(phoneNumber) || resendDisabled
                        }
                      >
                        Next
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          className="rounded-full bg-lime hover:bg-customGreen text-white xs:rounded-lg xs:text-xs xs:h-8 md:w-full xs:w-full md:h-10 md:text-base md:font-medium inline-block font-medium ..."
                          onClick={verifyOtp}
                        >
                          Verify OTP
                        </button>
                        {resendDisabled ? (
                          <p className="text-xs font-bold text-red ">{timer}</p>
                        ) : (
                          <button
                            className="rounded-full bg-Light_BLUE text-white hover:bg-Crayola_blue xs:rounded-lg xs:text-xs xs:h-8 md:w-full xs:w-full md:h-10 md:text-base md:font-medium inline-block font-medium ..."
                            onClick={resendOtp}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
        {showSignUpForm && <Signup />}
      </div>
    </>
  );
};
