/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { badWords } from "@/app/assets/data/Badwords";
import Pagination from "@/components/global/pagination/Pagination";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAuth from "@/contexts/auth/AuthProvider";
import { GetCreatedAt } from "@/utils/GetCreatedAt";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Comments = ({ id, post }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const limit = 6;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const getIndex = (e) => {
    setIndex(e);
  };
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        id: id,
        post: {
          title: post.title,
          link: post.link,
        },
        author: {
          name: user.username,
          email: user.email,
        },
        comment: "",
      }));
    }
  }, [user, post]);
  useEffect(() => {
    getComments();
  }, [id]);
  function getMatchingWords(paragraph, wordsArray) {
    const wordsInParagraph = paragraph.toLowerCase().split(/\W+/);
    return wordsArray.filter((word) =>
      wordsInParagraph.includes(word.toLowerCase())
    );
  }
  const addComment = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData?.comment) {
      setError("Please enter a comment.");
      return;
    }

    const matchedWords = getMatchingWords(formData?.comment, badWords);
    if (matchedWords.length > 0) {
      setError(
        `Please remove ${
          matchedWords.length == 1 ? "this word" : "these words"
        } from comment <b className="">${matchedWords.toString()}</b>.`
      );
      return;
    }
    setBtnLoading(true);
    try {
      const response = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data) {
        setBtnLoading(false);
        setFormData((prev) => ({
          ...prev,
          author: "",
          comment: "",
        }));
        getComments();
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };

  const getComments = async () => {
    try {
      const response = await fetch(`/api/admin/comments?id=${id}`);
      const data = await response.json();
      if (data) {
        setComments(data.data);
        setCount(Math.ceil(data.data.length / limit));
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };

  return (
    <div className="mt-8">
      <div className="relative bg-black h-[50px] flex items-center justify-center before:bg-white before:w-full before:absolute before:h-[1px] before:top-[23px]">
        <h2 className=" px-2.5 bg-black z-[1] relative mb-2xl:text-sm font-normal uppercase text-[25px] text-white leading-none ">
          All Comments ({comments.length || 0})
        </h2>
      </div>
      {user && user?.role != "customer" && (
        <div className="text-white mb-4">Add your comment</div>
      )}
      {user && user?.role != "customer" && (
        <form
          onSubmit={(e) => addComment(e)}
          className="flex items-start gap-3"
        >
          <div>
            <div className="bg-dark-150 p-4 rounded-md max-lg-mb:p-2">
              <Image
                width={30}
                unoptimized={true}
                height={30}
                className="invert brightness-0"
                src="/assets/images/user.png"
                alt="user"
              />
            </div>
          </div>
          <div className="flex items-end w-full gap-3 max-lg-mb:flex-wrap">
            <textarea
              required
              value={formData?.comment || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, comment: e.target.value }));
                if (e.target.value == "") {
                  setError("");
                } else {
                  const matchedWords = getMatchingWords(
                    e.target.value,
                    badWords
                  );
                  if (matchedWords.length > 0) {
                    setError(
                      `Please remove ${
                        matchedWords.length == 1 ? "this word" : "these words"
                      } from comment <b className="">${matchedWords.toString()}</b>.`
                    );
                  } else {
                    setError("");
                  }
                }
              }}
              placeholder="Add Comment"
              className="text-white p-3 rounded-md min-h-[60px] bg-dark-150 mt-0 text-xs leading-5 border border-white py-2.5  w-full pr-6 outline-0"
            ></textarea>
            <button
              type="submit"
              className={`bg-[#ff4040] uppercase max-lg-mb:w-full flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
       ${btnLoading ? "opacity-40 pointer-events-none" : ""} 
  `}
            >
              {btnLoading ? "Commenting" : "Comment"}
            </button>
          </div>
        </form>
      )}
      {error && (
        <div
          className="my-3 error"
          dangerouslySetInnerHTML={{ __html: error }}
        ></div>
      )}
      {((user && user?.role == "customer") || !user) && (
        <div className="flex justify-end mt-5">
          <Link
            href="/get-access"
            className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  "
          >
            Add Comment
          </Link>
        </div>
      )}
      <div
        className={` flex-col gap-3 ${
          comments.length > 0 ? "flex" : "hidden"
        } mt-5`}
      >
        {comments.length > 0 &&
          comments.map((item, i) => (
            <div className="" key={i}>
              <CommentItem item={item} user={user} getComments={getComments} />
            </div>
          ))}
      </div>
      {count > 1 && (
        <Wrapper className="mt-4">
          <Pagination
            count={count}
            getIndex={getIndex}
            index={index}
            visiblePages={4}
            dark={false}
          />
        </Wrapper>
      )}
    </div>
  );
};

export default Comments;

