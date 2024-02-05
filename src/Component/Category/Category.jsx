import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useProductsStore } from "../zustand/useProductsStore";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";
export const Category = () => {
  const { allCategories, setAllCategories } = useProductsStore();
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();

  const categryData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    var formData = new FormData();
    formData.append("accesskey", "90336");
    setisLoading(true);

    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/get-categories.php`,
        formData,
        config
      )
      .then((res) => {
        setAllCategories(res?.data?.data);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) categryData();
  }, [apiToken]);

  return (
    <>
      <div className="shadow-sm border  border-[#e8e8e8] xs:my-3 md:p-5 md:mt-7 bg-[#fcfff3] rounded-md  ">
        <div className="xs:my-2 xs:mx-2 mt-20 flex justify-between">
          <div className="text-customBlack text-[16px]">
            <h1 className="font-okra font-600">Shop By Category</h1>
          </div>
        </div>

        <div className="category xs:mt-3 md:mt-5">
          <div className="flex sm:justify-between  items-center xs:gap-2  flex-wrap mb-5">
            {allCategories &&
              allCategories.map((item) => {
                return (
                  <div
                    className="xs:w-18 md:w-36 md:ml-2 rounded-xl border-light_gray cursor-pointer hover:border-light_green hover:border-[2px] hover:shadow-sm border-[2px] bg-[#ffffff] "
                    key={item.id}
                  >
                    <NavLink to={`/subcategory-details/${item.id}`}>
                      <img
                        className="xs:w-28 xs:h-12 sm:w-44 sm:h-32 md:w-36 md:h-28  object-cover md:rounded-t-xl xs:rounded-t-lg  sm:rounded-t-lg"
                        src={item.image}
                        alt="item"
                      />
                    </NavLink>
                    <div className="px-4">
                      <div className="xs:text-center md:text-center xs:py-0.5  ">
                        <p className="xs:text-[12px] xs:font-light md:text-sm sm:text-md md:font-medium  sm:py-4 ">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
