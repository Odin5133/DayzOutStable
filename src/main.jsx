import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SignIn from "./Login/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import Feed from "./Main Page/Feed";
import Feedx from "./Main Page/Feedx";
import ManageFriends from "./Main Page/FriendsComponents/ManageFriends";
import Communities from "./Main Page/Communities";
import NewPost from "./Main Page/NewPost";
import NewCommunity from "./Main Page/NewCommunity";
import ProfilePage from "./Main Page/ProfilePage";
import EditProfile from "./Main Page/ProfilePage/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/feed",
    element: <ProtectedRoute Component={Feed} />,
    children: [
      {
        path: "",
        element: <ProtectedRoute Component={Feedx} />,
      },
      {
        path: "manageFriends",
        element: <ProtectedRoute Component={ManageFriends} />,
      },
      {
        path: "communities",
        element: <ProtectedRoute Component={Communities} />,
      },
      {
        path: "new_post",
        element: <ProtectedRoute Component={NewPost} />,
      },
      {
        path: "new_community",
        element: <ProtectedRoute Component={NewCommunity} />,
      },
      {
        path: "profile",
        children: [
          {
            path: "myfeed/:username",
            element: <ProfilePage />,
          },
          {
            path: "editProfile/:username",
            element: <EditProfile />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
