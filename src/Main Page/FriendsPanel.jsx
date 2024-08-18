import axios from "axios";
import React, { useState, useEffect } from "react";
import PrimaryComp from "./FriendsComponents/PrimaryFriends";
import Request from "./FriendsComponents/Request";
import SuggestedFriends from "./FriendsComponents/SuggestedFriends";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

function FriendsPanel({
  curFriends,
  suggestedFriends,
  setSuggestedFriends,
  setCurFriends,
}) {
  const [friendSection, setFriendsection] = useState("Primary");
  const [friendReq, setFriendReq] = useState([]);
  // const [curFriends, setCurFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .post(
          "http://127.0.0.1:8000/api/pendingRequests/",
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setFriendReq(res.data);
          console.log(res.data);
        });
    };
    fetchData();
    console.log(suggestedFriends, curFriends);
  }, []);

  return (
    <div className="min-w-[17vw] w-[17vw] hidden lg:block mt-8 ">
      <div className="border-4 border-accent rounded-3xl px-2 pt-1 pb-3 flex w-full justify-center flex-col duration-150">
        <span className="text-primary text-2xl tracking-normal font-body leading-relaxed pl-4 ">
          Friends Tab
        </span>
        <div className="flex justify-around text-text mb-2 w-full mt-2  ">
          <motion.div
            className=" absolute w-[7.5vw] rounded-md h-8  bg-accent z-0  "
            initial={{ x: "-50%" }}
            animate={{ x: friendSection === "Primary" ? "-50%" : "50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 29 }}
          />
          <div
            onClick={() => setFriendsection("Primary")}
            className="text-lg font-body cursor-pointer z-10 w-[50%] flex justify-center"
          >
            Primary
          </div>
          <div
            onClick={() => setFriendsection("Suggested")}
            className="text-lg font-body cursor-pointer z-10 w-[50%] flex justify-center"
          >
            Suggested
          </div>
        </div>
        <div>
          {friendSection === "Primary" && (
            <PrimaryComp
              curFriends={curFriends}
              setCurFriends={setCurFriends}
            />
          )}
        </div>
        <div>
          {friendSection === "Suggested" && (
            <SuggestedFriends
              suggestedFriends={suggestedFriends}
              setSuggestedFriends={setSuggestedFriends}
            />
          )}
        </div>
      </div>
      {friendReq.length > 0 && (
        <div className="mt-8">
          <span className="text-primary w-full flex justify-center text-xl">
            Requests
          </span>
          <div>
            <Request friendReq={friendReq} setFriendReq={setFriendReq} curFriends={curFriends}
              setCurFriends={setCurFriends} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendsPanel;
