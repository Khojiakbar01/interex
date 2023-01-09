import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { useContext, useEffect } from "react";
import AppContext from "./context/AppContext";
import Users from "./pages/Users/Users";
import UserMutation from "./pages/Users/UserMutation";
import Orders from "./pages/Orders/Orders/Orders";
import OrderMutation from "./pages/Orders/OrderMutation/OrderMutation";
import Packages from "./pages/Packages/Packages";
import Posts from "./pages/Posts/Posts";
import PostMutation from "./pages/Posts/PostMutation";
import OrderInfo from "./pages/Orders/OrderInfo/OrderInfo";
import NewPost from "./pages/NewPost/NewPost";
import RejectedPosts from "./pages/Rejected-Posts/Rejected-Posts";
import RejectedOrders from "./pages/Rejected-Orders/Rejected-Orders";
import PostCreate from "./pages/Posts/PostCreate";
import PackageBack from "./pages/PackageBack/PackageBack";
import Settings from "./pages/Settings/Settings";
function App() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const ctx = useContext(AppContext);
  const { isAuth } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    ctx.setAppData({
      user: JSON.parse(user),
      token,
      isAuth: token?.trim().length > 0,
    });
  }, [token]);
 
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuth && <Route path="/home" element={<Home />} />}
        {isAuth && <Route path="*" element={<Navigate to={"home"} />} />}
        {isAuth && <Route path="/users" element={<Users />} />}
        {isAuth && <Route path="/users/:id" element={<UserMutation />} />}
        {isAuth && <Route path="/orders" element={<Orders />} />}
        {isAuth && <Route path="/orders/myorders" element={<Orders />} />}
        {isAuth && <Route path="/orders/delivered" element={<Orders />} />}
        {isAuth && <Route path="/orders/delivered" element={<Orders />} />}
        {isAuth && (
          <Route path="/orders/delivered/daily" element={<Orders />} />
        )}
        {isAuth && <Route path="/posts/:id/orders" element={<Orders />} />}
        {isAuth && <Route path="/postback/rejectedposts/:id" element={<Orders />} />}
        {isAuth && <Route path="/packages/:id/orders" element={<Orders />} />}
        {isAuth && <Route path="/packageback/:id/orders" element={<Orders />} />}
        {isAuth && (
          <Route path="/posts/:id/regionorders" element={<Orders />} />
        )}
        {isAuth && (
          <Route path="/postback/rejected/orders" element={<Orders />} />
        )}
        {isAuth && <Route path="/orders/:id" element={<OrderMutation />} />}
        {isAuth && <Route path="/orders/info/:id" element={<OrderInfo />} />}
        {isAuth && <Route path="/packages" element={<Packages />} />}
        {isAuth && <Route path="/packageback" element={<PackageBack />} />}
        {isAuth && <Route path="/posts" element={<Posts />} />}
        {isAuth && <Route path="/post/create" element={<PostCreate />} />}
        {isAuth && <Route path="/postback" element={<Posts />} />}
        {isAuth && <Route path="/new-post" element={<NewPost />} />}
        {isAuth && <Route path="/posts/new" element={<PostMutation />} />}
        {isAuth && <Route path="/rejected/posts" element={<RejectedPosts />} />}
        {isAuth && <Route path="/settings" element={<Settings />} />}
        {isAuth && (
          <Route
            path="/rejected/post/:id/orders"
            element={<RejectedOrders />}
          />
        )}
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
     
    </>
  );
}

export default App;
