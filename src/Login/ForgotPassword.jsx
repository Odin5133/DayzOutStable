import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import {
  IconCircleDashedCheck,
  IconProgressX,
  IconSquareRoundedXFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import clsx from "clsx";
import { toast } from "react-hot-toast";

function ForgotPassword({ forgotpassword }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassSet, setNewPassSet] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    minValueValidation: false,
    numberValidation: false,
    capitalLetterValidation: false,
    specialCharacterValidation: false,
  });
  const [newPassMatch, setNewPassMatch] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  useEffect(() => {
    if (confirmPassword.length > 3) {
      if (password === confirmPassword) {
        setNewPassMatch(true);
      } else {
        setNewPassMatch(false);
      }
    }
  }, [confirmPassword]);

  const nextStep = () => setStep((prev) => prev + 1);

  const handleEmailSubmit = (e) => {
    // nextStep();
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/password_reset/", {
        email: email,
      })
      .then((res) => {
        console.log(res.data);
        nextStep();
        setInvalidCredentials(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.email) {
          setInvalidCredentials(true);
        }
      });
  };

  const handleOtpSubmit = (e) => {
    // nextStep();
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/password_reset/validate_token/", {
        token: otp,
      })
      .then((res) => {
        setInvalidCredentials(false);
        console.log(res.data);
        nextStep();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.detail) {
          setInvalidCredentials(true);
        }
      });
  };

  const handleNewPasswordSubmit = (e) => {
    // forgotpassword(0);
    e.preventDefault();
    if (newPassSet && newPassMatch) {
      console.log(otp, password);
      axios
        .post("http://127.0.0.1:8000/api/password_reset/confirm/", {
          token: otp,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          toast(
            <span className="flex text-[#3fb041]  gap-1 items-center">
              <IconCircleCheckFilled className="text-[#41b743] " size={19} />
              Password Changed Successfully!
            </span>
          );
          forgotpassword(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //   useEffect(() => {
  //     if (otp.length === 8) {
  //       handleOtpSubmit();
  //     }
  //   }, [otp]);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    const newErrors = {
      minValueValidation: password.length >= 8,
      numberValidation: /\d/.test(password),
      capitalLetterValidation: /[A-Z]/.test(password),
      specialCharacterValidation: /[^A-Za-z0-9]/.test(password),
    };

    setErrors(newErrors);

    const allValid = Object.values(newErrors).every((isValid) => isValid);
    setNewPassSet(allValid);
    // console.log(allValid);
  };

  return (
    <div className="mt-10 text-text">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Enter Your Email</h2>
            <div className="flex mt-2 justify-between items-center w-full">
              <input
                type="email"
                value={email}
                className="rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="zaikuno@gmail.com"
              />
              {invalidCredentials && (
                <IconSquareRoundedXFilled
                  height={40}
                  className="mx-2 m-0 text-[#ff2d2d]"
                />
              )}
            </div>
            <div>
              <button
                className="mt-6 rounded-lg bg-accent px-4 py-1 text-xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                onClick={handleEmailSubmit}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Step 2: Enter OTP</h2>
            <div className="flex mt-2 justify-between items-center w-full">
              <input
                type="text"
                value={otp}
                className="rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              {invalidCredentials && (
                <IconSquareRoundedXFilled
                  height={40}
                  className="mx-2 m-0 text-[#ff2d2d]"
                />
              )}
            </div>
            <div className="flex justify-between mt-6 w-[90%]">
              <button
                className="rounded-lg bg-accent px-4 py-1 text-xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                onClick={handleOtpSubmit}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg">Enter New Password</h2>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className=" mt-2 rounded-md px-2 py-1 w-[97%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
            />

            {Object.entries(errors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1 my-3">
                {value ? (
                  <IconCircleDashedCheck className="w-4 h-auto  text-[#19ee20]" />
                ) : (
                  <IconProgressX className="w-4 h-auto text-[#ed5959]" />
                )}
                <p
                  className={`text-base ${
                    value ? "text-green-500" : "text-red-500"
                  } leading-tight`}
                >
                  {key === "minValueValidation" &&
                    "Password must be at least 8 Characters"}
                  {key === "numberValidation" &&
                    "Password must have at least one Number"}
                  {key === "capitalLetterValidation" &&
                    "Password must have at least one Capital Letter"}
                  {key === "specialCharacterValidation" &&
                    "Password must have at least one Special Character"}
                </p>
              </div>
            ))}
            <h2 className="mt-8 text-lg">Confirm New Password</h2>
            <input
              type="password"
              value={confirmPassword}
              className={clsx(
                "mt-2 rounded-md px-2 py-1 w-[97%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent",
                !newPassSet &&
                  "border-pseudobackground2 cursor-not-allowed focus:border-pseudobackground2"
              )}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {!newPassMatch && confirmPassword.length > 3 && (
              <span className="text-[#ff3838]">Passwords do not match</span>
            )}
            <div className="flex justify-between mt-6 w-[90%]">
              <motion.button
                className={clsx(
                  "mt-8 rounded-lg px-4 py-1 text-lg   text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent duration-300",
                  newPassSet && newPassMatch
                    ? "bg-accent "
                    : "bg-pseudobackground2 cursor-not-allowed"
                )}
                onClick={handleNewPasswordSubmit}
                initial={{ y: "170%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 29 }}
              >
                Reset Password
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ForgotPassword;
