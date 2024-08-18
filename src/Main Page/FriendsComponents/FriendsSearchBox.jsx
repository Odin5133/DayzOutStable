import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { IconInputSearch, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function FriendsSearchBox() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendObj, setFriendObj] = useState([]);
  const dropdownRef = useRef(null);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFriendObj([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFriendSearch = (e) => {
    setFriendName(e.target.value);
    if (e.target.value.length >= 3) {
      axios
        .post(
          "http://127.0.0.1:8000/api/searchUserDropdown/",
          {
            userField: e.target.value,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        )
        .then((response) => {
          setFriendObj(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFriendObj([]);
    }
  };

  return (
    <div className="relative flex items-center">
      <motion.span
        initial={{ x: 0 }}
        animate={isSearchVisible ? { x: -10 } : { x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="z-20"
      >
        <IconInputSearch
          className="cursor-pointer"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        />
      </motion.span>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={
          isSearchVisible
            ? { width: "auto", opacity: 1 }
            : { width: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`relative`}
      >
        <input
          type="text"
          placeholder="Search Friends"
          value={friendName}
          onChange={handleFriendSearch}
          className="w-full rounded-lg px-4 pr-12 bg-pseudobackground2 text-text placeholder-[#b9b9b9] py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-blue-500 transition duration-200 ease-in-out"
        />

        <span
          onClick={() => {
            setFriendName("");
            setFriendObj([]);
          }}
        >
          <IconX className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pseudobackground2 px-2 py-1 text-text cursor-pointer w-7" />
        </span>

        {friendObj.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 mt-2 bg-pseudobackground2 border border-[#9e9e9e] rounded-lg  z-10 overflow-hidden shadow-sm shadow-text"
          >
            {friendObj.map((friend, index) => (
              <Link
                to={`profile/myfeed/${friend.username}`}
                key={index}
                className="block px-4 py-2 hover:bg-pseudobackground bg-background cursor-pointer transition duration-200 ease-in-out"
                onClick={() => {
                  setFriendName("");
                  setFriendObj([]);
                }}
              >
                {`${friend.username
                  .charAt(0)
                  .toUpperCase()}${friend.username.slice(1)}`}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default FriendsSearchBox;
