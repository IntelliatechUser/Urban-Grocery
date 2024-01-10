import React, { useEffect, useState } from "react";
import {} from "../Token/Token";
import axios from "axios";
import { Aside } from "../Aside/Aside";
import { useLoaderState } from "../zustand/useLoaderState";
import { useApiStore } from "../zustand/useApiStore";
import { useApiToken } from "../zustand/useApiToken";
import axiosInstance from "../../api/axiosInstance";

export const Privacy = () => {
  const [privacy, setPrivacy] = useState("");
  const { setisLoading } = useLoaderState();
  const { jwt, setJwt } = useApiStore();
  const { apiToken } = useApiToken();

  const handlePrivacy = () => {
    let config = {
      headers: {
        // Authorization: `Bearer ${jwt}`,
        Authorization: `Bearer ${apiToken}`,
      },
    };

    let privacyData = new FormData();
    privacyData.append("accesskey", "90336");
    privacyData.append("settings", "1");
    privacyData.append("get_privacy", "1");
    setisLoading(true);

    axiosInstance
      .post(
        "https://grocery.intelliatech.in/api-firebase/settings.php",
        privacyData,
        config
      )
      .then((res) => {
        console.log(res);
        setPrivacy(res?.data?.privacy);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (apiToken) {
      handlePrivacy();
    }
  }, [apiToken]);

  const updatedPrivacy = privacy
    .replace(
      /agree to the terms,<br \/>\s*please close your\s*application/,
      "agree to the terms,<br />please close your application"
    )
    .replace(
      /search results,<br \/>\s*sites that include Urban Grocer/,
      "search results,<br />sites that include Urban Grocer"
    )
    .replace("<p>GENERAL</p>", '<p style="font-weight: 500;">GENERAL</p>')
    .replace(
      "<p>PERSONAL INFORMATION COLLECTION<br />",
      '<p style="font-weight: 500;">PERSONAL INFORMATION COLLECTION</p>'
    )
    .replace("<p>GENERAL<br />", '<p style="font-weight: 500;">GENERAL</p>')
    .replace(
      "<p>User Personal Data<br />",
      '<p style="font-weight: 500;">User Personal Data</p>'
    )
    .replace(
      "<p>Traffic Information<br />",
      '<p style="font-weight: 500;">Traffic Information</p>'
    )
    .replace(
      "<p>Log Information<br />",
      '<p style="font-weight: 500;">Log Information</p>'
    )
    .replace(
      "<p>Location Data<br />",
      '<p style="font-weight: 500;">Location Data</p>'
    )
    .replace(
      "<p>User Communication<br />",
      '<p style="font-weight: 500;">User Communication</p>'
    )
    .replace(
      "<p>Other Sites<br />",
      '<p style="font-weight: 500;">Other Sites</p>'
    )
    .replace(
      "<p><br />USE OF COLLECTED INFORMATION<br />",
      '<p style="font-weight: 500;">USE OF COLLECTED INFORMATION</p>'
    )
    .replace(
      "<p>ACCEPTANCE OF THE ABOVE TERMS<br />",
      '<p style="font-weight: 500;">ACCEPTANCE OF THE ABOVE TERM</p>'
    )
    .replace(
      "<br />SECURITY<br />",
      '<p style="font-weight: 500;">SECURITY</p>'
    )
    .replace(
      "<p>DO WE UPDATE PRIVACY POLICY?<br />",
      '<p style="font-weight: 500;">DO WE UPDATE PRIVACY POLICY?</p>'
    );

  return (
    <>
      <div className="flex flex mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
      <div className="xs:max-w-[85%] md:max-w-[30%] sm:max-w-[30%] xs:hidden md:block sm:block h-full">
          <Aside />
        </div>

        <div className="border-r border-r-light_gray  mt-[-40px]  w-4 h-[110vh]"></div>

        <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] ml-4">
          <div dangerouslySetInnerHTML={{ __html: updatedPrivacy }}>
            {/* {JSON.parse(item.description)} */}
          </div>
        </div>
      </div>
    </>
  );
};
