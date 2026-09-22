"use client";
import useAuth from "@/contexts/auth/AuthProvider";
import React, { useEffect, useState } from "react";

const WishlistButton = ({ listed, type, id }) => {
  const { user } = useAuth();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (listed) {
      setChecked(listed);
    }
  }, [listed]);
  const wishlist = async () => {
    setChecked((prev) => !prev);
    setLoading(true);
    try {
      await fetch("/api/admin/wishlist", {
        method: "POST",
        body: JSON.stringify({
          [type == "model" ? "model" : "video"]: id,
          userId: user.userID,
        }),
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    user ?   <button
      className="hidden items-center font-satoshi bg-[#ff4040] uppercase group/btn justify-center text-white text-sm font-medium pr-4 pl-2 py-1 min-h-[36px]
  transition-all duration-300 hover:bg-white hover:text-black
  "
      onClick={() => (loading ? "" : wishlist())}
    >
      {!checked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#fff"
          className="group-hover/btn:fill-[#000] transition-all duration-300"
        >
          <path d="M351.54-283.81 480-361.15l128.46 78.23-33.73-146.46 113.46-97.85-149.07-13.5L480-679.19 421.27-541.1l-149.08 12.87 113.46 98.35-34.11 146.07Zm-56.19 77.66 49.11-210.15-163.08-140.93 214.66-18.73L480-773.89l84.35 197.93 214.27 18.73L615.53-416.3l49.46 210.15-184.82-111.7-184.82 111.7ZM480-470.62Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#fff"
          className="group-hover/btn:fill-[#000] transition-all duration-300"
        >
          <path d="m295.35-206.15 49.11-210.15-163.08-140.93 214.66-18.73L480-773.89l84.35 197.93 214.27 18.73L615.53-416.3l49.46 210.15-184.82-111.7-184.82 111.7Z" />
        </svg>
      )}
      {checked
        ? "Remove From Favorites"
        : loading
        ? "Adding to Favorites"
        : "Add to Favorites"}
    </button> : ''
  );
};

export default WishlistButton;
