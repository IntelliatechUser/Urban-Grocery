import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_TOKEN } from "../../Token/Token";
import { useLoaderState } from "../../zustand/useLoaderState";
import { useCartStore } from "../../zustand/useCartStore";
import { useUserStore } from "../../zustand/useUserStore";
import CartQuantity from "../../Button/ProductBtn";

const Search = ({ setData, data, name, setName, setAddItem, addItem }) => {
  const [searchData, setSearchData] = useState([]);
  const [Inputsearch, setInputSearch] = useState("");
  const navigate = useNavigate();
  const { setisLoading } = useLoaderState();
  const { allCartItems, setAllCartItems } = useCartStore();
  const {
    userInfo: { user_id },
  } = useUserStore();

  const serchAPIData = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("accesskey", "90336");
    bodyFormData.append("type", "products-search");
    bodyFormData.append("limit", "100");
    bodyFormData.append("search", Inputsearch);

    setisLoading(true);
    axios
      .post(
        "https://grocery.intelliatech.in/api-firebase/products-search.php",
        bodyFormData,
        config
      )
      .then((res) => {
        // console.log(res.data.data)
        setSearchData(res.data.data);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    serchAPIData();
  }, []);

  const handleChange = (e) => {
    setInputSearch(e.target.value);
    navigate("/search");
    const filteredData = e.target.value.trim().toLowerCase();
    setName(filteredData);
    let result;
    if (filteredData.length > 0) {
      result = searchData.filter((item) => {
        return (
          item.name.toLowerCase().includes(filteredData.toLowerCase()) ||
          item.category_name.toLowerCase().includes(filteredData.toLowerCase())
        );
      });
    } else {
      result = searchData;
    }

    setData(result);
  };

  const allCartItemsHandler = (item, data) => {
    // console.log("item1>>>>>>>>>>>>>>", allCartItems);
    console.log("item", item);
    const config = {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };
    // console.log(data.id, "varaitn id");
    // console.log(item.id, "main id");
    const bodyFormData = new FormData();
    bodyFormData.append("accesskey", "90336");
    bodyFormData.append("add_to_cart", "1");
    bodyFormData.append("user_id", user_id);
    bodyFormData.append("product_id", `${data.id}`);
    bodyFormData.append("product_variant_id", `${item.id}`);

    // const qtys = (item.qty || 0) + 1;

    bodyFormData.append("qty", 1);

    // console.log("item", qtys);
    setisLoading(true);

    axios
      .post(
        "https://grocery.intelliatech.in/api-firebase/cart.php",
        bodyFormData,
        config
      )
      .then((res) => {
        setisLoading(false);
        console.log(res, "res add item");
        // setallCartItems(res)
        if (allCartItems.some((cartItem) => cartItem.product_id === item.id)) {
          // console.log("addtiem", allCartItems);
          let newArr = allCartItems.map((data) =>
            data.product_id === item.id
              ? {
                  ...data,
                  amount: data.amount + 1,
                }
              : data
          );
          console.log(newArr);
          setAllCartItems(newArr);

          return;
        }
        console.log(item.id, "allCartItems Id in product caraousel");

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
        console.log(newArr);
        // setAllCartItems((cart) => [...cart, { ...item1, amount: 1 }]);
        setAllCartItems(newArr);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setisLoading(false);
      });
  };

  return (
    <div className="w-full max-w-screen-2xl bg-white md:h-[69px] md:mr-44">
      <div className="inline-flex justify-center relative text-black-500 bg-white xs:my-4 xs:mx-4 sm:ml-36 md:my-3  xs:mt-20 ">
        <input
          type="text"
          className=" bg-white input xs:w-[330px] sm:h-16 xs:overflow-x-hidden xs:h-auto p-2 pl-10 md:text-sm  md:w-96 md:h-12 sm:w-[500px]  font-light rounded-2xl border border-light_gray focus:bg-white focus:outline-none focus:ring-1 focus:border-transparent sm:text-xl sm:pl-14"
          placeholder="Search by Product Name"
          onChange={handleChange}
          value={name}
        />

        <svg
          className="xs:w-6 sm:h-12 sm:w-10 xs:h-5 xs:text-white md:w-6 md:h-6 absolute xs:left-2 xs:top-2.5 md:left-2.5 md:top-3.5 bg-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#15803d"
        >
          <path
            stroke-line-cap="round"
            stroke-line-join="round"
            strokeWidth="1"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {searchData ? (
        searchData &&
        searchData.map((item) => {
          return (
            <>
              <div className="w-80 rounded-lg md:mt-[-285px] xs:mt-16 mx-5 container shadow-lg bg-lightblue md:hidden xs:visible  ">
                <NavLink
                  to={`/subcategory-details/${item.category_name}/product-details/${item.id}`}
                >
                  <img
                    className="w-full h-56 rounded-lg"
                    src={item.image}
                    alt={name}
                  />
                </NavLink>
                <div className="py-4">
                  <p className="text-xl font-normal">{item.name}</p>
                </div>
                {item &&
                  item.variants.map((data) => {
                    return (
                      <>
                        <div className="xs:text-sm xs:text-left sm:mt-2 md:mt-[-12px]">
                          <p className="2xs:text-base sm:text-xl md:text-sm text-lime font-semibold mt-1">
                            ₹{data.price}{" "}
                          </p>
                          <h1 className="2xs:text-base sm:text-xl md:text-sm mt-1 font-light">
                            {data.measurement} {data.measurement_unit_name}
                          </h1>
                          <h1 className="2xs:text-base sm:text-xl md:text-sm mt-1 font-light">
                            discount : ₹ {data.discounted_price}{" "}
                          </h1>
                        </div>

                        <div>
                          {item.variants.some(
                            (variant) => variant.stock > 0
                          ) ? (
                            allCartItems.find(
                              (i) => i.product_id === item.id
                            ) ? (
                              <>
                                <div className="md:mt-2 md:ml-6 xs:mt-2.5 sm:mt-4 ">
                                  {console.log(
                                    item,
                                    "Item",
                                    allCartItems,
                                    "allCartItems",
                                    "In ProductCarousel, calling CartQuantity"
                                  )}
                                  <CartQuantity
                                    item={item}
                                    // setallCartItems={setallCartItems}
                                    // allCartItems={allCartItems}
                                  />
                                </div>
                              </>
                            ) : (
                              <button
                                className="md:w-16 md:h-8 mb-3 xs:w-18 sm:ml-2 md:text-xs md:mt-2 xs:mt-2 sm:w-16 sm:h-10 sm:text-base sm:mt-[15px] text-lime border border-lightgreen bg-transparent hover:bg-opacity-75 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
                                onClick={() => allCartItemsHandler(data, item)}
                              >
                                Add
                              </button>
                            )
                          ) : (
                            <p className=" bg-white text-orange md:text-[11px] text-sm font-medium mt-4 pb-4 sm:mb-4 sm:text-xs xs:text-xs">
                              Out of stock
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })}
                {/* <button
                  className="my-2 mr-8 text-white bg-lime hover:bg-opacity-75 font-medium rounded-lg text-sm px-5 py-2.5"
                  onClick={() => addItemHandler(item)}
                >
                  Add
                </button> */}
              </div>
            </>
          );
        })
      ) : (
        <div className="items-center justify-center text-center w-full md:mt-20">
          <h1 className="text-lg">Sorry, no results found !</h1>
          <p>Please Check the spelling or try a different word</p>
        </div>
      )}
    </div>
  );
};

export default Search;