const CommentItem = ({ item, user, getComments }) => {
  const [like, setLike] = useState(false);
  const [dislike, setDisLike] = useState(false);
  const likeComment = async (id, likes, userID) => {
    try {
      const response = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "likes",
          likes: likes,
          userId: userID,
          _id: id,
        }),
      });
      const data = await response.json();
      if (data) {
        getComments();
      }
    } catch (error) {
    } finally {
    }
  };
  const dislikeComment = async (id, likes, userID) => {
    try {
      const response = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dislikes",
          dislikes: likes,
          userId: userID,
          _id: id,
        }),
      });
      const data = await response.json();
      if (data) {
        getComments();
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    setLike(item.likes?.userIds?.includes(user?.userID));
    setDisLike(item.dislikes?.userIds?.includes(user?.userID));
  }, [user, item]);
  return (
    <div className="bg-dark-100 p-4 rounded-md flex items-start gap-4">
      <div className="max-lg-mb:hidden">
        <div className="text-white bg-gray-700 rounded-md w-10 h-10 flex justify-center items-center uppercase text-2xl">
          {item.author.name[0]}
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center gap-3">
          <span className="text-lg text-white font-semibold capitalize flex items-center gap-3">
            <div className="text-white hidden bg-gray-700 rounded-md w-10 h-10 max-lg-mb:flex justify-center items-center uppercase text-2xl">
              {item.author.name[0]}
            </div>{" "}
            {item.author.name}
          </span>
          <span className="text-white text-sm">
            {GetCreatedAt(item.createdAt, true)}
          </span>
        </div>
        <p className="text-white text-sm mt-2">{item.comment}</p>
        <div className="mt-4  flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="like"
              className={`block ${
                user && user?.role != "customer"
                  ? "cursor-pointer"
                  : "pointer-events-none"
              } `}
            >
              <input
                type="checkbox"
                id="like"
                checked={like}
                className="hidden"
                onChange={(e) => {
                  user && user?.role != "customer"
                    ? likeComment(item._id, e.target.checked, user?.userID)
                    : "";
                  setLike(e.target.checked);
                }}
              />
              {!like && (
                <svg
                  className="block"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M695.56-166.15H300v-430.16l246.46-243.38 15.85 15.23q5.34 5.96 8.82 13.92 3.49 7.97 3.49 14.59v5.64l-40.31 194h278q23.73 0 42.63 18.91 18.91 18.9 18.91 42.63v48.13q0 5.36-.86 11.72-.86 6.35-2.99 11.38L761.96-208.99q-7.79 18.65-27.15 30.74-19.35 12.1-39.25 12.1Zm-358.64-36.93h359.7q8.46 0 17.3-4.61 8.85-4.62 13.46-15.39l109.54-256.8v-54.89q0-10.77-6.92-17.69-6.92-6.92-17.69-6.92H488.92l45.58-217.24-197.58 195.66v377.88Zm0-377.88v377.88-377.88ZM300-596.31v36.93H163.69v356.3H300v36.93H126.77v-430.16H300Z" />
                </svg>
              )}
              {like && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M698.46-160H306.15v-440l250.77-247.69 17.7 17.69q5.46 5.46 9.19 14 3.73 8.54 3.73 15.69v6.31l-40.92 194h268.76q25.08 0 44.85 19.77Q880-560.46 880-535.38v49.23q0 5.46-1.12 11.92-1.11 6.46-3.34 11.92L766.31-203.38q-8.23 18.46-27.69 30.92Q719.15-160 698.46-160ZM266.15-600v440H120v-440h146.15Z" />
                </svg>
              )}
            </label>

            <span className="text-white text-xs">{item.likes?.count || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="dislike"
              className={`block ${
                user && user?.role != "customer"
                  ? "cursor-pointer"
                  : "pointer-events-none"
              } `}
            >
              <input
                type="checkbox"
                id="dislike"
                className="hidden"
                checked={dislike}
                onChange={(e) => {
                  user && user?.role != "customer"
                    ? dislikeComment(item._id, e.target.checked, user?.userID)
                    : "";
                  setDisLike(e.target.checked);
                }}
              />
              {!dislike && (
                <svg
                  className="block"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M265.06-759.69h395.56v430.15L414.15-86.15l-15.84-15.23q-5.35-5.97-8.83-13.93-3.48-7.96-3.48-14.59v-5.64l40.31-194h-278q-23.73 0-42.64-18.9-18.9-18.91-18.9-42.64v-48.13q0-5.36.86-11.71.86-6.35 2.99-11.39l108.04-254.55q7.79-18.65 27.14-30.74t39.26-12.09Zm358.63 36.92H264q-8.46 0-17.31 4.62-8.84 4.61-13.46 15.38l-109.54 256.3v55.39q0 10.77 6.93 17.7 6.92 6.92 17.69 6.92h323.38L426.5-149.23l197.19-196.04v-377.5Zm0 377.5v-377.5 377.5Zm36.93 15.73v-36.92h136.3v-356.31h-136.3v-36.92h173.23v430.15H660.62Z" />
                </svg>
              )}
              {dislike && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M261.54-767.69h392.31v440L403.08-80l-17.7-17.69q-5.46-5.46-9.19-14-3.73-8.54-3.73-15.69v-6.31l40.92-194H144.62q-25.08 0-44.85-19.77Q80-367.23 80-392.31v-49.23q0-5.46 1.12-11.92 1.11-6.46 3.34-11.92l109.23-258.93q8.23-18.46 27.69-30.92 19.47-12.46 40.16-12.46Zm432.31 440v-440H840v440H693.85Z" />
                </svg>
              )}
            </label>

            <span className="text-white text-xs">
              {item.dislikes?.count || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
