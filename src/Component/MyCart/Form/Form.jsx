import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";
import { AddressForm } from "../../MyAddress/AddressForm";
import { useUserStore } from "../../zustand/useUserStore";
import { useLoaderState } from "../../zustand/useLoaderState";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsChevronCompactRight } from "react-icons/bs";
import { useApiStore } from "../../zustand/useApiStore";
import { useApiToken } from "../../zustand/useApiToken";
import axiosInstance from "../../../api/axiosInstance";

function Form({ user_id, setReviewPage, setShowForm }) {
  const [formOpen, setFormOpen] = useState(false);
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();

  const { deliveryAddress, setDeliveryAddress, addList, setAddList } =
    useUserStore();
  const handleOptionChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };

  const getAddress = () => {
    const data = new FormData();
    data.append("accesskey", "90336");
    data.append("get_addresses", "1");
    data.append("user_id", user_id);
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/user-addresses.php",
        data,
        config
      )
      .then((res) => {
        setAddList(res?.data?.data);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) {
      getAddress();
    }
  }, [apiToken]);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleReview = () => {
    setReviewPage(true);
    setShowForm(false);
  };

  return (
    <>
      {!formOpen && (
        <>
          <div className="p-3">
            <div className="font-bold text-2xl ">Select Delivery Address:</div>

            <div
              onClick={() => handleOpenForm()}
              className=" flex gap-3 hover:border-[2px] border-[2px] hover:border-lime py-2 cursor-pointer items-center justify-center border-light_gray m-2  rounded-md"
            >
              <AiOutlinePlusCircle className="text-lime text-[20px]" />
              <p className="text-[#8d9191] text-lg">Add new address</p>
            </div>
          </div>
          <form>
            {addList &&
              addList.map((item) => {
                return (
                  <label>
                    <div className=" hover:border-[2px] border-[2px] hover:border-lime flex cursor-pointer border-light_gray px-3 py-3 mt-1 gap-1 m-4 rounded-md">
                      <div className="">
                        <input
                          type="radio"
                          name="options"
                          value={item.id}
                          checked={deliveryAddress === item.id}
                          onChange={handleOptionChange}
                        />
                      </div>

                      <div className="flex gap-2 ">
                        <div className="w-[5%]">
                          {item.type === "Home" ? (
                            <FaHome className="inline ml-3 mb-1" />
                          ) : (
                            <HiOfficeBuilding className="inline ml-3 mb-1" />
                          )}
                        </div>
                        <div className="w-[85%] flex flex-col ml-4">
                          <div className="font-medium ">
                            {item.type === "Home" ? "Home" : "Work"}
                          </div>
                          <div className="pt-[10px] text-[#8d9191] ">
                            <span className="gap-2 ">{item.name} -</span>
                            <span className="">{item.address}, </span>
                            <span className="">{item.area_name}, </span>
                            <span className="">{item.city_name}, </span>
                            <span className="">{item.pincode}, </span>
                            <span className="">{item.country} </span>
                          </div>
                        </div>
                        <div className="w-[10%] flex gap-4 items-center"></div>
                      </div>
                    </div>
                  </label>
                );
              })}
          </form>

          <div className="mt-2"></div>
        </>
      )}

      {deliveryAddress ? (
        <>
          <button
            className="flex justify-center mt-5 mb-1 bg-lime p-3 text-white fixed bottom-0 right-1 md:w-[378px] 2xs:w-[99%]  rounded-lg"
            onClick={handleReview}
          >
            <div className="flex items-center justify-between w-full   ">
              <p className="py-2 bg-lime text-xl  rounded-lg"> Review Order</p>
              <BsChevronCompactRight className="text-lg font-bold" />
            </div>
          </button>
        </>
      ) : null}
      {formOpen && (
        <AddressForm
          setFormOpen={setFormOpen}
          getAddress={getAddress}
          user_id={user_id}
        />
      )}
    </>
  );
}

export default Form;
