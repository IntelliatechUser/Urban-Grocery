import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useOrderDetails } from "../zustand/useOrderDetails";
import { currencyFormatter } from "../../utils/utils";
import moment from "moment/moment";
import { useUserStore } from "../zustand/useUserStore";
import { useState } from "react";
import { CancelOrder } from "./CancelOrder";
import { ReturnOrder } from "./ReturnOrder";

export const OrderDetailsPage = () => {
  const { orderId, setOrderId } = useOrderDetails();
  const { allOrderDetails } = useOrderDetails();
  const { addList } = useUserStore();

  const [cancelModal, setCancelModal] = useState(false);
  const [ReturnModal, setReturnModal] = useState(false);

  const navigate = useNavigate();
  const handleBackMyorder = () => {
    navigate("/myorder");
  };

  const handleCancleItem = () => {
    setCancelModal((prev) => !prev);
  };

  const handleReturnItem = () => {
    setReturnModal((prev) => !prev);
  };

  return (
    <>
      <div>
        {orderId &&
          JSON.parse(allOrderDetails.slice(allOrderDetails.indexOf("{"))).data?.map((item, index) => {
            if (item.id == orderId)
              return (
                <div className="flex my-28 justify-around" key={index}>
                  <div className="md:w-[40%] sm:w-[40%] xs:w-[80%]  shadow-xl p-3 bg-[#fcfff3]">
                    <div className="flex gap-8 font-bold text-center items-center ">
                      <p>
                        <FaArrowLeft
                          className="bg-white text-graycolor text-[20px] font-semibold cursor-pointer"
                          onClick={handleBackMyorder}
                        />
                      </p>
                      <p className="text-3xl text-blackColour ">
                        Order Details
                      </p>
                    </div>
                    <div>
                      <>
                        <div className="my-6">
                          <p className="text-black font-semibold">
                            Delivery Address
                          </p>
                          <p className="text-graycolor">{item.address}</p>
                        </div>
                        <div className="flex flex-col text-left justify-around text-black ">
                          <p className="text-black font-bold">OrderDetails</p>
                          <div className="flex justify-between py-2 border-b border-b-light_gray">
                            <p className="text-graycolor text-[16px]">Name</p>
                            <p>
                              {addList.find((address) => {
                                if (item.address.includes(address.address)) {
                                  return address?.name;
                                }
                                // return item.address.includes(address.address)
                              })?.name || item.user_name}
                            </p>
                          </div>
                          <div className="flex justify-between py-2 border-b border-b-light_gray">
                            <p className="text-graycolor text-[16px]">Mobile</p>
                            <p>{item.mobile}</p>
                          </div>
                          <div className="flex justify-between py-2 border-b border-b-light_gray">
                            <p className="text-graycolor text-[16px]">
                              Order-Date
                            </p>
                            <p>
                              {moment(
                                item.date_added,
                                "DD-MM-YYYY hh:mm:ssa"
                              ).format("DD-MM-YYYY, h:mm A")}
                            </p>
                           

                          </div>
                          <div className="flex justify-between py-2 border-b border-b-light_gray">
                            <p className="text-graycolor text-[16px]">Total</p>
                            {/* <p>₹{item.total}</p> */}
                            <p className="text-GreenColour">
                              {currencyFormatter(item.total)}
                            </p>
                          </div>

                          <div className="flex justify-between py-2 border-b border-b-light_gray">
                            <p className="text-graycolor text-[16px] ">
                              Delivery_Charge
                            </p>
                            {/* <p>{item.delivery_charge}</p> */}
                            <p className="text-GreenColour">
                              {currencyFormatter(item.delivery_charge)}
                            </p>
                          </div>
                          <div className="flex justify-between py-2 border-b border-b-lightGrays">
                            <p className="text-graycolor text-[16px]">
                              Payment Mode
                            </p>
                            <p>{item.payment_method}</p>
                          </div>
                          <div className="flex justify-between py-3 ">
                            <p className="text-GreenColour sm:text-lg md:text-[26px] font-bold">
                              Product Total
                            </p>
                            {/* <p>₹{item.final_total}</p> */}
                            <p className="text-GreenColour font-bold md:text-[26px]">
                              {currencyFormatter(item.final_total)}
                            </p>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>

                  <div className="w-[40%] xs:hidden md:block sm:block overflow-y-hidden relative">
                    <div>
                      <div className="overflow-y-scroll scrollbar-none max-h-[90vh]">
                        <p className="text-blackColour font-bold my-2">
                          Order Items ({item?.items?.length})
                        </p>
                        {item.items &&
                          item.items.map((data) => {
                            return (
                              <div
                                key={data.id}
                                className="flex bg-[#f5f5f5] rounded-md p-3 mb-4 border-b border-b-light_gray"
                              >
                                <div className="w-[100px] h-[80px] mr-4">
                                  <img
                                    src={data.image}
                                    alt=""
                                    className="w-full h-full rounded-2xl"
                                  />
                                </div>
                                <div className="flex-grow flex flex-col">
                                  <div className="mb-2 text-blackColour">
                                    {data.product_name}
                                  </div>
                                  <div className="font-bold text-customGreen">
                                    {currencyFormatter(data.discounted_price)}
                                  </div>
                                  <div className="text-lightgray">
                                    Qty: {data.quantity}
                                  </div>
                                </div>
                                <div className="flex flex-col text-[16px] ml-auto">
                                  <div className="text-lightgray">
                                    {data.variant_name}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div>
                        {item.active_status === "cancelled" ? (
                          <p className="text-red font-bold">
                            This order has been cancelled
                          </p>
                        ) : (
                          ((item.active_status === "received" ||
                            item.active_status === "processed" ||
                            item.active_status === "shipped") && (
                            <div
                              className="flex shadow-sm bg-red text-white cursor-pointer bottom-0 left-36 justify-center items-center mb-4 m-2 p-1 rounded-lg w-32 text-[12px]"
                              onClick={handleCancleItem}
                            >
                              <p>Cancel Order</p>
                            </div>
                          )) ||
                          (item.active_status === "delivered" && (
                            <div
                              className="flex shadow-sm bg-Crayola_blue text-white cursor-pointer bottom-0 left-0 justify-center items-center mb-4 m-2 p-1 rounded-lg w-32 text-[12px]"
                              onClick={handleReturnItem}
                            >
                              <p>Return Order</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            else return null;
          })}
      </div>

      {cancelModal && (
        <CancelOrder setCancelModal={setCancelModal} orderId={orderId} />
      )}
      {ReturnModal && (
        <ReturnOrder setReturnModal={setReturnModal} orderId={orderId} />
      )}
    </>
  );
};
