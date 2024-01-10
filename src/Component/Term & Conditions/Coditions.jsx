import React, { useEffect, useState } from "react";
import { API_TOKEN } from "../Token/Token";
import axios from "axios";
import { Aside } from "../Aside/Aside";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiStore } from "../zustand/useApiStore";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const Coditions = () => {
  const [conditons, setConditons] = useState("");
  const { setisLoading } = useLoaderState();
  const { jwt, setJwt } = useApiStore();
  const { apiToken } = useApiToken();

  const handleConditons = () => {
    let config = {
      headers: {
        // Authorization: `Bearer ${jwt}`,
        Authorization: `Bearer ${apiToken}`,
      },
    };
    let conditonData = new FormData();
    conditonData.append("accesskey", "90336");
    conditonData.append("settings", "1");
    conditonData.append("get_terms", "1");
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/settings.php",
        conditonData,
        config
      )
      .then((res) => {
        setConditons(res?.data?.terms);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };
  // useEffect(() => {
  //   handleConditons();
  // }, []);

  useEffect(() => {
    if (apiToken) {
      handleConditons();
    }
  }, [apiToken]);

  return (
    <>
       <div className="flex flex mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
       <div className="xs:max-w-[85%] md:max-w-[30%] sm:max-w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>

        <div className="border-r border-r-light_gray  mt-[-40px]  w-4 h-[110vh]"></div>

        <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] ml-4">
          <div className="bg-white">
            <div dangerouslySetInnerHTML={{ __html: conditons }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
