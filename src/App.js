import { Navbar } from "./Component/Header/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import { ProductDetails } from "./Component/Products/Product-Details/ProductDetails";
import Home from "./Component/Home";
import { useEffect, useState } from "react";
import Payment from "./Component/Payment/Payment";
import "./index.css";
import { SubCategory } from "./Component/Category/Sub-Category/SubCategory";
import FilterData from "./Component/FilterData";
import Allproducts from "./Component/Products/Allproducts";
import { Faq } from "./Component/FAQ/Faq";
import { MyOrder } from "./Component/My-Order/MyOrder";
import { Success } from "./Component/Payment/Success";
import { Wallet } from "./Component/MyWallet/Wallet";
import { Login } from "./Component/Login.jsx/Login";
import { Address } from "./Component/MyAddress/Address";
import { Privacy } from "./Component/Privacy/Privacy";
import { Coditions } from "./Component/Term & Conditions/Coditions";
import { Contact } from "./Component/Contact/Contact";
import { About } from "./Component/About/About";
import Loader from "./Component/Loader";
import { OrderDetails } from "./Component/Order-Details/OrderDetails";
import { MyProfile } from "./Component/Profile/MyProfile";
import { OrderDetailsPage } from "./Component/Order-Details/OrderDetailsPage";
import { FavPage } from "./Component/Favourites/FavPage";
import { Footer } from "./Component/Footer/Footer";
import axios from "./api/axios";
import { useApiToken } from "./Component/zustand/useApiToken";
import { ToastContainer } from "react-toastify";
import axiosInstance from "./api/axiosInstance";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [addItem, setAddItem] = useState([]);
  const [data, setData] = useState([]);
  const [formData, setFormdata] = useState({
    username: "",
    address: "",
    city: "",
    phone: "",
    pin: "",
  });
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [user_id, setUser_id] = useState("14");
  const [NavbarOpen, setNavbarOpen] = useState(true);
  const { apiToken, accessTokenApi } = useApiToken();

  useEffect(() => {
    const fetchToken = async () => {
      accessTokenApi("");
      // const generateTokenResponse = await axios.get(
      const generateTokenResponse = await axiosInstance.get(
        "https://grocery.intelliatech.in/api-firebase/verify-token.php?generate_token",
        {
          params: {
            key: "generate_token",
          },
        }
      );
      const generatedToken = generateTokenResponse?.data;
      if (generatedToken) {
        accessTokenApi(generatedToken);
        // const verifyTokenResponse = await axios.post(
        // const verifyTokenResponse = await axiosInstance.post(
        //   "https://grocery.intelliatech.in/api-firebase/verify-token.php?verify_token",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${generatedToken}`,
        //     },
        //   }
        // );
        // console.log("verify Token Response", verifyTokenResponse.data);
       
      } else {
        console.log("Token is not valid.");
       
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    localStorage.setItem("NavbarOpen", JSON.stringify(NavbarOpen));
  }, [NavbarOpen]);

 

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-screen justify-between">
        <Navbar
          setData={setData}
          addItem={addItem}
          setAddItem={setAddItem}
          formData={formData}
          setFormdata={setFormdata}
          setShowSearchBar={setShowSearchBar}
          name={name}
          setName={setName}
          NavbarOpen={NavbarOpen}
          setNavbarOpen={setNavbarOpen}
          setLoggedIn={setLoggedIn}
          setUser_id={setUser_id}
        />
        <Loader />
        <Routes>
          <Route path="/login" element={<Login setUser_id={setUser_id} />} />

          <Route
            path="/"
            element={
              <Home
                data={data}
                addItem={addItem}
                setAddItem={setAddItem}
                setData={setData}
                showSearchBar={showSearchBar}
                user_id={user_id}
                setUser_id={setUser_id}
                setLoggedIn={setLoggedIn}
                setNavbarOpen={setNavbarOpen}
              />
            }
          />
          <Route
            path="/subcategory-details/:category_name/product-details/:id"
            element={
              <ProductDetails
                setAddItem={setAddItem}
                addItem={addItem}
                user_id={user_id}
                setUser_id={setUser_id}
                setNavbarOpen={setNavbarOpen}
              />
            }
          />

          <Route
            path="/subcategory-details/:category_id"
            element={
              <SubCategory
                setAddItem={setAddItem}
                addItem={addItem}
                user_id={user_id}
                setUser_id={setUser_id}
                setNavbarOpen={setNavbarOpen}
              />
            }
          />
          <Route
            path="/search"
            element={
              <FilterData
                setData={setData}
                setName={setName}
                data={data}
                name={name}
                addItem={addItem}
                setAddItem={setAddItem}
                user_id={user_id}
                setUser_id={setUser_id}
              />
            }
          />
          <Route
            path="/payment"
            element={
              <Payment
                NavbarOpen={NavbarOpen}
                setNavbarOpen={setNavbarOpen}
                setData={true}
                user_id={user_id}
                setUser_id={setUser_id}
              />
            }
          />

          <Route path="/wallet" element={<Wallet />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/conditons" element={<Coditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/ordersummarypage" element={<OrderDetailsPage />} />
          <Route path="/favpage" element={<FavPage />} />

          <Route
            path="/success"
            element={
              <Success NavbarOpen={NavbarOpen} setNavbarOpen={setNavbarOpen} />
            }
          />
          <Route
            path="/address"
            element={<Address user_id={user_id} setUser_id={setUser_id} />}
          />
          <Route path="/faq" element={<Faq />} />
          <Route path="/orderdetails" element={<OrderDetails />} />
          <Route
            path="/myorder"
            element={
              <MyOrder
                setAddItem={setAddItem}
                addItem={addItem}
                price={price}
                user_id={user_id}
                setUser_id={setUser_id}
                setPrice={setPrice}
                setNavbarOpen={setNavbarOpen}
              />
            }
          />

          <Route
            path="/allproducts"
            element={
              <Allproducts
                name={name}
                user_id={user_id}
                setUser_id={setUser_id}
                setNavbarOpen={setNavbarOpen}
              />
            }
          />
        </Routes>
        <div className="bg-[#faffed] w-full text-center opacity-80 shadow-[inset_0_-2px_10px_rgba(0,0,0,0.6)]">
          <footer className=" ">
            <div className=" text-sm  mb-4">
              <Footer />
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
