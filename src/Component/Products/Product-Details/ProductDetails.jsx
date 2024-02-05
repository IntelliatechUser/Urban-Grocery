import React, { useEffect, useState } from "react";
import {
  FaRegHeart,
  FaAlignLeft,
  FaArrowsAlt,
  FaHeart,
  FaDove,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Rating from "../../StarRating/Rating";
import axios from "axios";
import { API_TOKEN } from "../../Token/Token";
import { useApiStore } from "../../zustand/useApiStore";
import ProductBtn from "../../Button/ProductBtn";
import { useLoaderState } from "../../zustand/useLoaderState";
import { useCartStore } from "../../zustand/useCartStore";
import { useUserStore } from "../../zustand/useUserStore";
import CartQuantity from "../../Button/CartQuantity";
import { Rating as MUIRating } from "@mui/material/";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import { useFavStore } from "../../zustand/useFavStore";
import { SimilarProduct } from "../../Similar-Products/SimilarProduct";
import { useApiToken } from "../../zustand/useApiToken";
import axiosInstance from "../../../api/axiosInstance";

export const ProductDetails = ({}) => {
  const [productPageData, setProductPage] = useState([]);
  const [wishlist, setWishlist] = useState(false);
  const [reviewList, setReviewList] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [reviewIndex, setReviewIndex] = useState("");
  const { id } = useParams();
  const { setisLoading } = useLoaderState();
  const { allCartItems, setAllCartItems, variant, setVariant } = useCartStore();
  const { userInfo } = useUserStore();
  const [value, setValue] = React.useState(0);
  const [isValidImg, setisValidImg] = useState(false);
  const [review, setReview] = useState("");
  const { allFavItems, setAllFavItems } = useFavStore();

  const {
    userInfo: { user_id },
  } = useUserStore();

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  let imageModalRef = useRef(null);
  const { apiToken } = useApiToken();

  const handleImageClick = (image, index) => {
    if (image) {
      setReviewIndex(index);
      setSelectedImage(image);
      setShowImageModal((prev) => !prev);
    }
  };

  const deleteHandler = (image) => {
    setImages(images.filter((e) => e !== image));
    URL.revokeObjectURL(image);
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
        });
        setAllCartItems(newArr);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        setisLoading(false);
      });
  };
  const addItemUI = (mainItem) => {
    let newArr = [];
    if (mainItem.variants.length > 1) {
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

  const handleClickOutside = (event) => {
    if (
      imageModalRef.current &&
      !imageModalRef.current.contains(event.target)
    ) {
      setShowImageModal(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addReview = () => {
    if (user_id) {
      let config = {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      };

      if (value >= 1 && review) {
        var bodyFormData = new FormData();
        bodyFormData.append("accesskey", "90336");
        bodyFormData.append("add_products_review", "1");
        bodyFormData.append("product_id", id);
        bodyFormData.append("user_id", userInfo.user_id);
        bodyFormData.append("rate", value);
        bodyFormData.append("review", review);

        images.forEach((image, index) => {
          bodyFormData.append(`images[]`, image);
        });

        setisLoading(true);

        axiosInstance
          .post(
            "https://grocery.intelliatech.in/api-firebase/get-all-products.php",
            bodyFormData,
            config
          )
          .then((res) => {
            setisLoading(false);
            setReviewOpen(false);
            productReviews();
            res.data.error
              ? toast.error(`${res.data.message}`, {
                  position: toast.POSITION.TOP_RIGHT,
                })
              : toast.success("Review Added Successfully  !", {
                  position: toast.POSITION.TOP_RIGHT,
                });
            setReview("");
            setValue(0);
          })
          .catch((error) => {
            console.log(error);
            setisLoading(false);
          });
      } else {
        toast.error("Please Enter All Details !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setImages("");
    }
  };

  const productReviews = () => {
    if (user_id) {
      console.log("user added review ", user_id);

      let config = {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      };

      var bodyFormData = new FormData();
      bodyFormData.append("accesskey", "90336");
      bodyFormData.append("get_product_reviews", "1");
      bodyFormData.append("product_id", id);
      setisLoading(true);

      axiosInstance
        .post(
          "https://grocery.intelliatech.in/api-firebase/get-all-products.php",
          bodyFormData,
          config
        )
        .then((res) => {
          setReviewList(res.data.product_review);
          setisLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setisLoading(false);
        });
    }
  };

  const imagesHandler = (event) => {
    let newImages = event.target.files;
    setImages([...images, ...newImages]);
  };

  const inputHandler = (event) => {
    setReview(event.target.value);
  };

  const productDetail = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("accesskey", "90336");
    bodyFormData.append("product_id", id);
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/get-product-by-id.php",
        bodyFormData,
        config
      )
      .then((res) => {
        setProductPage(res?.data?.data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  // useEffect(() => {
  //   productDetail();
  //   productReviews();
  // }, [id]);

  useEffect(() => {
    if (apiToken) {
      productDetail();
      productReviews();
    }
  }, [apiToken, id]);

  const filterData = productPageData?.filter((data) => {
    return data.id === id;
  });

  const handleRemoveFavorite = (item) => {
    let config = {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };

    let favData = new FormData();
    favData.append("accesskey", "90336");
    favData.append("remove_from_favorites", "1");
    favData.append("user_id", user_id);
    favData.append("product_id", item.id);
    setisLoading(true);

    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/favorites.php`,

        favData,
        config
      )
      .then((res) => {
        setisLoading(false);
        setWishlist((prev) => !prev);

        let newArr = allFavItems.filter((fav) => {
          return fav.id !== item.id;
        });
        setAllFavItems(newArr);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  const handleAddFavorite = (item) => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    let favData = new FormData();
    favData.append("accesskey", "90336");
    favData.append("add_to_favorites", "1");
    favData.append("user_id", user_id);
    favData.append("product_id", item.id);
    setisLoading(true);

    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/favorites.php`,

        favData,
        config
      )
      .then((res) => {
        setisLoading(false);
        setWishlist((prev) => !prev);

        let newArr = [...allFavItems, item];
        setAllFavItems(newArr);
      })
      .catch((err) => {
        setisLoading(false);

        console.log(err);
      });
  };

  return (
    <>
      <div className="2xs:mt-10 xs:mt-10 md:min-w-[45%] md:p-20 xs:p-8 mb-40 min-h-[70vh]">
        {filterData &&
          filterData.map((item) => {
            return (
              <>
                <div className="md:flex ">
                  <div className="img md:ml-20 sm:mx-14 xs:ml-1">
                    <Carousel
                      showIndicators={false}
                      className="rounded-xl md:w-[400px] xs:w-80 sm:w-[600px] "
                    >
                      <div className="transition-all hover:scale-105 rounded-xl ">
                        <img src={item.image} alt="" className="rounded-xl " />
                      </div>
                      <div className=" ">
                        <img
                          src={item.other_images}
                          alt=""
                          className="rounded-xl"
                        />
                      </div>
                    </Carousel>
                  </div>

                  <div className="xs:flex-col md:ml-[750px] md:p-6 md:fixed top-20 xs:bg-[#f7f7f7] xs:p-2 sm:px-3 md:bg-[#f7f7f7] md:rounded-xl">
                    <div className="2xs:flex 2xs:mt-4 xs:flex xs:mt-4 sm:mt-8 md:flex md:gap-4 sm:gap-7 xs:gap-6 2xs:gap-3">
                      <div className="2xs:flex xs:flex 2xs:gap-1 xs:gap-1  md:flex md:gap-1 ">
                        {user_id !== 14 &&
                        allFavItems?.find((fav) => {
                          return fav.id === item.id;
                        }) ? (
                          <FaHeart
                            className="2xs:text-xs xs:text-sm sm:text-3xl  md:text-lg  text-red animate-hbeat cursor-pointer"
                            onClick={(e) => {
                              setWishlist(true);
                              e.stopPropagation();
                              handleRemoveFavorite(item);
                            }}
                          />
                        ) : (
                          <FaRegHeart
                            className="2xs:text-xs xs:text-sm sm:text-3xl  md:text-lg  text-lime cursor-pointer"
                            onClick={(e) => {
                              setWishlist(true);
                              e.stopPropagation();
                              handleAddFavorite(item);
                            }}
                          />
                        )}
                        <p className="2xs:text-xs xs:text-sm sm:text-3xl md:text-sm ">
                          Add to favourites
                        </p>
                      </div>
                    </div>

                    <div className="data 2xs:mt-3 xs:mb-3 ">
                      <p className="  2xs:text-xl 2xs:font-semibold xs:mt-2 mr-50 xs:text-2xl xs:font-semibold sm:mt-4 sm:text-4xl md:mt-3 md:text-3xl  md:font-medium ">
                        {item.name}
                      </p>

                      {item &&
                        item.variants.map((variant) => {
                          return (
                            <>
                              <div className="xs:text-sm xs:text-left sm:mt-2  md:text-left  ">
                                <p className="text-lime text-lg font-bold sm:text-3xl md:text-lg">
                                  You save ₹
                                  {variant.price - variant.discounted_price}
                                  .00
                                </p>
                                <p className="2xs:text-base  sm:text-2xl md:text-base text-black font-medium md:mt-1 sm:mt-2">
                                  ₹{variant.discounted_price}.00{" "}
                                  <span className="text-xs sm:text-xl md:text-sm text-black line-through">
                                    ₹{variant.price}.00{" "}
                                  </span>
                                </p>
                                <p className="2xs:text-base  sm:text-2xl md:text-sm  mt-1 font-light">
                                  {variant.measurement}{" "}
                                  {variant.measurement_unit_name}
                                </p>
                                <div className="flex flex-row gap-4 mt-2 sm:mt-5 ">
                                  <div className="box-border h-16 md:w-40 xs:w-44 px-4 xs:px-2 border-2 bg-white border-light_gray rounded-lg text-center text-lime">
                                    <img
                                      src="https://media.istockphoto.com/id/1426338781/vector/return-parcel-box-line-icon-exchange-package-of-delivery-service-linear-pictogram-arrow-back.jpg?b=1&s=170x170&k=20&c=wJ3CCtEVjfm-5h8m-auMfNdIbRB2ouYfe8CX9eAExVs="
                                      alt=""
                                      className="w-9 h-9 ml-auto mr-auto"
                                    />
                                    {item.return_status === "1" ? (
                                      <p>10 Days Returnable</p>
                                    ) : (
                                      <p>Not Returnable</p>
                                    )}
                                  </div>
                                  <div className="box-border h-16 w-40 md:px-2 xs:px-2 border-2 bg-white border-light_gray rounded-lg text-center text-lime">
                                    <img
                                      src="https://static.thenounproject.com/png/3679002-200.png"
                                      alt=""
                                      className="w-9 h-9 ml-auto mr-auto "
                                    />
                                    Not Cancellable
                                  </div>
                                </div>

                                <div>
                                  {item.variants.some(
                                    (variant) => variant.stock > 0
                                  ) ? (
                                    allCartItems.find(
                                      (i) => i.product_id === item.id
                                    ) ? (
                                      <>
                                        <div className="bg-lime 2xs:px-2 2xs:mt-2 2xs:rounded xs:mt-3 xs:w-24 xs:rounded-lg xs:py-1 md:mt-3 md:w-[118px] sm:w-[130px] sm:mt-5 md:text-2xl text-white md:font-bold md:py-2 sm:text-lg md:px-4 md:rounded-lg md:hover:opacity-90">
                                          <CartQuantity
                                            item={item}
                                            variant={variant}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <button
                                        className="bg-lime 2xs:px-2 2xs:mt-2 2xs:rounded xs:mt-3 xs:w-24 xs:rounded-lg xs:py-1 md:mt-3 md:w-[118px] sm:w-[130px] sm:mt-5  text-white md:font-bold md:py-3 sm:text-lg md:text-sm md:px-4 md:rounded-lg md:hover:opacity-90"
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
                                    <p className="text-orange md:text-[11px]  mt-4 pb-4 sm:mb-4 s  xs:text-xs text-sm md:text-lg font-medium sm:text-2xl">
                                      Out of stock
                                    </p>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="text-left md:ml-20 xs:ml-1 mb-3 md:max-w-[35vw] mx-auto ">
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>

                  <div className="mt-4">
                    <div className="">
                      <SimilarProduct id={id} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <h1 className="font-bold text-2xl">RATINGS AND REVIEWS</h1>
                    <div className="flex items-center   gap-1 border-b border-[#e8e8e8e8]">
                      <p className="font-bold  text-[40px]">{item.ratings}</p>

                      <div className="flex justify-between items-center w-full">
                        <MUIRating
                          name="half-rating-read"
                          defaultValue={+item.ratings}
                          precision={0.1}
                          readOnly
                        />
                        <a
                          className="px-[15px] py-[9px]  rounded-[20px] text-black font-bold bg-yellowAwaiting inline-block"
                          href=""
                          onClick={(event) => {
                            event.preventDefault();
                            setReviewOpen(true);
                          }}
                        >
                          Add review
                        </a>
                      </div>
                    </div>
                    <div className="">
                      <h2 className="font-bold text-[20px] mb-4">
                        {`Customer reviews ${
                          reviewList?.length
                            ? "(" + reviewList?.length + ")"
                            : ""
                        }`}
                      </h2>
                      {reviewList?.length > 0 ? (
                        reviewList.map((review, mainindex) => {
                          return (
                            <div className="border-b px-3 border-[#e8e8e8e8] mb-3">
                              <div className="flex items-center gap-3">
                                {isValidImg ? (
                                  <FaUserCircle className="text-2xl " />
                                ) : (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={review.user_profile}
                                    alt=""
                                  />
                                )}
                                <div className="text-md mt-2 font-semibold  text-[gray]">
                                  {review.username}
                                </div>
                              </div>
                              <MUIRating
                                name="half-rating-read"
                                defaultValue={+review.rate}
                                precision={0.1}
                                readOnly
                              />

                              <div>
                                <div className="xs:grid xs:grid-cols-3 md:grid-cols-6 relative sm:grid-cols-6 gap-2">
                                  <CrousalImages
                                    review={review}
                                    handleImageClick={handleImageClick}
                                    mainindex={mainindex}
                                  />
                                  {/* {review.images.length > 0 &&
                                    review.images.map((image, index) =>
                                      index < 3 ? (
                                        <div
                                          onClick={() =>
                                            handleImageClick(image, mainindex)
                                          }
                                          className={`${
                                            review.images.length > 2
                                              ? 'last:before:content-["+3"]  cursor-pointer before:w-24 before:h-24 last:opacity-60  last:before:absolute'
                                              : ""
                                          } 
 text-3xl text-[#f5f5f5]`}
                                        >
                                          <img
                                            key={index}
                                            src={image}
                                            className="w-24 h-24 rounded-lg object-cover"
                                          />
                                        </div>
                                      ) : null
                                    )} */}

                                  {/* <div className="md:w-100vw absolute z-20 ">
                                    { (
                                      <Carousel>
                                        {review.images.length > 0 &&
                                          review.images.map((image, index) => (
                                            <div
                                              key={index}
                                              onClick={() =>
                                                handleImageClick(
                                                  image,
                                                  mainindex
                                                )
                                              }
                                              className={` ${
                                                review.images.length > 2
                                                  ? "cursor-pointer"
                                                  : ""
                                              }`}
                                            >
                                              <img
                                                src={image}
                                                alt={`Image ${index}`}
                                                className="w-24 h-24 rounded-lg object-cover"
                                              />
                                            </div>
                                          ))}
                                      </Carousel>
                                    )}
                                  </div> */}
                                </div>

                                {/* {showImageModal &&
                                  reviewIndex === mainindex && (
                                    <div className="fixed z-50 top-0 left-0  w-full h-full flex justify-center items-center bg-black bg-opacity-75 ">
                                      <div
                                        className="bg-white p-3 sm:h-[auto] rounded-lg flex items-center justify-evenly gap-1 relative h-auto mt-3"
                                        ref={imageModalRef}
                                      >
                                        <button onClick={()=>setShowImageModal(false)}>
                                          <AiOutlineCloseCircle className="cursor-pointer absolute bg-[#fff] bg-opacity-90  hover:opacity-100 opacity-50 rounded-full top-[-1px] text-red text-[24px] right-0"/>
                                        </button>
                                        <>
                                          {review.images.map((image, index) => (
                                            <img
                                              key={index}
                                              src={image}
                                              className={`w-24 h-24 rounded-lg object-cover ${
                                                image === selectedImage
                                                  ? "border-2 border-border_gray"
                                                  : ""
                                              }`}
                                            />
                                          ))}
                                        </>
                                      </div>
                                    </div>
                                  )} */}
                              </div>
                              <p className="mt-3">{review.review}</p>
                            </div>
                          );
                        })
                      ) : (
                        <p>No Customer Reviews</p>
                      )}
                    </div>
                  </div>
                  {item.manufacturer && (
                    <>
                      <p className="font-medium 2xs:mt-2 xs:mt-2 xs:text-lg sm:text-3xl md:text-base md:mt-3 sm:mt-5">
                        Manufacturer
                      </p>
                      <p className="2xs:text-sm xs:text-sm sm:mt-1 sm:text-2xl md:text-xs md:mt-0 font-light text-secondary">
                        {item.manufacturer}
                      </p>
                    </>
                  )}
                  {item.made_in && (
                    <>
                      <p className="font-medium 2xs:mt-2 xs:mt-2 xs:text-lg border-b border-[#e8e8e8e8] sm:text-3xl md:text-sm sm:mt-4 ">
                        Made In
                      </p>
                      <p className="2xs:text-sm 2xs:mb-2 xs:text-sm sm:mt-1 sm:text-2xl md:text-xs md:mt-0 font-light text-secondary">
                        {item.made_in}
                      </p>
                    </>
                  )}
                </div>
              </>
            );
          })}
      </div>

      {reviewOpen && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
          <div className="bg-white rounded top-[5%] left-[5%]">
            <div className="flex justify-center items-center relative">
              <div className="container relative  ">
                <button
                  className="absolute top-[5%] right-[5%]"
                  onClick={() => {
                    setReviewOpen(false);
                  }}
                >
                  <AiOutlineCloseCircle className="text-red text-2xl hover:opacity-50" />
                </button>
                <div className="w-full p-8 md:px-12 mr-auto rounded-2xl shadow-2xl">
                  <div className="flex justify-between">
                    <h1 className="font-bold  text-3xl">Write a review :</h1>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addReview();
                    }}
                  >
                    <div className="gap-5 mt-5">
                      <div className="border border-[#e8e8e8] p-3 rounded-lg">
                        <p className="  text-[gray] font-bold text-lg">
                          Rate your product:{" "}
                        </p>
                        <div className="flex mt-1 items-center">
                          <MUIRating
                            name="simple-controlled"
                            size="large"
                            value={value}
                            onChange={(event, newValue) => {
                              if (newValue === null) {
                                setValue(0);
                                return;
                              }
                              setValue(newValue);
                            }}
                          />

                          <div className="text-xl">({value})</div>
                        </div>
                      </div>

                      <label
                        className=" text-[gray] font-bold text-lg pl-3 inline-block mt-5"
                        htmlFor="images"
                      >
                        Add product images
                      </label>

                      <div className="flex gap-4 mt-4">
                        <label className="custom-file-upload border w-14 h-20 border-border_gray p-4 rounded-lg flex items-center justify-center hover:bg-light_green cursor-pointer">
                          <p className="text-3xl">+</p>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => imagesHandler(e)}
                            className="hidden"
                          />
                        </label>

                        <div>
                          <div className="images flex flex-wrap gap-3">
                            {images &&
                              images.map((image, index) => (
                                <div key={index} className="image relative ">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Image ${index}`}
                                    className="w-20 h-20 object-cover rounded-md "
                                  />
                                  <div className="bg-[#f2f2f2]">
                                    <AiOutlineCloseCircle
                                      className="cursor-pointer absolute bg-[#fff] bg-opacity-90  hover:opacity-100 opacity-50 rounded-full top-[-4px] text-red text-[28px] right-0"
                                      onClick={() => deleteHandler(image)}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      <label
                        className=" text-[gray] font-bold pl-3 text-lg inline-block mt-5"
                        htmlFor="text"
                      >
                        Add your Review
                      </label>
                      <textarea
                        className="w-full border border-[#e8e8e8] bg-gray-100 text-gray-900 mt-1 p-3 rounded-lg  focus:border-[black] "
                        type="text"
                        onChange={inputHandler}
                        name="review"
                        id="text"
                        value={review.text}
                        placeholder="Write your review"
                      />
                    </div>

                    <div className="mb-8 mt-6 flex items-center justify-between">
                      <button
                        className="inline-block  bg-lime px-7 pb-2.5 pt-3 text-sm rounded-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out "
                        data-te-ripple-init
                        data-te-ripple-color="light"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function CrousalImages({ review, handleImageClick, mainindex }) {
  const [openUserImages, setOpenUserImages] = useState(false);
let modalCrousal= useRef();
  const reviewImages = () => {
    return (
      <>
        {review.images.length > 0 &&
          review.images.map(
            (image, index) =>
              index < 3 && (
                <div
                  onClick={() => {
                    handleImageClick(image, mainindex);
                    setOpenUserImages(true);
                  }}
                  className={`${
                    review.images.length > 5
                      ? '  last:before:content-["+3"]  cursor-pointer before:w-24 before:h-24 last:opacity-60  last:before:absolute'
                      : ""
                  } text-3xl text-[#f5f5f5]`}
                >
                  <img
                    key={index}
                    src={image}
                    className="w-24 h-24 rounded-lg object-cover"
                    alt={`Image ${index}`}
                  />
                </div>
              )
          )}
      </>
    );
  };
  const handleClickLoginOutside = (event) => {
  
    if (
      event.target.classList.contains("carousel-container")   ) {
      setOpenUserImages(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickLoginOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickLoginOutside);
    };
  }, []);
  return (
    <>
      {reviewImages()}
      {openUserImages && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-75 w-[100vw] h-[100vh]  carousel-container" >
          
          <div className="relative  w-[100vw] h-[100vh] md:w-[40vw] md:h-[40vh] sm:top-[30%] sm:left-[50%] sm:transform sm:translate-x-[-50%] sm:translate-y-[-50%]      ">
          <button className="absolute top-2 right-2"
                  onClick={() => {
                    setOpenUserImages(false);
                  }}
                >




<span className=" text-black h-10 w-9 text-2xl block bg-gray-400 py-0 rounded-full bg-white">
                      <AiOutlineCloseCircle


className="z-[100] w-6 h-6 cursor-pointer absolute sm:w-6 sm:h-6 bg-[#fff]  hover:opacity-100 opacity-80 rounded-full top-[10px] text-[24px] right-0 z-500 sm:z-51 text-red  hover:opacity-100 text-2xl mt-3"
                        // className="text-red text-2xl hover:opacity-50 mt-3"
                      
                      /></span>
                 {/* <AiOutlineCloseCircle className="z-[100] w-10 h-10 cursor-pointer absolute sm:w-10 sm:h-10 bg-[#fff] bg-opacity-90  hover:opacity-100 opacity-50 rounded-full top-[10px] text-[24px] right-0 z-500 hover:bg-lime sm:z-51" /> */}
                </button>
            <Carousel
              showThumbs={false}
              onClose={() => {
                setOpenUserImages(false);
              }}
              
            >
              {review.images.length > 0 &&
                review.images.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                    
                      handleImageClick(image, mainindex);
                    }}
                    className={`   ${
                      review.images.length > 2 ? "cursor-pointer" : ""
                    }`}
                  >
                    <img src={image} alt={`Image ${index}`} className=" " />
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}

export default CrousalImages;
