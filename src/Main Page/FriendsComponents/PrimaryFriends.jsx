import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function PrimaryComp({ curFriends }) {
  useEffect(() => {
    console.log(curFriends);
  }, []);

  return (
    <div className="h-[36vh] overflow-y-scroll no-scrollbar">
      {curFriends.map((x) => (
        <Link
          to={`profile/myfeed/${x.username}`}
          key={x.username}
          className="flex gap-2 border border-primary bg-background text-text p-2 m-2 rounded-xl overflow-hidden items-center"
        >
          <img
            src={x.userPic}
            alt={x.username}
            className="h-full rounded-full aspect-square object-cover w-10"
          />
          <div className="flex flex-col justify-center w-full overflow-hidden">
            <div className="font-body text-lg truncate">{`${x.username
              .charAt(0)
              .toUpperCase()}${x.username.slice(1)}`}</div>
            <div className="text-sm text-ellipsis truncate overflow-hidden">
              {x.bio}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PrimaryComp;
