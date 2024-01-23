import React, { useEffect, useState } from "react";
import axios from "axios";
import { Aside } from "../Aside/Aside";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const Faq = () => {
  const [faqData, setFaqData] = useState("");
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();

  const handleFaq = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
    let FaqData = new FormData();
    FaqData.append("accesskey", "90336");
    FaqData.append("get_faqs", "1");
    setisLoading(true);

    axiosInstance
      .post(
        `https://grocery.intelliatech.in/api-firebase/get-faqs.php`,
        FaqData,
        config
      )
      .then((res) => {
        setFaqData(res?.data?.message);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) handleFaq();
  }, [apiToken]);
  return (
    <>
      <div className="flex flex mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
        {/* <div className="xs:w-[85%] md:w-[30%] sm:w-[30%] xs:hidden md:block sm:block h-full"> */}
        {/* <div className="xs:max-w-[85%] md:max-w-[30%] sm:max-w-[30%] xs:hidden md:block sm:block h-full"> */}
        <div className="xs:w-[85%] md:w-[30.5%] sm:w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>

        <div className="border-r border-r-light_gray hidden sm:block mt-[-40px]  w-4 h-[110vh]"></div>

        {/* <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] ml-4"> */}
          <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto  ml-4"> 
          <div className="bg-white">
            <p className="md:text-md font-bold  ">
              {faqData}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
