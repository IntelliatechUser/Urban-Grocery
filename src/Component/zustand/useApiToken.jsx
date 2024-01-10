import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useApiToken = create(
  persist(
     (set) => ({
       apiToken: "",
       accessTokenApi: (data) => {
        
         set(() => ({ apiToken: data }));
       },
     }),
     {
       name: "tokenStore",
     }
   )
 );
  
