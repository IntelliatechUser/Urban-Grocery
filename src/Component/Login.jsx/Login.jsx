import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Signup } from "./Signup";
import axios from "axios";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { useCartStore } from "../zustand/useCartStore";
import { useUserStore } from "../zustand/useUserStore";
import { useLoaderState } from "../zustand/useLoaderState";
import { SignUpwithOtp } from "./SignUpwithOtp";
import { useRef } from "react";
import { useEffect } from "react";
import { useApiToken } from "../zustand/useApiToken";
import { Forgot } from "./Forgot";
import axiosInstance from "../../api/axiosInstance";
import { usePaymentStore } from "../zustand/usePaymentStore";

export const Login = ({
  setNewUserLog,
  setOpenLogin,
  setNewUserSignUpLog,
  getUserCarts,
  cartFuncs,
}) => {
  const [logins, setLogins] = useState({
    phone: "",
    password: "",
  });
  const { setTotalPrice, setTotalMRPPrice, setTotalItems } = usePaymentStore();
  const { allCartItems, setAllCartItems, setCartTotal,clearCartApi,setTotalItem,setPrice} = useCartStore();
  
  const { setUserInfo } = useUserStore();
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState(true);
  const [forgotForm, setForgotForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginData, setLoginData] = useState([]);
  const navigate = useNavigate();
  const { setisLoading } = useLoaderState();
  const [visiblePassword, setVisiblePassword] = useState(false);
  let loginRef = useRef(null);
  const { apiToken } = useApiToken();
  

  
  const handleShow = (e) => {
    e.preventDefault();
    setLoginForm(false);
    setShowSignUp(true);
  };
  const closeLoginModal = () => {
    if (setNewUserLog) {
      setNewUserLog(false);
    }
    if (setNewUserSignUpLog) {
      setNewUserSignUpLog(false);
    }
    if (setOpenLogin) {
      setOpenLogin(false);
    }

    navigate("/");
  };

  const handleClickLoginOutside = (event) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      setLoginForm(false);
      setShowRegisterForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickLoginOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickLoginOutside);
    };
  }, []);
  useEffect(() => {
    "CHANGING OTP SIGNUP ENABLER";
  }, [showSignUp]);
  useEffect(() => {
    "CHANGING Login Internal Modal";
  }, [loginForm]);

  const handleShowVisivblePassword = () => {
    setVisiblePassword((prev) => !prev);
  };

  const inputHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value.slice(3, e?.target?.value?.length);
    setLogins({ ...logins, [name]: value });
  };
  const passwordHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogins({ ...logins, [name]: value });
  };

  const clearCart = () => {
    clearCartApi();
  };

  const total = () => {
    let price = 0;
    allCartItems &&
      allCartItems.forEach((cartItem) => {
        if (cartItem.amount) {
          price += parseFloat(cartItem.discounted_price) * cartItem.amount;
        }
      });
    setPrice(price);
    setTotalPrice(price);
    setCartTotal(price);
  };

  const totalAmount = () => {
    let totalAmount = 0;
    allCartItems &&
      allCartItems.forEach((e) => {
        if (e.amount) {
          totalAmount += parseFloat(e.amount);
        }
      });
    setTotalItem(totalAmount);
    setTotalItems(totalAmount);
  };

  const getUserCartsEnter = (user_id) => {
    console.log("getUserCarts>>>>>>>",user_id)
    console.log("apiToken>>>>>>>",apiToken)
    let config = {
      headers: {
        // Authorization: `Bearer ${jwt}`,
        Authorization: `Bearer ${apiToken}`,
      },
    };

    var bodyFormdata = new FormData();
    bodyFormdata.append("accesskey", "90336");
    bodyFormdata.append("get_user_cart", "1");
    bodyFormdata.append("user_id", user_id);
    setisLoading(true);

    return axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/cart.php",
        bodyFormdata,
        config
      )
      .then((res) => {
        let addQtyAmount = res?.data?.data?.map((data) => ({
          ...data,
          amount: +data.qty,
        }));
        // setAddItem(addQtyAmount);

        {
          addQtyAmount && setAllCartItems(addQtyAmount);
        }
        console.log("setAllCartItems11111>>>>",addQtyAmount);
        setisLoading(false);
        total();
        totalAmount();
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!logins.phone && !logins.password) {
  //     toast.error("Please enter both phone and password!", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 500,
  //     });
  //   } else if (!logins.phone) {
  //     toast.error("Please enter a valid phone number!", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 500,
  //     });
  //   } else if (!logins.password) {
  //     toast.error("Please enter a password!", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 500,
  //     });
  //   } else {
  //     setisLoading(true);
  
  //     const loginItem = new FormData();
  //     loginItem.append("accesskey", "90336");
  //     loginItem.append("mobile", "+91" + logins.phone);
  //     loginItem.append("password", logins.password);
  //     loginItem.append("fcm_id", "YOUR_FCM_ID");
  
  //     let config = {
  //       headers: {
  //         Authorization: `Bearer ${apiToken}`,
  //       },
  //     };
  
  //     try {
  //       const res = await axiosInstance.post(
  //         "https://grocery.intelliatech.in/api-firebase/login.php",
  //         loginItem,
  //         config
  //       );
  
  //       setisLoading(false);
  
  //       if (!res.data.error) {

  //         console.log("User Logged info",res.data);
  //         setLoginData([...loginData, logins]);
  //         closeLoginModal();
  //         navigate("/");
  //         localStorage.setItem("token", `${apiToken}`);
  //         setUserInfo(res.data);
  //         let newUserId = res?.data?.user_id;
  
  //         toast.success("Logged in successfully!", {
  //           position: toast.POSITION.TOP_CENTER,
  //           autoClose: 500,
  //         });
  
  //         const addMultipleItems = async () => {
  //           let arr = {};
  //           allCartItems.forEach((item) => {
  //             arr[item.product_variant_id] = item.amount;
  //           });
  
  //           let variants = Object.keys(arr).join(",");
  //           let variantQty = Object.values(arr).join(",");
  
  //           if (variantQty.length > 0) {
  //             var bodyFormdata = new FormData();
  //             bodyFormdata.append("accesskey", "90336");
  //             bodyFormdata.append("add_multiple_items", "1");
  //             bodyFormdata.append("user_id", newUserId);
  //             bodyFormdata.append("product_variant_id", variants);
  //             bodyFormdata.append("qty", variantQty);
  //             setisLoading(true);
  
  //             try {
  //               const response = await axiosInstance.post(
  //                 "https://grocery.intelliatech.in/api-firebase/cart.php",
  //                 bodyFormdata,
  //                 config
  //               );
  
  //               setisLoading(false);
  //               getUserCarts(newUserId);
  
  //               if (cartFuncs) {
  //                 cartFuncs(newUserId);
  //               }
  //               console.log(cartFuncs, "cartt");
  //             } catch (error) {
  //               console.log(error);
  //               setisLoading(false);
  //             }
  //           }
  //         };
  
  //         await addMultipleItems();
  //         await getUserCartsEnter(newUserId);
  //       } else {
  //         toast.error("Invalid phone OR password!", {
  //           position: toast.POSITION.TOP_CENTER,
  //           autoClose: 500,
  //         });
  //       }
  //     } catch (err) {
  //       setisLoading(false);
  //     }
  //   }
  
  //   setLogins({
  //     phone: "",
  //     password: "",
  //   });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!logins.phone && !logins.password) {
      toast.error("Please enter both phone and password!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
    } else if (!logins.phone) {
      toast.error("Please enter a valid phone number!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
    } else if (!logins.password) {
      toast.error("Please enter a password!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
    } else {
      setisLoading(true);
  
      const loginItem = new FormData();
      loginItem.append("accesskey", "90336");
      loginItem.append("mobile", "+91" + logins.phone);
      loginItem.append("password", logins.password);
      loginItem.append("fcm_id", "YOUR_FCM_ID");
  
      let config = {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      };
  
      try {
        const res = await axiosInstance.post(
          "https://grocery.intelliatech.in/api-firebase/login.php",
          loginItem,
          config
        );
  
        setisLoading(false);
  
        if (!res.data.error) {

          console.log("User Logged info",res.data);
          setLoginData([...loginData, logins]);
          closeLoginModal();
          navigate("/");
          localStorage.setItem("token", `${apiToken}`);
          setUserInfo(res.data);
          let newUserId = res?.data?.user_id;
  
          toast.success("Logged in successfully!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
          });
  
          const addMultipleItems = async () => {
            let arr = {};
            allCartItems.forEach((item) => {
              arr[item.product_variant_id] = item.amount;
            });
  
            let variants = Object.keys(arr).join(",");
            let variantQty = Object.values(arr).join(",");
  
            if (variantQty.length > 0) {
              var bodyFormdata = new FormData();
              bodyFormdata.append("accesskey", "90336");
              bodyFormdata.append("add_multiple_items", "1");
              bodyFormdata.append("user_id", newUserId);
              bodyFormdata.append("product_variant_id", variants);
              bodyFormdata.append("qty", variantQty);
              setisLoading(true);
  
              try {
                const response = await axiosInstance.post(
                  "https://grocery.intelliatech.in/api-firebase/cart.php",
                  bodyFormdata,
                  config
                );
  
                setisLoading(false);
                getUserCarts(newUserId);
  
                if (cartFuncs) {
                  cartFuncs(newUserId);
                }
                console.log(cartFuncs, "cartt");
              } catch (error) {
                console.log(error);
                setisLoading(false);
              }
            }
          };
  
          await addMultipleItems();
          await getUserCartsEnter(newUserId);
        } else {
          toast.error("Invalid phone OR password!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
          });
        }
      } catch (err) {
        setisLoading(false);
      }
    }
  
    setLogins({
      phone: "",
      password: "",
    });
  };
  const openForgotPassword = (e) => {
    e.preventDefault();
    setForgotForm(true);
  };

  return (
    <>
      {loginForm && (
        <>
          <div className="fixed  z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div
              className="bg-[#f5f5f5] rounded top-[5%] left-[5%] md:w-[500px] xs:w-[340px] sm:w-[500px]"
              ref={loginRef}
            >
              <div className="flex justify-center items-center relative">
                <div className="container relative flex ">
                  <div className="mb-4 mt-32 w-[40%]">
                    <img
                      src="http://grocery.intelliatech.in/dist/img/logo.png"
                      className="w-40 mx-4 "
                      alt="Flowbite Logo"
                    />
                  </div>

                  <div className="w-full p-8 md:px-12 mr-auto rounded-2xl ">
                    <button
                      className="absolute top-[5%] right-[5%]"
                      onClick={closeLoginModal}
                    >
                      <AiOutlineCloseCircle className="text-red text-2xl hover:opacity-50" />
                    </button>
                    <div className="flex justify-between">
                      <h1 className="font-bold uppercase text-3xl">Login :</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div></div>
                      <div className="gap-5 mt-5">
                        <input
                          className="w-full border-red-800 text-gray-900 mt-2 p-3 rounded-lg focus:shadow-outline"
                          type="text"
                          onChange={inputHandler}
                          onKeyDown={(e) => {
                            if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                              e.preventDefault();
                            }
                          }}
                          maxLength={13}
                          name="phone"
                          value={`+91${logins?.phone}`}
                          placeholder="Phone"
                        />

                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-gray-100 border-gray-400 text-gray-900 mt-2 p-3 rounded-lg focus:shadow-outline"
                            type={visiblePassword ? "text" : "password"}
                            placeholder="Password"
                            onChange={passwordHandler}
                            value={logins?.password}
                            name="password"
                          />
                          <div
                            onClick={handleShowVisivblePassword}
                            className="absolute xs:ml-[250px] md:ml-[246px] sm:ml-[280px] mt-2 cursor-pointer"
                          >
                            {visiblePassword ? (
                              <AiFillEye />
                            ) : (
                              <AiFillEyeInvisible />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 mt-6 flex items-center justify-between">
                        <button
                          type="submit"
                          className="inline-block  bg-lime px-7 pb-2.5 pt-3 text-sm rounded-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out "
                          data-te-ripple-init
                          data-te-ripple-color="light"
                        >
                          Login
                        </button>

                        <p
                          className="cursor-pointer text-bluecolour text-[14px] hover:underline hover:underline-offset-3 transition-all duration-300"
                          onClick={openForgotPassword}
                        >
                          Forgot Password?
                        </p>
                      </div>

                      <div className="text-center lg:text-left">
                        <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                          Don't have an account?
                          <a
                            href=""
                            className="text-danger transition ml-2 text-[green] duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                            onClick={handleShow}
                          >
                            Sign up now
                          </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showRegisterForm && (
        <Signup
          setOpenLogin={setOpenLogin}
          setLoginForm={setLoginForm}
          setShowRegisterForm={setShowRegisterForm}
          phoneNumber={phoneNumber}
        />
      )}

      {showSignUp && (
        <SignUpwithOtp
          setNewUserLog={setNewUserLog}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          setShowRegisterForm={setShowRegisterForm}
          setPhoneNumber={setPhoneNumber}
          phoneNumber={phoneNumber}
          setShowSignUp={setShowSignUp}
          setOpenLogin={setOpenLogin}
        />
      )}
      {forgotForm && (
        <Forgot
          phoneNumber={phoneNumber}
          setForgotForm={setForgotForm}
          forgotForm={forgotForm}
          setPhoneNumber={setPhoneNumber}
          setLoginForm={setLoginForm}
          
        />
      )}
    </>
  );
};
