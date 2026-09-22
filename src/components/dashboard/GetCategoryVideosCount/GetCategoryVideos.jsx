import React, { useEffect, useState } from "react";

const GetCategoryVideos = ({ title }) => {
  const [count, setCount] = useState(0);
  const getVideos = async (title) => {
    try {
      const response = await fetch(
        `/api/admin/category-videos?title=${encodeURIComponent(title)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      data ? setCount(data.data.length) : setCount(0);
    } catch (error) {
      console.error("Error fetching category videos:", error);
      return 0; // Return a fallback value in case of an error
    }
  };
  useEffect(() => {
    if (title) {
      getVideos(title);
    }
  }, [title]);
  return count;
};

export default GetCategoryVideos;
