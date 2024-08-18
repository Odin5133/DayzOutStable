import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

function EditEmail() {
  const [chngemail, setemail] = useState(false);

  // Debugging log to check re-renders
  console.log("EditEmail component re-rendered");

  return (
    <div className="rounded-xl bg-pseudobackground mt-4 py-2 duration-200">
      <div className="mx-[3vw] flex justify-between">
        <div className="mt-4  text-[2rem] tracking-wider font-semibold leading-9">
          Email
        </div>
        <AnimatePresence>
          {!chngemail && (
            <motion.button
              className={clsx(
                "bg-[#d44444] text-text rounded-md px-4 py-1 mt-4 duration-200",
                chngemail ? " opacity-0" : "opacity-100"
              )}
              onClick={() => setemail(true)}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Change Email
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <hr className="mx-[3vw] border-[#899bad] mt-4" />

      {!chngemail ? (
        <div className="mx-[3vw] mt-2 ">
          Strengthen your account by ensuring your password is strong.
        </div>
      ) : (
        <div>
          <form className="mx-[3vw] mt-4"></form>
        </div>
      )}
    </div>
  );
}

export default EditEmail;
