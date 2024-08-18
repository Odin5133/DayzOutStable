import React, { useState, useEffect, useRef } from "react";
import Temp from "/back1.jpg";
import {
  IconArrowBigUpLine,
  IconArrowBigDownLine,
  IconArrowBigDownLineFilled,
  IconArrowBigUpLineFilled,
  IconBookmarks,
  IconBookmarksFilled,
} from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

// Posttemplate.jsx
function Posttemplate({ post }) {
  const [imageSrc, setImageSrc] = useState(Temp);
  const [liked, setLiked] = useState(post.userReacted === 1 ? true : false);
  const [animate, setAnimate] = useState(false);
  const [disliked, setDisliked] = useState(
    post.userReacted === 2 ? true : false
  );
  const [dislikeAnimate, setDislikeAnimate] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [dislikeCount, setDislikeCount] = useState(post.dislikesCount);
  const [bookmarked, setBookmarked] = useState(false);
  const [time, setTime] = useState(0);
  var date1 = new Date();
  var date2 = new Date(post.created_at);
  // console.log(post);

  const likePost = (flag) => {
    console.log(flag, post.id);
    axios
      .post(
        "http://127.0.0.1:8000/api/likePost/",
        { addORremove: flag, postID: post.id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  const DislikePost = (flag) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/dislikePost/",
        { addORremove: flag, postID: post.id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  const loadImage = () => {
    setImageSrc(post.image);
  };

  const toggleLike = () => {
    // console.log(likeCount);
    if (liked) {
      setLikeCount(likeCount - 1);
      likePost(false);
    } else {
      setLikeCount(likeCount + 1);
      likePost(true);
    }
    setLiked(!liked);
    if (disliked) {
      setDisliked(false);
      setDislikeCount(dislikeCount - 1);
      DislikePost(false);
    }
    // console.log(likeCount);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500); // Reset animation to allow re-triggering
  };

  const toggleDislike = () => {
    if (disliked) {
      setDislikeCount(dislikeCount - 1);
      DislikePost(false);
    } else {
      setDislikeCount(dislikeCount + 1);
      DislikePost(true);
    }

    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
      likePost(false);
    }
    setDislikeAnimate(true);
    setTimeout(() => setDislikeAnimate(false), 500); // Reset animation to allow re-triggering
  };

  function interval(date1, date2) {
    if (date1 > date2) {
      // swap
      var result = interval(date2, date1);
      result.years = -result.years;
      result.months = -result.months;
      result.days = -result.days;
      result.hours = -result.hours;
      return result;
    }
    var result = {
      years: date2.getFullYear() - date1.getFullYear(),
      months: date2.getMonth() - date1.getMonth(),
      days: date2.getDate() - date1.getDate(),
      hours: date2.getHours() - date1.getHours(),
    };
    if (result.hours < 0) {
      result.days--;
      result.hours += 24;
    }
    if (result.days < 0) {
      result.months--;
      // days = days left in date1's month,
      // plus days that have passed in date2's month
      var copy1 = new Date(date1.getTime());
      copy1.setMonth(copy1.getMonth() + 1);
      copy1.setDate(0); // last day of the previous month
      result.days = copy1.getDate() - date1.getDate() + date2.getDate();
    }
    if (result.months < 0) {
      result.years--;
      result.months += 12;
    }
    // console.log(result);
    return result;
  }
  useEffect(() => setTime(interval(date2, date1)), []);

  return (
    <div className="  pt-4 w-[90vw] border-t border-b border rounded-lg mt-4 bg-pseudobackground md:w-[40vw] lg:w-[40w]">
      <div className="flex w-full justify-between px-8">
        <Link to={`profile/${post.username}`} className=" flex items-center ">
          <img
            src={post.userpic}
            className="h-6 rounded-full aspect-square object-cover"
          />
          <span className="ml-2 underline text-[0.9rem]">{`/${post.username}`}</span>
        </Link>
        <div>
          {time.years !== 0
            ? `~${time.years} years ago`
            : time.months !== 0
            ? `~${time.months} months ago`
            : time.days !== 0
            ? `~${time.days} days ago`
            : `~${time.hours} hours ago`}
        </div>
      </div>
      <h2 className=" text-2xl tracking-wide  px-8 text-bold">{post.title}</h2>
      {post.image && (
        <div className="mt-1 mx-8 flex justify-center bg-[#22272b] rounded-xl">
          <img
            src={imageSrc}
            alt={post.title}
            onLoad={loadImage}
            data-src={post.image}
            className="rounded-sm"
          />
        </div>
      )}
      {post.body && (
        <p className=" text-[#899bad]  text-[0.95rem] mt-1 px-8">{post.body}</p>
      )}
      <div className="flex px-8 justify-between mb-4 mt-[10px] ">
        <div className="flex items-center">
          <div className="border bg-slate-500 flex rounded-[10px] py-1 px-2">
            <div className="">
              {liked ? (
                <IconArrowBigUpLineFilled
                  onClick={toggleLike}
                  color="#8220e1"
                  className={`${animate ? "animate-like" : ""} cursor-pointer`}
                />
              ) : (
                <IconArrowBigUpLine
                  onClick={toggleLike}
                  className={`${animate ? "animate-like" : ""} cursor-pointer`}
                />
              )}
            </div>
            {likeCount}
            <div className=" ml-2 flex">
              <div className="">
                {disliked ? (
                  <IconArrowBigDownLineFilled
                    onClick={toggleDislike}
                    color="#899bad"
                    className={`${
                      dislikeAnimate ? "animate-dislike" : ""
                    } cursor-pointer`}
                  />
                ) : (
                  <IconArrowBigDownLine
                    onClick={toggleDislike}
                    className={`${
                      dislikeAnimate ? "animate-dislike" : ""
                    } cursor-pointer`}
                  />
                )}
              </div>
              {dislikeCount}
            </div>
          </div>
          <div className="ml-4">
            {bookmarked ? (
              <IconBookmarksFilled
                onClick={() => setBookmarked(!bookmarked)}
                className="cursor-pointer active:scale-105 duration-75"
              />
            ) : (
              <IconBookmarks
                onClick={() => setBookmarked(!bookmarked)}
                className="cursor-pointer active:scale-110 duration-75"
              />
            )}
            {/* <IconBookmarks/> */}
          </div>
        </div>
        <div className="flex items-center">
          <div>Report</div>
        </div>
      </div>
    </div>
  );
}

export default Posttemplate;
