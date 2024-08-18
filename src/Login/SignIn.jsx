import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import ForgotPassword from "./ForgotPassword";
// import { Navigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signOps, setSignOps] = useState(1);
  const [usernameSignUp, setUsernameSignUp] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [forgotpassword, setForgotPassword] = useState(false);
  const Navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChangeSignUp = (e) => {
    setUsernameSignUp(e.target.value);
  };

  const handleEmailChangeSignUp = (e) => {
    setEmailSignUp(e.target.value);
  };

  const handlePasswordChangeSignUp = (e) => {
    setPasswordSignUp(e.target.value);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (emailSignUp == "" || passwordSignUp == "") {
      alert("Please fill all the fields");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/api/register/", {
        username: usernameSignUp,
        email: emailSignUp,
        password: passwordSignUp,
      })
      .then((res) => {
        console.log(res.data);
        toast(
          <span className="flex text-[#3fb041]  gap-1 items-center">
            <IconCircleCheckFilled className="text-[#41b743] " size={19} />
            New Account Created!
          </span>
        );
        setUsernameSignUp("");
        setEmailSignUp("");
        setPasswordSignUp("");
        setSignOps(1);
        setInvalidCredentials(false);
      })
      .catch((err) => {
        console.log(err);
        toast(
          <span className="flex text-[#b03f3f]  gap-1 items-center">
            <IconExclamationCircleFilled
              className="text-[#b74141] "
              size={19}
            />
            An error occured
          </span>
        );
      });
  };

  useEffect(() => {
    console.log(`Bearer ${Cookies.get("accessToken")}`);
    if (Cookies.get("accessToken") !== undefined) {
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
          Navigate("/feed");
          return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) =>
          console.error(
            "There has been a problem with your fetch operation:",
            error
          )
        );
    }
  }, []);

  useEffect(() => {
    createAccessToken();
  }, []);

  const createAccessToken = () => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      credentials: "include", // Necessary for cookies to be sent with requests
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.hasOwnProperty("token")) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data["token"]}`;
          navigate("/feed");
        } else {
          setInvalidCredentials(true);
          setUsername("");
          setPassword("");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
    createAccessToken();
  };

  const test = (e) => {
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
        console.log("Yippee ki-yay, mother");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="bg-signinbg bg-no-repeat bg-cover p-[1vh] m-0 h-screen flex justify-center md:justify-start sm:p-[1vh]">
        <div className="md:w-[37vw] bg-pseudobackground bg-opacity-70 backdrop-blur-lg rounded-xl font-heading">
          <AnimatePresence>
            {!forgotpassword && (
              <motion.div
                className="mx-8 flex flex-col justify-center h-full"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="      text-5xl  text-primary leading-[0.9]">
                  {signOps ? "Welcome Back" : "Let's Get Started"}
                </div>
                <div className="text-secondary text-xl">
                  {signOps
                    ? "Dive into your personalized haven"
                    : "Ready for a new chapter!"}
                </div>
                <div className="flex  rounded-md mt-12 gap-2 w-[90%] justify-around px-2 relative items-center text-xl text-text border-primary border-2">
                  <motion.div
                    className=" absolute w-[49%] rounded-md h-[calc(100%-5px)]  bg-accent "
                    initial={{ x: "-50%" }}
                    animate={{ x: signOps ? "-50%" : "50%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 29 }}
                  />
                  <div
                    className="z-10 w-full flex justify-center cursor-pointer"
                    onClick={() => {
                      setSignOps(1);
                      setInvalidCredentials(false);
                    }}
                  >
                    Sign In
                  </div>
                  <div
                    className="z-10 w-full flex justify-center cursor-pointer"
                    onClick={() => {
                      setSignOps(0);
                      setInvalidCredentials(false);
                    }}
                  >
                    Sign Up
                  </div>
                </div>
                {signOps ? (
                  <div className=" mt-10 text-text">
                    <form onSubmit={handleSignIn}>
                      <div className="">Username / E-Mail</div>
                      <div className="flex mt-2  items-center w-full">
                        <input
                          type="text"
                          className="  rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                          placeholder="InvincibleMe3"
                          value={username}
                          onChange={handleUsernameChange}
                          required
                        />
                        {invalidCredentials && (
                          <IconSquareRoundedXFilled
                            height={40}
                            className="mx-2 m-0 text-[#ff2d2d]"
                          />
                        )}
                      </div>
                      <div className=" mt-8">Password</div>
                      <div className="flex mt-2 items-center w-full">
                        <input
                          type="password"
                          className=" rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                          placeholder="SuperSecretPassword123"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        {invalidCredentials && (
                          <IconSquareRoundedXFilled
                            height={40}
                            className="mx-2 m-0 text-[#ff2d2d]"
                          />
                        )}
                      </div>
                      <div className="mt-12 w-[90%] flex justify-between items-center">
                        <motion.button
                          className=" rounded-lg bg-accent px-4 py-1 text-xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          type="submit"
                          initial={{ y: "170%" }}
                          animate={{ y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 29,
                          }}
                        >
                          Sign In
                        </motion.button>
                        <span
                          className="underline text-[#808080] tracking-wide cursor-pointer"
                          onClick={() => {
                            setForgotPassword(1);
                          }}
                        >
                          Forgot Password?
                        </span>
                      </div>
                      <br />
                    </form>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp}>
                    <div className=" mt-10 text-text">
                      <div className="">Username</div>
                      <input
                        type="text"
                        className=" mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                        placeholder="Username"
                        value={usernameSignUp}
                        onChange={handleUsernameChangeSignUp}
                      />
                      <div className=" mt-8">E-Mail</div>
                      <input
                        type="text"
                        className=" mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                        placeholder="Email"
                        value={emailSignUp}
                        onChange={handleEmailChangeSignUp}
                      />
                      <motion.div
                        className=" mt-8"
                        initial={{ y: "-170%" }}
                        animate={{ y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 29,
                        }}
                      >
                        Password
                      </motion.div>
                      <motion.input
                        type="password"
                        className="mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                        placeholder="Password"
                        value={passwordSignUp}
                        onChange={handlePasswordChangeSignUp}
                        initial={{ y: "-170%" }}
                        animate={{ y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 29,
                        }}
                      />
                      <br />
                      <div className="flex w-full  justify-center md:justify-start">
                        <motion.button
                          initial={{ y: "-170%" }}
                          animate={{ y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 29,
                          }}
                          className="mt-12 rounded-lg bg-accent px-4 py-1 text-xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent "
                          type="submit"
                        >
                          Sign Up
                        </motion.button>
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
            {forgotpassword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-8 flex flex-col justify-center h-full"
              >
                <div className="text-5xl  text-primary leading-[0.9]">
                  Reset Password
                </div>
                <div className="text-secondary text-xl">Catchy Phrase</div>
                <div className="mt-12">
                  <ForgotPassword forgotpassword={setForgotPassword} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default SignIn;
