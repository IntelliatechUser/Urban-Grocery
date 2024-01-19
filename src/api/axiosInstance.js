// // axios.js
// import axios from "axios";
// import { useApiToken } from "../Component/zustand/useApiToken";

// const axiosInstance  = axios.create({
//   baseURL: "https://grocery.intelliatech.in/api-firebase",
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = useApiToken.getState().accessToken;
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const generateTokenResponse = await axiosInstance.get("https://grocery.intelliatech.in/api-firebase/verify-token.php?generate_token", {
//         params: {
//           key: "generate_token",
//         },
//       });
//       console.log(generateTokenResponse, "generatedTokenSave in localstorage");
//       const generatedToken = generateTokenResponse.data;

//       if (generatedToken) {
//         useApiToken.getState().accessTokenApi(generatedToken);
//         originalRequest.headers.Authorization = `Bearer ${generatedToken}`;
//         return axiosInstance(originalRequest);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance ;

// import axios from "axios";
// import { useApiToken } from "../Component/zustand/useApiToken";

// const axiosInstance = axios.create({
//   baseURL: "https://grocery.intelliatech.in/api-firebase",
// });

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const accessToken = useApiToken.getState().apiToken;

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const generateTokenResponse = await axiosInstance.get(
//           "https://grocery.intelliatech.in/api-firebase/verify-token.php?generate_token",
//           {
//             params: {
//               key: "generate_token",
//             },
//           }
//         );

//         const generatedToken = generateTokenResponse.data;

//         if (generatedToken) {
//           useApiToken.getState().accessTokenApi(generatedToken);
//           originalRequest.headers.Authorization = `Bearer ${generatedToken}`;
//           console.log("new generated token>>>>>.....");
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Error refreshing token:", refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
import axios from "axios";
import { useApiToken } from "../Component/zustand/useApiToken";

const axiosInstance = axios.create({
  baseURL: "https://grocery.intelliatech.in/api-firebase",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = useApiToken.getState().apiToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let isRefreshing = false;
axiosInstance.interceptors.response.use(
  async (response) => {
    const accessToken = useApiToken.getState().apiToken;
    if (accessToken) {
      return response;
    }
    console.log("response interceptor1", response);
    console.log("response interceptor2", response?.data?.message);
    const originalRequest = response?.config;
    if (response?.data?.message === "Invalid Hash") {
      originalRequest._retry = true;

      // if (!isRefreshing) {
      //   isRefreshing = true;
      try {
        const generateTokenResponse = await axiosInstance.get(
          "https://grocery.intelliatech.in/api-firebase/verify-token.php?generate_token",
          {
            params: {
              key: "generate_token",
            },
          }
        );
        console.log("i run only one time.");
        const generatedToken = generateTokenResponse.data;

        if (generatedToken) {
          useApiToken.getState().accessTokenApi(generatedToken);
          originalRequest.headers.Authorization = `Bearer ${generatedToken}`;
          console.log("new generated token>>>>>.....");
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // }
    else return response;
    return Promise.reject(response);
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
