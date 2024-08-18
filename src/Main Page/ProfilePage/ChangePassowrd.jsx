// import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  IconExclamationCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";

function ChangePassowrd() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassMatch, setNewPassMatch] = useState(false);
  const [chngpass, setChngpass] = useState(false);

  useEffect(() => {
    if (confirmPassword.length > 3) {
      if (newPassword === confirmPassword) {
        setNewPassMatch(true);
      } else {
        setNewPassMatch(false);
      }
    }
  }, [confirmPassword]);

  const handlePassChange = (e) => {
    e.preventDefault();
    if (newPassMatch) {
      axios
        .post(
          "http://127.0.0.1:8000/api/editPassword/",
          {
            old_password: password,
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setConfirmPassword("");
          setPassword("");
          setNewPassword("");
          setChngpass(false);
          toast(
            <span className="flex text-[#3fb041]  gap-1 items-center">
              <IconCircleCheckFilled className="text-[#41b743] " size={19} />
              Password Changed Successfully!
            </span>
          );
        })
        .catch((err) => {
          console.log(err.response.data.message);
          toast(
            <span className="flex text-[#b03f3f]  gap-1 items-center">
              <IconExclamationCircleFilled
                className="text-[#b74141] "
                size={19}
              />
              {err.response.data.message}
            </span>
          );
        });
    }
  };

  return (
    <div className="rounded-xl bg-pseudobackground mt-4 py-2 duration-200">
      <div className="mx-[3vw] flex justify-between">
        <div className="mt-4  text-[2rem] tracking-wider font-semibold leading-9">
          Password
        </div>
        <AnimatePresence>
          {!chngpass && (
            <motion.button
              className={clsx(
                "bg-[#d44444] text-text rounded-md px-4 py-1 mt-4 duration-200",
                chngpass ? " opacity-0" : "opacity-100"
              )}
              onClick={() => setChngpass(true)}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Change Password
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <hr className="mx-[3vw] border-[#899bad] mt-4" />
      <AnimatePresence>
        {!chngpass ? (
          <div className="mx-[3vw] mt-2 ">
            Strengthen your account by ensuring your password is strong.
          </div>
        ) : (
          <div>
            <form className="mx-[3vw] mt-4" onSubmit={handlePassChange}>
              <div className="">Old Password</div>
              <input
                type="password"
                className=" mt-2 rounded-md px-2 py-1 w-[97%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                // placeholder={user.username}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className=" mt-4">New Password</div>
              <input
                type="password"
                className="mt-2 rounded-md px-2 py-1 w-[97%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                // placeholder={user.bio}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword.length > 3 && newPassword.length < 8 && (
                <span className="text-[#ff3838]">
                  Minimum password length: 8
                </span>
              )}
              <div className=" mt-4">Confirm New Password</div>
              <input
                type="password"
                className={clsx(
                  "mt-2 rounded-md px-2 py-1 w-[97%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent",
                  newPassword.length < 8 &&
                    "border-pseudobackground2 cursor-not-allowed focus:border-pseudobackground2"
                )}
                // placeholder={user.bio}
                value={confirmPassword}
                onChange={(e) =>
                  newPassword.length >= 8 && setConfirmPassword(e.target.value)
                }
                required
              />
              {!newPassMatch && confirmPassword.length > 3 && (
                <span className="text-[#ff3838]">Passwords do not match</span>
              )}
              <br />
              <div className="w-[97%] flex justify-end">
                <motion.button
                  className={clsx(
                    "mt-8 rounded-lg px-4 py-1 text-lg   text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent duration-300",
                    newPassMatch && confirmPassword.length >= 8
                      ? "bg-accent "
                      : "bg-pseudobackground2 cursor-not-allowed"
                  )}
                  type="submit"
                  initial={{ y: "170%" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 29 }}
                >
                  Change Password
                </motion.button>
              </div>
              <br />
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChangePassowrd;
