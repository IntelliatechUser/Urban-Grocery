import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_TOKEN } from "../Token/Token";
import axios from "axios";
import { useUserStore } from "./useUserStore";
import { useApiStore } from "./useApiStore";

export const useCartStore = create(
  persist(
    (set) => ({

      totalItem:0,
      price:0,
      allCartItems: [],
      variant:{0:0},
      config: {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaXNzIjoiZUthcnQiLCJhdWQiOiJlS2FydCBBdXRoZW50aWNhdGlvbiJ9.YCHpGWKM5CCeEiG_Fr38aE67xhndtImMHu7XYam6pXY',
        },
      },
      bearer: `${useUserStore.getState().userInfo.user_id}`,
      cartTotal: 0,
      setTotalItem: (data)=>{
        set(()=>({totalItem: data}))
      },
      setPrice: (data)=>{
        set(()=>({price: data}))
      },
      bodyFormData: () => {
        let bodyFormdata = new FormData();
        bodyFormdata.append("accesskey", "90336");
        bodyFormdata.append("remove_from_cart", "1");
        bodyFormdata.append(
          "user_id",
          useUserStore.getState().userInfo.user_id
        );
        return bodyFormdata;
      },
      setVariant: (data)=>{
        set(()=>({variant: data}))
      },
      setCartTotal: (data) => {
        set(() => ({ cartTotal: data }));
      },
      setAllCartItems: (data) => {
        set(() => ({ allCartItems: data }));
      },
      clearCartApi: () => {
        // set({ isLoading: true, error: null });

        axios
          .post(
            "https://grocery.intelliatech.in/api-firebase/cart.php",
            useCartStore.getState().bodyFormData(),
            useCartStore.getState().config
          )
          .then((res) => {
            console.log(
              res,
              "CART CLEAR RESPONSE ZUSTAND[[[[[[[[[[[[]]]]]]]]]]]]"
            );
          })
          .catch((error) => {
            console.log(error);
          });
      },
    }),

    {
      name: "cartStore",
    }
  )
);
