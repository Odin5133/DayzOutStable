import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FriendsPanel from "./FriendsPanel";
import NavPanel from "./NavPanel";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function Feed() {
  const [userName, setUserName] = useState("");
  const [curFriends, setCurFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .then((res) => {
        setUserName(res.data.username);
        setProfilePic(res.data.userPic);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        "http://127.0.0.1:8000/api/myFriends/",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        setCurFriends(res.data);
      });

    axios
      .post(
        "http://127.0.0.1:8000/api/suggestedFriends/",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        setSuggestedFriends(res.data);
      });
  }, []);

  return (
    <div>
      <Toaster />
      <Navbar userName={userName} profilePic={profilePic} />
      <div className="flex justify-evenly pt-[calc(8vh)] min-h-screen w-full bg-[#000] bg-cover  relative">
        <NavPanel userName={userName} profilePic={profilePic} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ y: -20, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-text font-body relative min-w-[90vw]
md:min-w-[45vw] lg:min-w-[45w]"
          >
            <Outlet context={{ setProfilePic }} />
          </motion.div>
        </AnimatePresence>
        <FriendsPanel
          curFriends={curFriends}
          suggestedFriends={suggestedFriends}
          setCurFriends={setCurFriends}
          setSuggestedFriends={setSuggestedFriends}
        />
      </div>
    </div>
  );
}

export default Feed;
