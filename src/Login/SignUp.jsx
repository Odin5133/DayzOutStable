import React, { useState, useEffect } from "react";
import axios from "axios";

function SignUp() {
  const [usernameSignUp, setUsernameSignUp] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");

  const handleUsernameChangeSignUp = (e) => {
    setUsernameSignUp(e.target.value);
  };

  const handleEmailChangeSignUp = (e) => {
    setEmailSignUp(e.target.value);
  };

  const handlePasswordChangeSignUp = (e) => {
    setPasswordSignUp(e.target.value);
  };

  const handleSignUp = () => {
    if (email == "" || password == "") {
      alert("Please fill all the fields");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/api/register/", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div className=" w-2/5 h-[98vh]  bg-background rounded-xl font-heading ">
      <div className="ml-8">
        <div className="  pt-32  text-5xl  text-primary leading-[0.9]">
          Let's Get Started
        </div>
        <div className="text-secondary text-xl">Ready for a new chapter!</div>
        <div className=" mt-12 text-text">
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
          <div className=" mt-8">Password</div>
          <input
            type="password"
            className="mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
            placeholder="Password"
            value={passwordSignUp}
            onChange={handlePasswordChangeSignUp}
          />
          <br />
          <button
            className="mt-12 rounded-lg bg-accent px-4 py-1 text-xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
