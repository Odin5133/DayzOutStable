// import React from "react";
import React, { useState, useEffect } from "react";
import { IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NavPanel({ userName, profilePic }) {
  const navigate = useNavigate();
  const [imgClass, setImgClass] = useState("");
  const handleImageLoad = (e) => {
    const img = e.target;
    if (img.naturalHeight > img.naturalWidth) {
      setImgClass("aspect-square object-cover");
    } else {
      setImgClass("");
    }
  };

  const logout = (e) => {
    e.preventDefault();
    // axios
    //   .post("http://127.0.0.1:8000/api/logout/")
    //   .then((response) => {
    //     // axios.defaults.headers.common[
    //     //   "Authorization"
    //     // ] = `Bearer ${response.data["token"]}`;
    //     console.log("Yippee ki-yay, mother");
    //     console.log(response.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // return response.json(); // main learning that I got from this is that we need to return response.json() to execute django html code that is being returned
      })
      .then((data) => {
        Cookies.remove("accessToken");
        console.log("Yippee ki-yay, mother");
        console.log(data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createAccessToken = () => {
    console.log("Creating access token");
    axios
      .post(
        "http://127.0.0.1:8000/api/refresh/",
        { Cookies },
        { withCredentials: true }
      )
      .then((response) => {
        // Cookies.set("accessToken", response.data.token, {
        //   sameSite: "None"
        // });
        // do we need to check response.status == 200?
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data["token"]}`;
        console.log("Yippee ki-yay, mother");
        console.log(response.data);
        Cookies.set("accessToken", response.data.token, { expires: 7 });
        return 1;
      })
      .catch((err) => {
        console.log(err, "error");
        navigate("/");
        return 0;
      });
  };

  const isLoggedIn = () => {
    // console.log(`Bearer ${Cookies.get("accessToken")}`);
    fetch("http://127.0.0.1:8000/api/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return 1;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        createAccessToken();
      });
  };

  return (
    <div className="w-[min(20vw,200px)]  hidden md:block sticky top-24 left-0 h-0">
      <div className=" flex-col justify-between h-[calc(100vh-10rem)] sticky rounded-2xl border-4 border-accent bg-pseudobackground p-4 flex">
        <Link
          to={`profile/myfeed/${userName}`}
          // to=""
          className="flex w-full justify-evenly border-2 bg-text rounded-xl px-2 py-4 h-fit items-center"
          onClick={isLoggedIn}
        >
          {/* <IconUserCircle stroke={2} /> */}
          <img
            src={profilePic}
            onLoad={handleImageLoad}
            className={`${imgClass} rounded-full  h-9`}
          />
          <span className="text-center">{`${userName
            .charAt(0)
            .toUpperCase()}${userName.slice(1)}`}</span>
        </Link>
        <ul className="flex flex-col gap-6">
          <Link
            to=""
            className=" hover:border-accent hover:underline- duration-300 hover:tracking-wider text-text font-body flex w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center cursor-pointer active:tracking-normal "
            onClick={isLoggedIn}
          >
            Home
          </Link>
          <Link
            to="manageFriends"
            className=" hover:border-accent hover:underline- duration-300 hover:tracking-wider text-text font-body w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center cursor-pointer active:tracking-normal flex lg:hidden "
            onClick={isLoggedIn}
          >
            Manage Friends
          </Link>
          <Link
            to="communities"
            className=" hover:border-accent duration-300 hover:tracking-wider text-text font-body flex w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center cursor-pointer active:tracking-normal "
            onClick={isLoggedIn}
          >
            Communites
          </Link>
          <Link
            to="new_post"
            className=" hover:border-accent hover:underline- duration-300 hover:tracking-wider text-text font-body flex w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center cursor-pointer active:tracking-normal "
            onClick={isLoggedIn}
          >
            New Post
          </Link>
          <Link
            to="new_community"
            className=" hover:border-accent hover:underline- duration-300 hover:tracking-wider text-text font-body flex w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center cursor-pointer active:tracking-normal "
            onClick={isLoggedIn}
          >
            New Commnunity
          </Link>
          {/* <li>Saved Posts</li> */}
        </ul>
        <div className="flex flex-col gap-2">
          <Link
            className="border-primary border-2 text-text active:bg-accent2 duration-300 hover:bg-accent hover:border-accent active:tracking-tight font-body flex w-full justify-center text-lg px-2 py-1 rounded-lg bg-pseudobackground text-center "
            onClick={isLoggedIn}
          >
            Saved Posts
          </Link>
          <div
            className="border-2 border-[#a6bfcd]  text-[#a6bfcd] flex w-full justify-center text-base px-2 py-1 rounded-lg bg-pseudobackground text-center active:tracking-normal hover:text-[#000] 
            hover:tracking-wider hover:bg-[#a6bfcd] duration-300 hover:border-bg-[#a6bfcd] cursor-pointer"
            onClick={logout}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavPanel;
