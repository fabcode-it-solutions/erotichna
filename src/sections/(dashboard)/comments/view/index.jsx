"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Pagination from "@/components/global/pagination/Pagination";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { GetCreatedAt } from "@/utils/GetCreatedAt";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Index = () => {
  const { comments, getComments } = useAdmin();
  const limit = 6;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const getIndex = (e) => {
    setIndex(e);
  };

  useEffect(() => {
    setCount(Math.ceil(comments.length / limit));
  }, [comments]);
  useEffect(() => {
    getComments();
  }, []);
  const trashCategory = async (_id) => {
    const text = "Are you sure?\n You want to delete the comment.";
    if (confirm(text) == true) {
      try {
        const response = await fetch("/api/admin/comments", {
          method: "DELETE",
          body: JSON.stringify({ _id }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          getComments();
        }
      } catch (error) {
      } finally {
      }
    }
  };
  const changeStatus = async (status, _id) => {
    const text = "Are you sure?\n You want to change the status.";
    if (confirm(text) == true) {
      try {
        const response = await fetch("/api/admin/comments", {
          method: "PUT",
          body: JSON.stringify({ status, _id, type: "status" }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          getComments();
        }
      } catch (error) {
      } finally {
      }
    }
  };
  return (
    <div>
      <HeaderHeading
        description="Manage Comments Here."
        title="Comments"
        notification={false}
        home={true}
        search={true}
      />
      <MobileHeader heading="Comments" />
      <div className=" mt-8 max-md-tab:block hidden">
        {comments?.length > 0 && (
          <div>
            {comments.map((item, i) => (
              <div key={i} className="bg-white border-stroke p-3 rounded-lg">
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  <strong> Comment: </strong>{" "}
                  {item?.comment ? item?.comment.slice(0, 100) + "..." : "-"}
                </div>

                <div className="flex items-center gap-2 my-2">
                  <div className="text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    <strong> On Post: </strong>
                    <Link
                      href={`/videos/${item.post.link}`}
                      className="border-b border-black"
                    >
                      {item?.post.title}
                    </Link>
                  </div>
                  <div className=" text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                    <strong> Submitted On:</strong>{" "}
                    {GetCreatedAt(item?.createdAt, true)}
                  </div>
                </div>
                <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                  <Link
                    href={`/dashboard/comments/edit/${item?._id}`}
                    className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                  >
                    Edit
                  </Link>
                  <div className="w-[1px] h-3 bg-text-secondary"></div>
                  <button
                    onClick={() => trashCategory(item?._id)}
                    className="text-sm font-medium font-satoshi leading-6 relative   text-red-500"
                  >
                    Delete
                  </button>
                  <div className="w-[1px] h-3 bg-text-secondary "></div>
                  <button
                    onClick={() =>
                      changeStatus(
                        item?.status === "active" ? "draft" : "active",
                        item?._id
                      )
                    }
                    className="text-sm  font-medium font-satoshi leading-6 relative   text-[#151516]"
                  >
                    {item?.status === "active"
                      ? "Draft Comment"
                      : "Make Comment Active"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 mt-8 max-md-tab:hidden">
        {comments?.length > 0 && (
          <ul className="flex bg-warm p-2">
            <li className="w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              S.no
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Author
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Comment
            </li>
            <li className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              On Post
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative text-center  text-[#151516] ">
              Likes / Dislikes
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative text-right  text-[#151516] ">
              Submitted On
            </li>
          </ul>
        )}
        {comments?.length > 0 && (
          <ul className="border-x border-warm border-b">
            {comments.map((item, i) => (
              <li className={`flex p-2 ${i % 2 == 1 ? "bg-warm" : ""}`} key={i}>
                <div className="capitalize w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="capitalize text-sm font-bold font-satoshi leading-6 relative   text-[#151516]">
                    {item?.author.name}
                  </div>
                  <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                    <Link
                      href={`/dashboard/comments/edit/${item?._id}`}
                      className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                    >
                      Edit
                    </Link>
                    <div className="w-[1px] h-3 bg-text-secondary"></div>
                    <button
                      onClick={() => trashCategory(item?._id)}
                      className="text-sm font-medium font-satoshi leading-6 relative   text-red-500"
                    >
                      Delete
                    </button>
                    <div className="w-[1px] h-3 bg-text-secondary "></div>
                    <button
                      onClick={() =>
                        changeStatus(
                          item?.status === "active" ? "draft" : "active",
                          item?._id
                        )
                      }
                      className="text-sm  font-medium font-satoshi leading-6 relative   text-[#151516]"
                    >
                      {item?.status === "active"
                        ? "Draft Comment"
                        : "Make Comment Active"}
                    </button>
                  </div>
                </div>
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  {item?.comment ? item?.comment.slice(0, 80) + "..." : "-"}
                </div>
                <div className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  <Link
                    href={`/videos/${item.post.link}`}
                    className="border-b border-black"
                  >
                    {item?.post.title}
                  </Link>
                </div>
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor="like">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000"
                        >
                          <path d="M698.46-160H306.15v-440l250.77-247.69 17.7 17.69q5.46 5.46 9.19 14 3.73 8.54 3.73 15.69v6.31l-40.92 194h268.76q25.08 0 44.85 19.77Q880-560.46 880-535.38v49.23q0 5.46-1.12 11.92-1.11 6.46-3.34 11.92L766.31-203.38q-8.23 18.46-27.69 30.92Q719.15-160 698.46-160ZM266.15-600v440H120v-440h146.15Z" />
                        </svg>
                      </label>

                      <span className="text-dark-150 text-xs">
                        {item.likes?.count || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="dislike">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000"
                        >
                          <path d="M261.54-767.69h392.31v440L403.08-80l-17.7-17.69q-5.46-5.46-9.19-14-3.73-8.54-3.73-15.69v-6.31l40.92-194H144.62q-25.08 0-44.85-19.77Q80-367.23 80-392.31v-49.23q0-5.46 1.12-11.92 1.11-6.46 3.34-11.92l109.23-258.93q8.23-18.46 27.69-30.92 19.47-12.46 40.16-12.46Zm432.31 440v-440H840v440H693.85Z" />
                        </svg>
                      </label>

                      <span className="text-dark-150 text-xs">
                        {item.dislikes?.count || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                  {GetCreatedAt(item?.createdAt, true)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {count > 1 && (
        <Wrapper className="mt-4">
          <Pagination
            count={count}
            getIndex={getIndex}
            index={index}
            visiblePages={4}
            dark={true}
          />
        </Wrapper>
      )}
    </div>
  );
};

export default Index;
