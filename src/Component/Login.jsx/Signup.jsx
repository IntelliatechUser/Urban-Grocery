import React, { useState } from "react";

import axios from "axios";

import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoaderState } from "../zustand/useLoaderState";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";


export const Signup = ({
  setOpenLogin,
  phoneNumber,
  setShowRegisterForm,
  setLoginForm,
}) => {
  const [userRegistraion, setUserRegistration] = useState({
    name: "",
    password: "",
    // phoneNumber: "",
  });
  const [closeSignup, setCloseSignUp] = useState(true);
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();
  const [signUpvisiblePassword, setSignUpVisiblePassword] = useState(false);
  const handleUserSignUp = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserRegistration({ ...userRegistraion, [name]: value });
  };

  const handleSingUp = (e) => {
    e.preventDefault();

    if (!userRegistraion.name || !userRegistraion.password) {
      toast.error("Please enter all the fields");
      return;
    }

    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    let formData = new FormData();
    formData.append("accesskey", "90336");
    formData.append("type", "register");
    formData.append("name", userRegistraion.name);
    formData.append("password", userRegistraion.password);
    formData.append("mobile", "+91" + phoneNumber);

    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/user-registration.php",
        formData,
        config
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setisLoading(false);
          setLoginForm(true);
          setShowRegisterForm(false);
        } else {
          toast.success("User registered successfully");
          setLoginForm(true);
          setShowRegisterForm(false);
          setisLoading(false);
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.");
        setisLoading(false);
      });
    setUserRegistration({
      name: "",
      password: "",
      phoneNumber: "",
    });
  };

  const handleCloseSignUp = () => {
    // setCloseSignUp(false);
    setCloseSignUp((prev) => !prev);
    setOpenLogin(false);
    // setLoginFormModals(false);
    // navigate("/");
  };

  const handleSignUpShowVisivblePassword = () => {
    setSignUpVisiblePassword((prev) => !prev);
  };

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const NameRegex = /^(?=.*[ A-Za-z]){2,}$/;

  return (
    <div>
      <>
        {closeSignup && (
          <>
            <div className="fixed  z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
              <div className="bg-[#f5f5f5] rounded top-[5%] md:h-[360px] xs:h-[380px] left-[5%] md:w-[500px] xs:w-[340px] sm:w-[500px]">
                <div className="flex justify-center items-center relative">
                  <div className="container relative flex ">
                    <div className="mb-4 mt-32 md:w-[50%] xs:w-[30%]">
                      <img
                        src="http://grocery.intelliatech.in/dist/img/logo.png"
                        className="w-40 mx-4 "
                        alt="Flowbite Logo"
                      />
                    </div>

                    <div className="md:w-[70%] xs:w-[70%] p-8  mr-auto rounded-2xl ">
                      <button
                        className="absolute top-[5%] right-[5%]"
                        onClick={handleCloseSignUp}
                      >
                        <AiOutlineCloseCircle className="text-red text-2xl hover:opacity-50" />
                      </button>
                      <div className="mt-[-20px]">
                        <h1 className="font-bold  text-3xl">Signup</h1>
                      </div>
                      <form>
                        <div></div>
                        <div className="gap-5 mt-5">
                          <div>
                            <input
                              className=" w-full bg-gray-100 border-gray-400 text-gray-900 mt-1 p-3 rounded-lg focus:shadow-outline"
                              id="text"
                              type="text"
                              name="name"
                              placeholder="Enter your name"
                              value={userRegistraion.name}
                              onChange={handleUserSignUp}
                            />
                            <div className="mt-6 mb-3">
                              {
                              userRegistraion.name?.length >= 2 ? (
                                NameRegex.test(userRegistraion.name) ? (
                                  <p className={`text-sm text-lime`}>null</p>
                                ) : null
                              ) : (
                                <p className={`text-sm text-RedColour`}>
                               {   userRegistraion.name?.length >=1 && <div>Name must be at least 2 characters</div>}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="relative flex items-center">
                            <input
                              className="w-full bg-gray-100 border-gray-400 text-gray-900 mt-2 p-3  rounded-lg focus:shadow-outline"
                              type={signUpvisiblePassword ? "text" : "password"}
                              placeholder="Password"
                              onChange={handleUserSignUp}
                              value={userRegistraion.password}
                              name="password"
                            />
                            <div
                              onClick={handleSignUpShowVisivblePassword}
                              className="absolute xs:ml-[160px] md:ml-[200px] sm:ml-[280px] mt-2 cursor-pointer"
                            >
                              {signUpvisiblePassword ? (
                                <AiFillEye />
                              ) : (
                                <AiFillEyeInvisible />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 mb-3">
                          {userRegistraion.password?.length >= 8 ? (
                            strongPasswordRegex.test(
                              userRegistraion.password
                            ) ? (
                              <p className={`text-sm text-lime`}>
                                Strong password.
                              </p>
                            ) : (
                              <p className={`text-sm text-red`}>
                                Password must contain at least one lowercase
                                letter, one uppercase letter, one number, and
                                one symbol (@$!%*?&).
                              </p>
                            )
                          ) : (
                            <p className={`text-sm text-RedColour`}>
                            {  userRegistraion.password?.length >= 1 && <div>Password must be at least 8 characters long</div>}
                            </p>
                          )
                          
                          }
                        </div>

                        <div className="">
                          <button
                            className={`rounded-full ${
                              strongPasswordRegex.test(
                                userRegistraion.password
                              ) && userRegistraion.name
                                ? "bg-lime hover:bg-[#409944]"
                                : "bg-graycol"
                            } xs:rounded-lg xs:text-xs text-white  xs:h-8 md:w-full xs:w-full md:h-10 md:text-base md:font-medium inline-block font-medium `}
                            onClick={handleSingUp}
                            disabled={
                              !(
                                strongPasswordRegex.test(
                                  userRegistraion.password
                                ) && userRegistraion.name
                              )
                            }
                          >
                            Sign Up
                          </button>
                        </div>
                        {/* <p className="" onClick={(e)=>navigate("/conditons")}>Terms and conditions</p> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};
