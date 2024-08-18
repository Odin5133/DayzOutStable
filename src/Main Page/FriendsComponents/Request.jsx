// import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

function Request({ friendReq, setFriendReq, curFriends, setCurFriends }) {
  // const [curFriends, setcurFriends] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("https://dummyjson.com/users?limit=5&select=firstName,lastName")
  //     .then((res) => {
  //       const usersWithQuotes = res.data.users;
  //       setcurFriends(usersWithQuotes);
  //     });
  // }, []);
  useEffect(() => {
    console.log(friendReq);
  }, []);

  const acceptReq = (id) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/acceptFriendRequest/",
        { request_id: id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        // setFriendReq(res.data);
        console.log(res.data);
        const updateReq = friendReq.filter((x) => x.id !== id);
        setFriendReq(updateReq);
        toast(
          <span className="flex text-[#3fb041]  gap-1 items-center">
            <IconCircleCheckFilled className="text-[#41b743] " size={19} />
            Friend Request Aceepted
          </span>
        );
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
      });
  };

  const rejectReq = (id) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/declineFriendRequest/",
        { request_id: id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        // setFriendReq(res.data);
        console.log(res.data);
        const updateReq = friendReq.filter((x) => x.id !== id);
        setFriendReq(updateReq);
        toast(
          <span className="flex text-[#e36b5e]  gap-1 items-center">
            <IconCircleCheckFilled className="text-[#e36b5e] " size={19} />
            Friend Request Declined
          </span>
        );
      });
  };

  return (
    <div>
      {friendReq &&
        friendReq.map((x, i) => (
          <div
            className="border-2 border-accent p-3 m-2 rounded-xl bg-background shadow-[5px_6px_15px_0px_rgba(165,_39,_255,_0.48)]"
            key={i}
          >
            <div
              key={`${x.firstName}-${x.lastName}`}
              className="flex gap-2   overflow-hidden text-ellipsis h-[6vh]"
            >
              <img
                src={x.from_user_pic}
                alt="Avatar"
                className=" rounded-full aspect-square object-cover"
              />
              <div className="h-full flex flex-col justify-center w-full items-center text-text font-body text-xl">
                {x.from_user_username}
              </div>
            </div>
            <div className="flex w-full mt-3 justify-around">
              <button
                className="text-text bg-accent  rounded-lg w-[47%]"
                onClick={(e) => {
                  e.preventDefault();
                  acceptReq(x.id);
                }}
              >
                Accept
              </button>
              <button
                className="bg-pseudobackground  text-text py-1 rounded-lg w-[47%] "
                onClick={(e) => {
                  e.preventDefault();
                  rejectReq(x.id);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Request;
