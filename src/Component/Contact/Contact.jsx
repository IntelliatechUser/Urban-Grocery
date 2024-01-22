import axios from "axios";
import React, { useEffect, useState } from "react";
import { Aside } from "../Aside/Aside";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const Contact = () => {
  const [contact, setContact] = useState("");
  const { setisLoading } = useLoaderState();
  const { apiToken } = useApiToken();

  const handleContact = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };
    let contactData = new FormData();
    contactData.append("accesskey", "90336");
    contactData.append("settings", "1");
    contactData.append("get_contact", "1");
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/settings.php",
        contactData,
        config
      )
      .then((res) => {
        setContact(res?.data?.contact);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) handleContact();
  }, [apiToken]);

  return (
    <>
      <div className="flex flex mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
        <div className="xs:w-[85%] md:w-[30.5%] sm:w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>
        <div className="border-r border-r-light_gray  mt-[-40px]  w-4 h-[110vh]"></div>

        <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-scroll h-[90vh] ml-4">
          <div class="font-bold">
            <div dangerouslySetInnerHTML={{ __html: contact }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
