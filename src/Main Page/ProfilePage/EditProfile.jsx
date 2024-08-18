import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useOutletContext } from "react-router-dom";
import { IconMoodPuzzled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import ChangePassowrd from "./ChangePassowrd";
import EditEmail from "./EditEmail";

function EditProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [uname, setUname] = useState("");
  const [bio, setBio] = useState("");
  const { username } = useParams();
  const [uProfilePic, setUProfilePic] = useState(null);
  const ProfilePicRef = useRef(null);
  const BannerPicRef = useRef(null);
  const [uBanner, setUBanner] = useState(null);
  const [picchanged, setPicChanged] = useState(false);
  const [bannerChanged, setBannerChanged] = useState(false);
  const { setProfilePic } = useOutletContext();

  useEffect(() => {
    console.log(localStorage.getItem("token"), username);
    const fetchData = async () => {
      axios
        .post(
          "http://127.0.0.1:8000/api/profile/",
          {
            user2: username,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
          setUname(res.data.username);
          setBio(res.data.bio);
          setUProfilePic(res.data.profilePic);
          setUBanner(res.data.profileBanner);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
    fetchData();
  }, [username]);

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

    let file = new File([blob], "uploaded_image.jpg", { type: mimeType });
    return file;
  };

  const handleBannerSave = () => {
    if (bannerChanged) {
      const formData = new FormData();
      let file = processImg(uBanner);
      formData.append("profileBanner", file);
      axios
        .post("http://127.0.0.1:8000/api/editProfileBanner/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setBannerChanged(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleProfilePicSave = () => {
    if (picchanged) {
      const formData = new FormData();
      let file = processImg(uProfilePic);
      formData.append("profilePic", file);
      axios
        .post("http://127.0.0.1:8000/api/editProfilePic/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setPicChanged(false);
          setProfilePic(uProfilePic);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleProfileDataSave = (e) => {
    e.preventDefault();
    if (uname !== user.username) {
      axios
        .post(
          "http://127.0.0.1:8000/api/editUsername/",
          { username: uname },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
    if (bio !== user.bio) {
      axios
        .post(
          "http://127.0.0.1:8000/api/editProfileBio/",
          { bio: bio },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
  };

  const handleButtonClick = () => {
    ProfilePicRef.current.click();
  };

  const handleBannerButtonClick = () => {
    BannerPicRef.current.click();
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
      setPicChanged(true);
    } else {
      alert("Please select a JPEG image.");
    }
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUBanner(reader.result);
      };
      reader.readAsDataURL(file);
      setBannerChanged(true);
    } else {
      alert("Please select a JPEG image.");
    }
  };

  return (
    <div className="text-text w-[90vw] md:w-[45vw] lg:w-[45w] font-heading min-h-[80vh] flex flex-col mt-8 mb-4">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          Loading...
        </div>
      ) : Object.hasOwn(user, "message") === false ? (
        <div className=" ">
          <div className="w-full flex justify-center flex-col bg-pseudobackground rounded-xl ">
            <img
              src={uBanner}
              alt="Profile Banner"
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="w-full flex justify-between p-4">
              <div className="flex ml-[1vw]">
                <img
                  src={uProfilePic}
                  alt="Profile Pic"
                  className="rounded-full border-4 border-[#000] shadow-lg h-32 w-32 -mt-16 mb-4 object-cover"
                />
              </div>
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="flex -my-4">
                    <input
                      type="file"
                      ref={BannerPicRef}
                      style={{ display: "none" }}
                      accept="image/jpeg"
                      onChange={handleBannerChange}
                    />
                    <button
                      type="button"
                      className="border-text border rounded-lg px-4 mr-4  my-2 active:scale-95 hover:bg-text hover:text-[#000] duration-200"
                      onClick={handleBannerButtonClick}
                    >
                      Upload Banner
                    </button>
                    <button
                      className={clsx(
                        "border-text border rounded-lg px-4 py-1 my-2 active:scale-95 text-background duration-200",
                        bannerChanged
                          ? "bg-text active:scale-95 "
                          : "bg-pseudobackground2 cursor-not-allowed text-text"
                      )}
                      onClick={handleBannerSave}
                    >
                      Save Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <h1 className="text-3xl font-semibold mx-[2vw] leading-9 -mt-4 text-primary md:3xl">
              Your Profile Pic
            </h1>
            <span className="mx-[2vw] my-1">
              This will be visible to everyone
            </span>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex mx-[2vw] my-2">
                <input
                  type="file"
                  ref={ProfilePicRef}
                  style={{ display: "none" }}
                  accept="image/jpeg"
                  onChange={handleProfilePicChange}
                />
                <button
                  type="button"
                  className="border-text border rounded-lg px-4 mr-4  my-2 active:scale-95 hover:bg-text hover:text-[#000] duration-200"
                  onClick={handleButtonClick}
                >
                  Upload Image
                </button>
                <button
                  className={clsx(
                    "border-text border rounded-lg px-4 py-1 my-2 active:scale-95 text-background duration-200",
                    picchanged
                      ? "bg-text active:scale-95 "
                      : "bg-pseudobackground2 cursor-not-allowed text-text"
                  )}
                  onClick={handleProfilePicSave}
                >
                  Save Image
                </button>
              </div>
            </form>
          </div>
          <div className="rounded-xl bg-pseudobackground mt-4 py-2">
            <div className="mt-4 ml-[3vw] text-[2rem] tracking-wider font-semibold leading-9">
              Edit Profile
            </div>
            <hr className="mx-[3vw] border-[#899bad] mt-4" />
            <div className=" mt-8 text-text ml-[3vw]">
              <form onSubmit={handleProfileDataSave}>
                <div className="">Username</div>
                <input
                  type="text"
                  className=" mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent"
                  // placeholder={user.username}
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                  required
                />
                <div className=" mt-8">Bio</div>
                <textarea
                  className="mt-2 rounded-md px-2 py-1 w-[90%] bg-background border-2 border-primary text-text focus:outline-none focus:border-accent h-32"
                  // placeholder={user.bio}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                />
                <br />
                <div className="w-[90%] flex justify-end">
                  <motion.button
                    className={clsx(
                      "mt-8 rounded-lg bg-accent px-4 py-1 text-xl   text-text hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                      uname === user.username && bio === user.bio
                        ? "cursor-not-allowed bg-pseudobackground2 text-text border-text border"
                        : "hover:bg-accent border-primary border"
                    )}
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                  >
                    Update Profile
                  </motion.button>
                </div>
                <br />
              </form>
            </div>
          </div>
          <EditEmail />
          <ChangePassowrd />
        </div>
      ) : (
        <div className="flex h-[80vh] w-full justify-center items-center flex-col">
          <IconMoodPuzzled size={160} />
          <span className="text-2xl mt-1">Profile not found</span>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
