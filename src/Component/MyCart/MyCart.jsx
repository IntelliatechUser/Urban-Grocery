import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaShoppingCart, FaTrash } from "react-icons/fa";
import Form from "./Form/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QtyAmount } from "../Button/QtyAmount";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Login } from "../Login.jsx/Login";
import { useCartStore } from "../zustand/useCartStore";
import { useUserStore } from "../zustand/useUserStore";
import { useLoaderState } from "../zustand/useLoaderState";
import { BsChevronCompactRight } from "react-icons/bs";
import Review from "./Review/Review";
import { currencyFormatter } from "../../utils/utils";
import { usePaymentStore } from "../zustand/usePaymentStore";
import { useApiStore } from "../zustand/useApiStore";
import { useMediaQuery } from "react-responsive";
import { useApiToken } from "../zustand/useApiToken";
import { SignUpwithOtp } from "../Login.jsx/SignUpwithOtp";
import axiosInstance from "../../api/axiosInstance";

function MyCart({
  // allCartItems,
  setAddItem,
  formData,
  setFormdata,
  setNavbarOpen,
  dispatchLogin,
  setLoggedIn,
  // user_id,
  setUser_id,
  loggedIn,
  setOpenLogin,
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [setAmount] = useState();
  // const [price, setPrice] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [Payment, setPayment] = useState(false);
  const [reviewPage, setReviewPage] = useState(false);
  const [newUserLog, setNewUserLog] = useState(false);
  const [newUserSignUpLog, setNewUserSignUpLog] = useState(false);
  // const [totalItem, setTotalItem] = useState(0);
  

  const { allCartItems, setAllCartItems, setCartTotal ,clearCartApi,setTotalItem,setPrice,price,totalItem} = useCartStore();
  const {
    userInfo: { user_id },
    resetState,
  } = useUserStore();
  const { setisLoading } = useLoaderState();
  const { jwt, setJwt } = useApiStore();
  const { apiToken } = useApiToken();
  const { setTotalPrice, setTotalMRPPrice, setTotalItems } = usePaymentStore();

  const [deleteProduct, setDeleteProduct] = useState(false);
  let mycartRef = useRef(null);

  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 767px)" });

  let menuRef = useRef();

  const accesskey = "90336";
  const showDeleteModalBox = () => {
    setDeleteProduct(true);
  };
  const handleDeleteModal = () => {
    setDeleteProduct(false);
  };

  const handleClickMycartOutside = (event) => {
    if (mycartRef.current && !mycartRef.current.contains(event.target)) {
      setDeleteProduct(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickMycartOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickMycartOutside);
    };
  }, []);

  const back = () => {
    if (showForm) {
      setShowForm(false);
    }
    if (Payment) {
      setPayment(false);
    }
    if (reviewPage) {
      setShowForm(true);
      setReviewPage(false);
    }
  };

  const unDiscountedTotel = () => {
    let total = 0;
    allCartItems.forEach((item) => {
      total += parseFloat(item.price) * item.amount;
    });
    setTotalMRPPrice(total);
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

  useEffect(() => {
    if (apiToken) total();
    totalAmount();
    unDiscountedTotel();
  }, [apiToken, allCartItems]);

  const removeItemHandler = (item) => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    var bodyFormdata = new FormData();
    bodyFormdata.append("accesskey", "90336");
    bodyFormdata.append("remove_from_cart", "1");
    bodyFormdata.append("user_id", user_id);
    bodyFormdata.append("product_variant_id", `${item.product_variant_id}`);
    setisLoading(true);
    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/cart.php",
        bodyFormdata,
        config
      )
      .then((res) => {
        let newArr = allCartItems.filter((data) => data.id !== item.id);
        setAllCartItems(newArr);
        let newPrice = price - item.amount * parseFloat(item.price);
        setPrice(newPrice);
        setCartTotal(newPrice);
        setDeleteProduct(false);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  const removeHandlerNotLoggedIn=(item)=>{
    let newArr = allCartItems.filter((data) => data.id !== item.id);
    setAllCartItems(newArr);
    let newPrice = price - item.amount * parseFloat(item.price);
    setPrice(newPrice);
    setCartTotal(newPrice);
    setDeleteProduct(false);
    
  }

  const hideMOdal = () => {
    setShowModal(false);
    setPayment(false);
    setShowForm(false);
    setReviewPage(false);
  };

  const formHandler = () => {
    setShowForm(true);
    setReviewPage(false);
    setPayment(true);
    setNewUserLog(false);
  };

  const handleCloseModal = () => {
    resetState();
    setPayment(false);
    setReviewPage(false);
  };

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current) {
        if (!menuRef.current.contains(e.target)) {
          setShowModal(false);
        }
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const getUserCarts = (user_id) => {
    
   
    let config = {
      headers: {
        // Authorization: `Bearer ${jwt}`,
        Authorization: `Bearer ${apiToken}`,
      },
    };

    var bodyFormdata = new FormData();
    bodyFormdata.append("accesskey", accesskey);
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

        
        setisLoading(false);
        total();
        totalAmount();
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (user_id) {
     
      getUserCarts(user_id);}
  }, [apiToken, accesskey]);
  
  return (
    <>
      <button
        className=" relative md:bg-lime sm:bg-lime xs:bg-skyblue  text-white items-center float-right flex gap-1
        font-bold md:px-2 rounded shadow  "
        type="button"
        onClick={() => {
          setShowModal(true);
         if(user_id){
          getUserCarts(user_id);}
        }}
      >
        <div
          className={" xs:p-2 md:relative md:bg-lime sm:bg-lime xs:bg-white"}
        >
          <div
            className={
              `${totalItem > 0 ? "block" : "hidden"}` +
              " " +
              " hidden md:block  absolute top-1 right-0 px-1 rounded-full  text-xs bg-red"
            }
          >
            {totalItem}
          </div>

          <FaShoppingCart className="xs:text-2xl md:bg-lime sm:bg-lime md:text-white sm:text-white xs:text-lime " />
        </div>
        <div className=" md:bg-lime sm:bg-lime xs:bg-white">
          {price > 0 && allCartItems ? (
            <>
              <div className=" block md:hidden absolute top-1 right-1 px-1 rounded-full bg-red text-xs">
                {totalItem}
              </div>
            </>
          ) : (
            <div className="  xs:hidden 2xs:hidden md:block sm:block bg-lime ">
              My Cart
            </div>
          )}
          {price > 0 && allCartItems ? (
            <div className=" md:bg-lime md:text-white hidden md:block text-sm float-left">
              ₹ {price}
            </div>
          ) : null}
        </div>
      </button>

      {showModal ? (
        <>
          <div
            className=" float-right absolute top-0 right-0 bg-white"
            ref={menuRef}
          >
            <div className="relative ">
              <div className=" h-[97vh] min-h-screen md:w-96 sm:w-screen xs:w-screen border-0 rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                <div className="bg-white flex items-start justify-between p-3 m-0 md:mt-[-7px] border-b border-light_gray shadow-sm">
                  <div className="mt-3 bg-white">
                    {showForm ? (
                      <button className=" back-button bg-white" onClick={back}>
                        <FaArrowLeft className="bg-white" />
                      </button>
                    ) : null}
                    {reviewPage ? (
                      <button className="back-button bg-white" onClick={back}>
                        <FaArrowLeft className="bg-white" />
                      </button>
                    ) : null}
                  </div>

                  <p className="py-2 text-2xl font-semibold bg-white">
                    My Cart
                  </p>
                  <button
                    className=" bg-transparent text-black float-right"
                    onClick={hideMOdal}
                  >
                    <span className=" text-black opacity-6 h-10 w-9 text-2xl block bg-gray-400 py-0 rounded-full bg-white">
                      <AiOutlineCloseCircle
                        className="text-red text-2xl hover:opacity-50 mt-3"
                        onClick={handleCloseModal}
                      />
                    </span>
                  </button>
                </div>

                <div
                  className=" bg-white overflow-y-scroll md:h-[700px] xs:h-[758px] sm:h[985px] 2xs:h-[500px]"
                  style={{
                    overflow: "scroll",
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {!showForm && allCartItems?.length && !reviewPage
                    ? allCartItems &&
                      allCartItems?.map((item, index) => {
                        return (
                          <>
                            <div
                              className={`mt-3 bg-white ${
                                index === allCartItems?.length - 1
                                  ? "mb-[80px]"
                                  : ""
                              }  2xs:p-3 border-b-[2px] border-[#e8e8e8]`}
                            >
                              <div className="flow-root">
                                <div
                                  role="list"
                                  className=" divide-y divide-gray-200 "
                                >
                                  <div className="flex p-2 bg-white items-center">
                                    <div className=" bg-white md:h-[80px] md:w-[72px]  xs:h-24 xs:w-24 sm:h-44 sm:w-44 sm:rounded-lg flex-shrink-0 overflow-hidden rounded-md ">
                                      <img
                                        src={item?.image}
                                        alt="product"
                                        className="h-full w-full object-cover object-center bg-white"
                                      />
                                    </div>

                                    <div className="bg-white ml-4 flex flex-1 flex-col truncate ...">
                                      <div className=" bg-white md:text-xs xs:text-sm sm:text-3xl ">
                                        <p className="bg-white float-left	text-lightgray truncate ...">
                                          {item.name}
                                        </p>
                                        <br />

                                        <div className="flex justify-between mt-0.5">
                                          <div className="w-[50%]">
                                            <p className="text-lightgray font-semi-bold md:text-[14px] sm:text-[24px] sm:text-darkgray">
                                              {item.serve_for}
                                            </p>

                                            <p className="2xs:text-base xs:text-sm  sm:text-xl md:text-xs text-gryColour  font-medium inline line-through bg-white sm:text-[21px]">
                                              ₹{item.price}.00{" "}
                                            </p>
                                            <span className="text-xs sm:text-xl xs:text-sm xs:ml-1 md:text-xs text-black  bg-white sm:text-[21px]">
                                              ₹{item.discounted_price}.00{" "}
                                            </span>

                                            <p className="bg-white text-gryColour text-[12px] md:text-[12px] font-bold sm:text-[21px]">
                                              {" "}
                                              {item?.measurement + " "}
                                              {item?.unit}
                                              {() => setAmount(item?.amount)}
                                            </p>
                                          </div>
                                          <div className="flex items-center justify-evenly xs:gap-4 md:justify-around sm:justify-between text-center w-[50%]">
                                            <div className="bg-white">
                                              <QtyAmount
                                                item={item}
                                                setAddItem={setAddItem}
                                                allCartItems={allCartItems}
                                              />
                                            </div>
                                            <div className="bg-white">
                                              <FaTrash
                                                onClick={() =>{
                                                  console.log("when user remove from cart",user_id);
                                                  if(user_id)
                                                  removeItemHandler(item)
                                                  else 
                                                  removeHandlerNotLoggedIn(item)}
                                                }
                                                className="bg-white hover:bg-RedColour hover:bg-opacity-20 cursor-pointer xs:text-[18px]  md:text-[15px] xs:text-sm sm:text-3xl text-red"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {user_id === "" ? (
                                  newUserLog ? (
                                    <Login
                                      setOpenLogin={setOpenLogin}
                                      user_id={user_id}
                                      newUserLog={newUserLog}
                                      setNewUserLog={setNewUserLog}
                                      getUserCarts={getUserCarts}
                                    />
                                  ) : (
                                    <>
                                      <button
                                        className="flex justify-between bg-lime p-3 mt-5 ml-[-11px]  border-3 text-white fixed bottom-0  md:w-96 2xs:w-[100%]   rounded-lg"
                                        onClick={() => {
                                          setNewUserLog(true);
                                        }}
                                      >
                                        <p className="p-2 bg-lime text-xl font-bold rounded-lg">
                                          Total : {currencyFormatter(price)}
                                        </p>
                                        <div className="flex items-center min-w-max justify-center">
                                          <p className="p-2 bg-lime text-xl  rounded-lg">
                                            Proceed
                                          </p>
                                          <BsChevronCompactRight className="te" />
                                        </div>
                                      </button>
                                    </>
                                  )
                                ) : (
                                  <button
                                    className="flex justify-between mt-5 md:w-96 bg-lime p-3 text-white fixed bottom-0 md:ml-[-11px] xs:ml-[-10px]  xs:w-[99%] sm:w-[99%] 2xs:w-[99%] rounded-lg"
                                    onClick={formHandler}
                                  >
                                    <p className="p-2 bg-lime text-xl font-bold rounded-lg">
                                      Total : {currencyFormatter(price)}
                                    </p>
                                    <div className="flex items-center justify-center min-w-max">
                                      <p className="p-2 bg-lime text-xl  rounded-lg">
                                        Proceed
                                      </p>
                                      <BsChevronCompactRight className="te" />
                                    </div>
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })
                    : null}

                  {!showForm && !allCartItems?.length ? (
                    <div className="relative p-6 flex-auto text-center font-medium bg-white">
                      <p className="bg-white text-lightgray text-md ">
                        Your cart is empty
                      </p>
                    </div>
                  ) : null}

                  {showForm ? (
                    <Form
                      back={back}
                      setFormdata={setFormdata}
                      formData={formData}
                      setShowModal={setShowModal}
                      setNavbarOpen={setNavbarOpen}
                      user_id={user_id}
                      setUser_id={setUser_id}
                      setReviewPage={setReviewPage}
                      setShowForm={setShowForm}
                    />
                  ) : null}

                  {reviewPage ? (
                    <Review
                      back={back}
                      setShowModal={setShowModal}
                      setReviewPage={setReviewPage}
                      setNavbarOpen={setNavbarOpen}
                      price={price}
                      totalItem={totalItem}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default MyCart;
