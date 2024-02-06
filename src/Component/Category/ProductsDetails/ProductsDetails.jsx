import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CartQuantity from "../../Button/CartQuantity";
import axios from "axios";
import { useCartStore } from "../../zustand/useCartStore";
import { useUserStore } from "../../zustand/useUserStore";
import { useLoaderState } from "../../zustand/useLoaderState";
import { currencyFormatter } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useApiToken } from "../../zustand/useApiToken";
import axiosInstance from "../../../api/axiosInstance";

export const ProductsDetails = ({ setAddItem, addItem, setNavbarOpen }) => {
  const [allproducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { allCartItems, setAllCartItems, variant, setVariant } = useCartStore();
  const {
    userInfo: { user_id },
  } = useUserStore();
  const navigate = useNavigate();
  const { setisLoading } = useLoaderState();
  const { subcategory_id } = useParams();
  const { apiToken } = useApiToken();
  setNavbarOpen(true);

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
        // setisLoading(false);
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
          
        });
        setAllCartItems(newArr);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Network Error. Please Check Your Connection And Try Again.",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        setisLoading(false);
      });
  };

  const handleVariantChange = (id, e) => {
    let updatedvariant = { ...variant, [id]: e.target.value };

    setVariant(updatedvariant);
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
        autoClose:500,
       
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

  let config = {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };

  var bodyFormData = new FormData();
  bodyFormData.append("accesskey", "90336");
  bodyFormData.append("subcategory_id", subcategory_id);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .post(
          "https://grocery.intelliatech.in/api-firebase/get-products-by-subcategory-id.php",
          bodyFormData,
          config
        )
        .then((res) => {
          setAllProducts(res?.data?.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {}, [allproducts, subcategory_id]);

  //  useEffect(() => {
  //   if (apiToken);
  // }, [apiToken,allproducts, subcategory_id]);

  const allCartItemsHandler = (item, data) => {
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
        setisLoading(false);

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
          image: data.image,
          images: [
            "http://grocery.intelliatech.in/upload/variant_images/1676618514.4521-883.png",
          ],
          price: item.price,
          product_id: item.product_id,
          product_variant_id: item.id,
          qty: 1,
          save_for_later: "0",
          serve_for: "Available",
          slug: "butterscotch-flavorsome-cake",
          stock: "29",

          type: "packet",
          unit: "gm",
          user_id: user_id,
        };

        let newArr = [...allCartItems, { ...item1, amount: 1 }];
        setAllCartItems(newArr);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  return (
    <>
      <div className="min-h-[65vh]  ">
        {/* <div className=" mt-20 xs:grid xs:grid-cols-2 md:grid md:grid-cols-7 sm:grid-cols-3 flex flex-wrap md:ml-5 xs:ml-7 "> */}
        <div className=" mt-20  flex flex-wrap md:ml-5 xs:ml-14 gap-8 ">
          {isLoading ? (
            <p className="m-auto">Loading...</p>
          ) : allproducts && allproducts?.length > 0 ? (
            allproducts?.map((item) => {
              return (
                <div
                  className="w-30  xs:my-3 xs:w-32  xs:h-auto md:w-40 md:h-[235px] sm:h-[250px] sm:w-[170px] rounded-xl md:mt-4 container border-2 border-light_gray hover:border-light_green bg-[#ffffff] cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/subcategory-details/${item.category_name}/product-details/${item.id}`
                    );
                  }}
                >
                  <img
                    // className="w-full h-56 xs:w-48 xs:h-28 object-cover object-center  md:h-24 md:ml-[23px] md:w-28 md:mt-4 sm:w-48 sm:h-32 rounded-lg "
                    className="w-full h-56 xs:w-48 xs:h-28 object-cover object-center  md:h-28 md:w-40 sm:w-48 sm:h-32 rounded-lg "
                    src={
                      item?.variants?.length == 1
                        ? item.image
                        : item.variants[variant[item.id] || 0].images[0]
                    }
                    alt={item.name}
                  />
                  <div className=" pt-2 md:py-2 md:mx-4 xs:mx-2 sm:mx-4 ">
                    <p className="md:text-sm xs:text-sm sm:text-[20px]  font-medium   truncate  ">
                      {item.name}
                    </p>
                  </div>
                  {item?.variants?.length == 1 &&
                    item.variants.map((data) => {
                      return (
                        <div className="flex p-1 md:px-3 flex-col xs:justify-center xs:items-center xs:text-center md:justify-evenly sm:ml-0   ">
                          <div className="  w-full md:px-3 ">
                            <p className="2xs:text-base xs:text-sm t sm:text-xl  md:text-sm font-light  px-1 py-1 flex md:flex-row  justify-between items-center">
                              <span className=" font-bold text-xs">
                                {currencyFormatter(data.price)}{" "}
                              </span>
                              <div>
                                <span className="text-gryColour text-xs">
                                  {data.measurement}{" "}
                                </span>
                                <span className="font-normal text-gryColour text-xs  ">
                                  {data.measurement_unit_name}
                                </span>
                              </div>
                            </p>
                          </div>

                          <div className="w-full ">
                            {item?.variants.some(
                              (variant) => variant.stock > 0
                            ) ? (
                              allCartItems?.find(
                                (i) => i.product_id === item.id
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
                      <div className="" onClick={(e) => e.stopPropagation()}>
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
                        {item.variants.some((variant) => variant.stock > 0) ? (
                          allCartItems?.find(
                            (i) =>
                              (i.product_variant_id ?? i.id) ===
                              item?.variants?.[variant?.[item?.id] || 0]?.id
                          ) ? (
                            <>
                              <div className="mt-3">
                                <CartQuantity item={item} variant={variant} />
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
              );
            })
          ) : (
            <p className="m-auto">No result found.</p>
          )}
        </div>
      </div>
    </>
  );
};
