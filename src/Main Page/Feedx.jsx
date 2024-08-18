import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Posttemplate from "./Posttemplate";
import Cookies from "js-cookie";
import { IconGhost2Filled } from "@tabler/icons-react";

function Feedx() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [endOfFeed, setEndOfFeed] = useState(false);
  const observer = useRef(null);
  const bottomRef = useRef(null);

  const fetchData = (page) => {
    setLoading(true);
    axios
      .post(
        "http://127.0.0.1:8000/api/feed/",
        {
          skip: page * 10,
          limit: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.length === 0) {
          setEndOfFeed(true);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...res.data]);
        }
        console.log("Fetched data:", res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const options = {
      root: null, // observing changes in the viewport
      rootMargin: "0px",
      threshold: 0.1, // trigger callback when 10% of the element is visible
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Bottom reached, fetching more data...");
          setPage((prevPage) => prevPage + 1);
        }
      });
    }, options);

    if (bottomRef.current) {
      observer.current.observe(bottomRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center text-text font-body w-[45vw] relative">
      {posts.map((post, i) => (
        <Posttemplate key={i} post={post} />
      ))}
      {loading && <div>Loading...</div>}
      <div ref={bottomRef} style={{ height: "1px" }}></div>
      {!loading && posts.length === 0 && <EmptyFeed />}
      {endOfFeed && posts.length !== 0 && (
        <div>You have reached the end of the feed</div>
      )}
    </div>
  );
}

const EmptyFeed = () => {
  return (
    <div className="rounded-xl pt-4 w-[90vw]  mt-8 bg-pseudobackground md:w-[45vw] lg:w-[45vw] font-body min-h-[80vh] flex flex-col justify-evenly items-center ">
      <div>
        <IconGhost2Filled size={200} className=" text-background" />
        <div className="mt-4 font-semibold text-pseudobackground2 text-base text-center">
          Your Feed looks....... empty{" "}
        </div>
      </div>
      <div className="mt-2 px-10 text-xl text-center ">
        Follow some people or join some communities to see posts here
      </div>
    </div>
  );
};

export default Feedx;
