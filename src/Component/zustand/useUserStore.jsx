import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist((set) => ({
    userInfo:  {user_id : '',
                name: "Login",
                balance:0},
    deliveryAddress : '',
    addList: [],
    setAddList: (data) => {
      set(() => ({ addList: data }));
    },
    setUserInfo: (data) => {
      set(() => ({ userInfo: data }));
    },
    setDeliveryAddress: (data) => {
      set(() => ({ deliveryAddress: data }));
    },
    resetState: () => {
      set(() => ({ deliveryAddress: '' }));
    },
  }),
  {
    name: "userStore",
  }
  )
);
