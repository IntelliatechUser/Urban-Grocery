import React, { useEffect } from "react";
import { currencyFormatter } from "../../utils/utils";
import axios from "../../api/axios";
import { useUserStore } from "../zustand/useUserStore";
import { useApiStore } from "../zustand/useApiStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../zustand/useCartStore";
import { useLoaderState } from "../zustand/useLoaderState";
import CartQuantity from "../Button/CartQuantity";
import Carousel from "react-multi-carousel";
import { useApiToken } from "../zustand/useApiToken";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

export const SimilarProduct = ({ id }) => {
  const [similarProduct, setSimilarProduct] = useState([]);
  const { allCartItems, setAllCartItems, variant, setVariant } = useCartStore();
  const {
    userInfo: { user_id },
  } = useUserStore();
  const navigate = useNavigate();
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },

      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const handleVariantChange = (id, e) => {

    let updatedvariant = { ...variant, [id]: e.target.value };

    setVariant(updatedvariant);
  };

 
  const addItemHandler = (item, data) => {
    const config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
   
    const bodyFormData = new FormData();
    bodyFormData.append("accesskey", "90336");
    bodyFormData.append("add_to_cart", "1");
    bodyFormData.append("user_id", user_id);
    bodyFormData.append("product_id", `${data.id}`);
    bodyFormData.append("product_variant_id", `${item.id}`);
    bodyFormData.append("qty", 1);
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/cart.php",
        bodyFormData,
        config
      )
      .then((res) => {
        if (allCartItems.some((cartItem) => cartItem.product_id === item.id)) {
          let newArr = allCartItems.map((data) =>
            data.product_id === item.id
              ? {
                  ...data,
                  amount: data.amount + 1,
                }
              : data
          );
          setAllCartItems(newArr);

          return;
        }

        let item1 = {
          amount: 1,
          discounted_price: item.discounted_price,
          id: item.id,
          price: item.price,
          product_id: item.product_id,
          product_variant_id: item.id,
          qty: 1,
          user_id: user_id,
        };

        let newArr = [...allCartItems, { ...item1, amount: 1 }];
        toast.success("Item added to user cart successfully !", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
        });
        setAllCartItems(newArr);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };
  const addItemUI = (mainItem) => {
    let newArr = [];
    if (mainItem?.variants?.length > 1) {
      newArr = [
        ...allCartItems,
        {
          ...mainItem.variants[variant[mainItem.id] || 0],
          amount: 1,
          name: mainItem.name,
          image: mainItem.variants[variant[mainItem.id] || 0].images[0],
          product_variant_id: mainItem.variants[variant[mainItem.id] || 0].id,
        },
      ];
    } else {
      toast.success("Item added to user cart successfully !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });

      newArr = [
        ...allCartItems,
        {
          ...mainItem.variants[variant[mainItem.id] || 0],

          amount: 1,
          name: mainItem.name,
          image: mainItem.image,
          product_variant_id: mainItem.variants[variant[mainItem.id] || 0].id,
        },
      ];
    }
    setAllCartItems(newArr);
  };
  const handleSimilarProduct = () => {
    let config = {
      headers: {
        // Authorization: `Bearer ${jwt}`,
        Authorization: `Bearer ${apiToken}`,
      },
    };

    let similarData = new FormData();
    similarData.append("accesskey", "90336");
    similarData.append("get_similar_products", "1");
    similarData.append("product_id", id);

    setisLoading(true);

    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/get-similar-products.php`,
        similarData,
        config
      )
      .then((res) => {
        setisLoading(false);
        setSimilarProduct(res?.data?.data);
      })
      .catch((err) => {
        setisLoading(false);
        console.log(err);
      });
  };

  // useEffect(() => {
  //   handleSimilarProduct();
  // }, []);

  useEffect(() => {
    if (apiToken) handleSimilarProduct();
  }, [apiToken]);
  return (
    <>
      <div>
        <p className="text-[22px]  font-semibold ">Similar products</p>

        <div className=" ">
          <Carousel responsive={responsive} className="z-0">
            {similarProduct &&
              similarProduct.map((item) => {
                return (
                  <>
                    <div
                      className="xs:w-32 md:w-32 xs:h-[200px] z-0  xs:my-3 md:h-[230px] sm:w-36 sm:h-[260px] rounded-xl md:mt-4 container border-2 border-light_gray hover:border-light_green bg-[#FFFAED] cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/subcategory-details/${item.category_name}/product-details/${item.id}`,
                          { replace: true }
                        );
                      }}
                    >
                      <img
                        // className="w-full h-56 xs:w-48 xs:h-28 object-cover object-center  md:h-24 md:ml-[23px] md:w-28 md:mt-4 sm:w-48 sm:h-32 rounded-lg "
                        className="xs:w-32 xs:h-24  md:w-32 md:h-24 object-cover object-center  sm:w-36 sm:h-32 rounded-lg "
                        src={
                          item?.variants?.length == 1
                            ? item.image
                            : item.variants[variant[item.id] || 0].images[0]
                        }
                        alt={item.name}
                      />
                      <div className=" pt-2 md:py-2 md:mx-4 xs:mx-2 sm:mx-4 ">
                        <p className="md:text-sm xs:text-sm sm:text-[20px]  font-medium   truncate ">
                          {item.name}
                        </p>
                      </div>
                      {item?.variants?.length == 1 &&
                        item.variants.map((data) => {
                          return (
                            <div className="flex p-1 md:px-3 flex-col xs:justify-center xs:items-center xs:text-center md:justify-evenly sm:ml-0   ">
                              <div className=" w-full">
                                <p className="2xs:text-base xs:text-sm t sm:text-xl  md:text-sm font-light  px-1 py-1 flex md:flex-row  justify-between items-center">
                                  <span className=" font-bold text-xs md:text-[11px]">
                                    {currencyFormatter(data.price)}{" "}
                                  </span>
                                  <div className="mt-[-2px]">
                                    <span className="text-gryColour text-xs md:text-[11px]">
                                      {data.measurement}{" "}
                                    </span>
                                    <span className="font-normal text-gryColour text-xs md:text-[11px] ">
                                      {data.measurement_unit_name}
                                    </span>
                                  </div>
                                </p>
                              </div>

                              <div className="w-full ">
                                {item.variants.some(
                                  (variant) => variant.stock > 0
                                ) ? (
                                  allCartItems?.find(
                                    (i) => i.product_id === item.id
                                  ) ? (
                                    <>
                                      <div
                                        className="mt-3"
                                        onClick={(e) => {
                                          console.log(
                                            e,
                                            "EVENT IN IMMEDIATE PARENT ELEMENT"
                                          );
                                        }}
                                      >
                                        <CartQuantity
                                          item={item}
                                          variant={variant}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <button
                                      className=" md:h-8 mt-2 md:mt-3 md:text-base !leading-none   sm:h-10 sm:text-xs  text-lime border border-lightgreen bg-transparent w-full hover:bg-opacity-75 font-medium bg-white rounded-lg uppercase px-3 py-1.5 "
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        user_id
                                          ? addItemHandler(data, item)
                                          : addItemUI(item);
                                      }}
                                    >
                                      Add
                                    </button>
                                  )
                                ) : (
                                  <p className="  text-orange md:text-[11px] text-sm font-medium md:mt-4 pb-4 sm:text-xs xs:text-[11px] sm:my-[25px] sm:text-[11px]  sm:break-normal">
                                    Out of stock
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {item?.variants?.length > 1 && (
                        <div className=" md:flex md:flex-col px-3 md:justify-evenly  sm:flex xs:flex xs:justify-between ">
                          <div
                            className=""
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              onChange={(e) => {
                                handleVariantChange(item.id, e);
                              }}
                              className="block w-full py-2 px-1 items-center border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs text-center font-bold"
                            >
                              {item.variants.map((variant, index) => (
                                <option
                                  key={variant.id}
                                  value={index}
                                  className=" my-2 items-center text-center text-xs font-bold"
                                >
                                  <span className="p-5">
                                    {currencyFormatter(variant.price)}{" "}
                                  </span>
                                  <span>{variant.measurement} </span>
                                  <p className="font-normal text-blue border">
                                    {variant.measurement_unit_name}
                                  </p>
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            {item.variants.some(
                              (variant) => variant.stock > 0
                            ) ? (
                              allCartItems?.find(
                                (i) =>
                                  (i.product_variant_id ?? i.id) ===
                                  item?.variants?.[variant?.[item?.id] || 0]?.id
                              ) ? (
                                <>
                                  <div className="mt-3">
                                    <CartQuantity
                                      item={item}
                                      variant={variant}
                                    />
                                  </div>
                                </>
                              ) : (
                                <button
                                  className=" md:h-8 mt-3 md:text-xs   sm:h-10 sm:text-base  text-lime border border-lightgreen bg-transparent w-full hover:bg-opacity-75 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    user_id
                                      ? addItemHandler(variant, item)
                                      : addItemUI(item);
                                  }}
                                >
                                  Add
                                </button>
                              )
                            ) : (
                              <p className="  text-orange md:text-[11px] text-sm font-medium mt-4 pb-4 sm:text-xs  xs:text-xs">
                                Out of stock
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })}
          </Carousel>
        </div>
      </div>
    </>
  );
};
