import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

function SuggestedFriends({ setSuggestedFriends, suggestedFriends }) {
  const follow = async (namex) => {
    console.log(namex);
    axios
      .post(
        "http://127.0.0.1:8000/api/sendFriendRequest/",
        {
          to_username: namex,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const updatedSuggestedFriends = suggestedFriends.filter(
          (friend) => friend.username !== namex
        );
        setSuggestedFriends(updatedSuggestedFriends);
        console.log(updatedSuggestedFriends);
        toast(
          <span className="flex text-[#3fb041]  gap-1 items-center">
            <IconCircleCheckFilled className="text-[#41b743] " size={19} />
            Friend Request Sent to {namex}
          </span>
        );
      })
      .catch((err) => {
        if (err.response.data.message === "Friend request already sent") {
          const updatedSuggestedFriends = suggestedFriends.filter(
            (friend) => friend.username !== namex
          );
          setSuggestedFriends(updatedSuggestedFriends);
          toast(
            <span className="flex text-[#3fb041]  gap-1 items-center">
              <IconCircleCheckFilled className="text-[#41b743] " size={19} />
              Friend Request Sent to {namex}
            </span>
          );
        } else {
          toast(
            <span className="flex text-[#b03f3f]  gap-1 items-center">
              <IconExclamationCircleFilled
                className="text-[#b74141] "
                size={19}
              />
              An error occured
            </span>
          );
        }
      });
  };

  useEffect(() => {
    console.log(suggestedFriends);
  }, []);

  return (
    <div className="h-[36vh] overflow-y-scroll no-scrollbar">
      {suggestedFriends.map((x) => (
        <div
          key={`${x.firstName}-${x.lastName}`}
          className="flex gap-2 border-2 border-accent bg-background p-2 m-2 rounded-xl overflow-hidden text-ellipsis items-center "
        >
          <img
            src={x.userPic}
            alt="Avatar"
            className="h-[8vh]  rounded-full aspect-square object-cover "
          />
          <div className=" flex flex-col items-center w-full">
            <div className="text-text font-body">{`${x.username
              .charAt(0)
              .toUpperCase()}${x.username.slice(1)}`}</div>
            <button
              className="text-text bg-accent py-1 mt-2 px-2 rounded-lg active:tracking-tight"
              onClick={() => follow(x.username)}
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SuggestedFriends;
