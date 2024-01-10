import React, { useState, useEffect } from "react";

import { FaHome, FaPlus } from "react-icons/fa";
import { HiOfficeBuilding, HiLocationMarker } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { AddressForm } from "./AddressForm";
import axios from "axios";
import { Aside } from "../Aside/Aside";
import { useLoaderState } from "../zustand/useLoaderState";
import { useUserStore } from "../zustand/useUserStore";
import { toast } from "react-toastify";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const Address = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { setisLoading } = useLoaderState();
  const { addList, setAddList } = useUserStore();
  const { apiToken } = useApiToken();

  const {
    userInfo: { user_id },
  } = useUserStore();

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
    if (apiToken) getAddress();
  }, [apiToken]);

  const handleDelete = (id) => {
    const deleteData = new FormData();
    deleteData.append("accesskey", "90336");
    deleteData.append("delete_address", "1");
    deleteData.append("id", `${id}`);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/user-addresses.php",
        deleteData,
        config
      )
      .then((res) => {
        toast("Address deleted successfully !", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 500,
          className: "foo-bar",
        });
        getAddress();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex flex mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
        <div className="xs:max-w-[85%] md:max-w-[30%] sm:max-w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>

        <div className=" border-r border-r-light_gray  mt-[-40px]  w-4 h-[110vh]"></div>

        <div className="md:w-full flex justify-center  border-x-GrayBlinkit sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] ml-4">
          <div className="md:w-full p-12">
            <div
              className="flex flex-row border b border-light_gray py-3 px-3 md:w-full sm:w-[450px] xs:w-full "
              onClick={() => setFormOpen(!formOpen)}
            >
              <span className="cursor-pointer rounded-full border-2 border-lime text-lime py-1 px-1 text-xs">
                <FaPlus />
              </span>
              <button className="ml-6 mt-[-4px] text-lime">
                {" "}
                Add New Address
              </button>
            </div>

            <div>
              {addList &&
                addList.map((item) => {
                  return (
                    <>
                      <div className="border border-light_gray md:w-full  sm:w-[450px] xs:w-full px-3 py-3 mt-2">
                        <div className="flex gap-2">
                          <div className="w-[5%] ">
                            {item.type === "Home" ? (
                              <FaHome className="inline mr-3" />
                            ) : item.type === "Work" ? (
                              <HiOfficeBuilding className="inline mr-3" />
                            ) : (
                              <HiLocationMarker className="inline mr-3" />
                            )}
                          </div>

                          <div className="w-[85%] flex flex-col">
                            <div>{item.type}</div>
                            <div className="pt-[10px]">
                              <span className="gap-2">{item.name} -</span>
                              <span className="">{item.address}, </span>
                              <span className="">{item.area_name}, </span>
                              <span className="">{item.city_name}, </span>
                              <span className="">{item.pincode}, </span>
                              <span className="">{item.country} </span>
                            </div>
                          </div>
                          <div className="w-[10%] flex gap-1 items-center">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red text-[21px] font-normal"
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div>
        {formOpen && (
          <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div className="bg-white rounded p-8">
              <AddressForm
                setFormOpen={setFormOpen}
                getAddress={getAddress}
                user_id={user_id}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
