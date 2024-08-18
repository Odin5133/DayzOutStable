// import React from "react";
import React, { useState, useEffect } from "react";
import MyDropzone from "./NewPostComponents/Dropzone";
import clsx from "clsx";
import axios from "axios";
import Cookies from "js-cookie";
// import { Bounce, ToastContainer, toast } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import {
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
// import { Toaster } from "react-hot-toast";

function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dataURL, setDataURL] = useState(null);
  const [category, setCategory] = useState("");

  const submitPost = (e) => {
    e.preventDefault();

    let file = null;

    const processImg = (image) => {
      const matches = image.match(/^data:(.*);base64,(.*)$/);
      if (!matches || matches.length !== 3) {
        console.error("Invalid base64 data URL");
        return;
      }
      const mimeType = matches[1];
      const base64Data = matches[2];

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      file = new File([blob], "uploaded_image.jpg", { type: mimeType });
    };

    if (dataURL) {
      processImg(dataURL);
    }

    const formData = new FormData();
    formData.append("title", title);
    if (content === "") {
      formData.append("body", " ");
    } else formData.append("body", content);
    if (file) {
      formData.append("image", file);
    }

    // var user_id;
    // axios
    //   .get("http://127.0.0.1:8000/api/user/", {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     formData.append("user", res.data.id);
    //     console.log(res.data.id);
    //   });

    axios
      .post("http://127.0.0.1:8000/api/createPost/", formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast(
          <span className="flex text-[#3fb041]  gap-1 items-center">
            <IconCircleCheckFilled className="text-[#41b743] " size={19} />
            New Post Created!
          </span>
        );

        setTitle("");
        setContent("");
        setDataURL(null);
      })
      .catch((error) => {
        console.error(error);
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
    // axios
    //   .post(
    //     "http://127.0.0.1:8000/api/createPost/",
    //     {
    //       title: title,
    //       body: content,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     toast(
    //       <span className="flex text-[#3fb041]  gap-1 items-center">
    //         <IconCircleCheckFilled className="text-[#41b743] " size={19} />
    //         New Post Created!
    //       </span>
    //     );

    //     setTitle("");
    //     setContent("");
    //     setDataURL(null);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     toast(
    //       <span className="flex text-[#b03f3f]  gap-1 items-center">
    //         <IconExclamationCircleFilled
    //           className="text-[#b74141] "
    //           size={19}
    //         />
    //         An error occured
    //       </span>
    //     );
    //   });
  };

  return (
    <div className="text-xl text-text flex flex-col font-body    bg-pseudobackground border border-accent rounded-xl shadow-lg max-h-full p-6 mb-4 mt-8 md:w-[45vw] lg:w-[45w] w-[90w]">
      <div className="mb-2">
        {/* <h1 className="text-4xl font-semibold mb-4">New Post</h1> */}
        <form className="flex flex-col gap-2">
          <label htmlFor="title" className="text-2xl">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Something catchy..."
            required
            className={clsx(
              "py-1 px-2 rounded-md focus:outline-none border-solid focus:border-accent border-2 border-pseudobackground2 mb-4 text-lg",
              title === "" ? "bg-pseudobackground" : "bg-[#3f484e]"
            )}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="content" className="text-2xl">
            Content
          </label>
          <textarea
            id="content"
            className={clsx(
              "py-1 px-2 border-pseudobackground2 rounded-md focus:outline-none border-solid focus:border-accent border-2   opacity-95 h-32 mb-4 text-lg",
              // content === "" ? "bg-pseudobackground" : "bg-pseudobackground2"
              content === "" ? "bg-pseudobackground" : "bg-[#3f484e]"
            )}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="text-2xl">Image/Video</div>
          <MyDropzone dataURL={dataURL} setDataURL={setDataURL} />
          <div className="flex justify-between mt-4 items-end flex-col lg:flex-row ">
            <div className="flex  gap-4 flex-col justify-center w-full">
              <div className="flex  gap-6">
                <label htmlFor="category" className="text-2xl">
                  Community :
                </label>
                <select
                  id="category"
                  className="rounded-md py-1 px-2 -ml-5 focus:outline-none border-solid focus:border-accent border-2 border-pseudobackground bg-[#3f484e] text-base text-text "
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="1">General</option>
                  <option value="2">Technology</option>
                  <option value="3">Science</option>
                  <option value="4">Sports</option>
                  <option value="5">Entertainment</option>
                  <option value="6">Politics</option>
                </select>
              </div>
              <div className="flex  gap-4 h-full items-center">
                <span className="text-2xl">NSFW : </span>

                <input
                  type="checkbox"
                  id="nsfw"
                  name="nsfw"
                  className="w-9 h-7 -ml-4  rounded-xl bg-background"
                />
              </div>
            </div>

            {/* <button
              type="submit"
              className=" rounded-lg bg-accent px-12 text-2xl border-2 border-primary text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mx-auto lg:mx-0 mt-4 lg:mt-0"
              onClick={submitPost}
              {...(title === "" ? { disabled: true } : {})}
            >
              Post
            </button> */}
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: title !== "" ? 1.02 : 1 }}
              whileTap={{ scale: title !== "" ? 0.9 : 1 }}
              type="submit"
              className={clsx(
                "relative rounded-lg px-5 py-2.5 overflow-hidden group   transition-all ease-out duration-300",
                title === ""
                  ? "cursor-not-allowed bg-[#360d60]"
                  : "bg-accent2 cursor-pointer hover:bg-gradient-to-r hover:from-accent2 hover:to-accent text-text hover:ring-2 hover:ring-offset-1 hover:ring-accent"
              )}
              onClick={submitPost}
              {...(title === "" ? { disabled: true } : {})}
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-text opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative px-6 w-full flex justify-center text-xl tracking-widest">
                Post
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPost;
