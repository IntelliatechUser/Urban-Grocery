import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_TOKEN } from "../Token/Token";
import { Aside } from "../Aside/Aside";
import { OrderDetails } from "../Order-Details/OrderDetails";
import { GiScooter } from "react-icons/gi";
import { BsChevronRight } from "react-icons/bs";
import { useLoaderState } from "../zustand/useLoaderState";
import { useUserStore } from "../zustand/useUserStore";
import { useOrderDetails } from "../zustand/useOrderDetails";
import { useNavigate } from "react-router-dom";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const MyOrder = ({ addItem, setNavbarOpen }) => {
  const [price, setPrice] = useState(0);
  // const [detailsOrder, setDetailsOrder] = useState(false);
  const {
    userInfo: { user_id },
  } = useUserStore();
  const navigate = useNavigate();
  const { orderId, setOrderId } = useOrderDetails();
  console.log(orderId, "orderId");

  const { allOrderDetails, setAllOrderDetails } = useOrderDetails();
  console.log(allOrderDetails, "allorderDetails");
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();
  setNavbarOpen(true);

  const handlemyOrder = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
    let myOrderData = new FormData();
    myOrderData.append("accesskey", "90336");
    myOrderData.append("get_orders", "1");
    myOrderData.append("user_id", user_id);
    setisLoading(true);
    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/order-process.php`,
        myOrderData,
        config
      )
      .then((res) => {
        
        setAllOrderDetails(res?.data);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) {
      handlemyOrder();
    }
  }, [apiToken]);

  const handleOrderDetails = (item) => {
    setOrderId(item);
    navigate("/ordersummarypage");
  };

  return (
    <>
      <div className="flex  mt-24 md:ml-10  xs:justify-center xs:items-start sm:justify-evenly sm:flex sm:items-start sm:flex-row ">
        <div className="xs:w-[85%] md:w-[30%] sm:w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>

        <div className="border-r border-r-light_gray hidden sm:block mt-[-40px]  w-4 h-[110vh]"></div>

        <div className="text-[.9rem]  md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] sm:text-lg ">
          <div className="md:w-full pl-6 pr-6 rounded-lg">
            <h1 className="font-bold">My Orders</h1>
            {allOrderDetails?.length > 0 ? (
             JSON.parse(allOrderDetails.slice(allOrderDetails.indexOf("{"))).data?.map((item) => {
                return (
                  <div
                    className="border p-3 mt-3 flex flex-wrap  justify-between items-center rounded hover:bg-[#f8f4f4] cursor-pointer overflow-y-auto max-h-[240px]  border-[#e6e3e3] py-3 bg-[#fcfff3] relative"
                    onClick={() => handleOrderDetails(item.id)}
                  >
                    <div className="w-[95%] ">
                      <div className="flex gap-8 justify-between text-end">
                        <div className="flex text-center">
                          <p className="font-bold text-lime">
                            Order ID : {item.id}
                          </p>

                          <p className=" ml-3 font-bold  text-lime">
                            Item Quantity : {item?.items?.length}
                          </p>
                        </div>

                        <div className="flex  mt-[-10px] ">
                          <div
                            className={`flex shadow-sm justify-center items-center  mb-4 m-2 p-1 rounded-lg w-32 text-[12px] ${
                              item.active_status === "received"
                                ? "bg-[#5779df] text-white"
                                : item.active_status === "delivered"
                                ? "bg-lime text-white"
                                : item.active_status === "return"
                                ? "bg-GreenColour text-white"
                                : item.active_status === "awaiting_payment"
                                ? "bg-yellowAwaiting text-black"
                                : item.active_status === "processed"
                                ? "bg-TWITTER_BLUE text-white"
                                : item.active_status === "shipped"
                                ? "bg-gmail_color text-black"
                                : item.active_status === "cancelled"
                                ? "bg-RedColour text-white"
                                : item.active_status === "ready_to_pickup"
                                ? "bg-green text-white"
                                : "bg-skybluelight text-text-black"
                            }`}
                          >
                            <p>{item.active_status.toLocaleUpperCase()}</p>
                          </div>
                          <div className="flex shadow-sm gap-2 mt-2 w-36 text-[12px] mb-4 border border-light_gray p-1 rounded-lg items-center">
                            <div className="text-[18px]">
                              <GiScooter />
                            </div>
                            <div className="flex justify-center align-center">
                              <p>Door Step Delivery</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-col  ">
                          {item.items &&
                            item.items.map((data) => (
                              <div
                                key={data.id}
                                className="flex items-center gap-4 mt-4"
                              >
                                <img
                                  src={data.image}
                                  alt=""
                                  className="w-20 h-16 rounded-lg"
                                />
                                <p className=" w-[350px]  font-semi-bold text-[#aaa4a4] truncate ..">
                                  {data.product_name}
                                </p>
                              </div>
                            ))}
                        </div>

                        <div className="  flex flex-col flex-wrap justify-around ">
                          {item.items &&
                            item.items.map((data) => (
                              <p key={data.id} className="font-bold text-lime">
                                ₹{data.price}
                              </p>
                            ))}
                        </div>
                        <div className=" cursor-pointer t-1000">
                      <BsChevronRight />
                    </div>
                      </div>
                     
                    </div>
                    
                  </div>
                );
              })
            ) : (
              <>
                <p className="text-lg font-bold ">No Orders Yet</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
