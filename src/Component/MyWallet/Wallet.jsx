import React from "react";
import { useUserStore } from "./../zustand/useUserStore";
import { Aside } from "../Aside/Aside";

export const Wallet = () => {
  const {
    userInfo: { balance },
  } = useUserStore();
  
  return (
    <>
      <div className="flex justify-center mt-24 md:ml-10  xs:justify-center xs:items-center md:items-start sm:items-start md:flex-row md:justify-evenly sm:justify-evenly sm:flex sm:flex-row ">
        {/* <div className="xs:w-[85%] md:w-[30%] sm:w-[30%] xs:hidden md:block sm:block h-full"> */}
        {/* <div className="xs:max-w-[85%] md:max-w-[30%] sm:max-w-[30%] xs:hidden md:block sm:block h-full"> */}
        <div className="xs:w-[85%] md:w-[30%] sm:w-[30%] xs:hidden md:block sm:block h-full"> 
          <Aside />
        </div>

        <div className="border-r border-r-light_gray hidden sm:block mt-[-40px]  w-4 h-[110vh]"></div>
{/* <div className="md:w-full sm:w-[60%] xs:w-[85%] overflow-y-auto h-[90vh] ml-4"> */}
        <div className="md:w-full sm:w-[60%]    overflow-y-auto  ">
          
          <div className="xs:text-center xs:justify-center xs:flex xs:flex-col md:text-center md:justify-center md:flex flex-col sm:flex sm:text-center sm:justify-center border border-light_gray shadow-lg xs:w-40 xs:h-20 sm:ml-16 md:w-72 sm:w-[400px] sm:h-[100px] md:h-24 md:ml-[250px] xs:overflow-y-hidden">
            <p className="xs:text-base xs:font-semibold sm:text-3xl md:text-[20px] md:flex md:flex-col">
              My Balance:
            </p>
            <span className="md:mt-50 md:font-semibold sm:text-2xl xs:font-bold">
              ₹{balance}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
