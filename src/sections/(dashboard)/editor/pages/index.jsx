"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Pagination from "@/components/global/pagination/Pagination";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAuth from "@/contexts/auth/AuthProvider";
import { getFormattedPublishDate } from "@/utils/getDate";
import { getPages } from "@/utils/getPage";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Index = ({ data }) => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  useEffect(() => {
    if (data) {
      setPages(data);
      setCount(Math.ceil(data.length / limit));
    }
  }, [data]);
  const limit = 10;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const getIndex = (e) => {
    setIndex(e);
  };

  const trashCategory = async (handle, token, id) => {
    const text = "Are you sure?\n You want to delete the page.";
    if (confirm(text) == true) {
      try {
        const response = await fetch("/api/admin/pages", {
          method: "PUT",
          body: JSON.stringify({ handle: handle, status: "trash", id }),
          headers: { "Content-Type": "application/json", "x-token": token },
        });
        const data = await response.json();
        if (data) {
          const result = await getPages(process.env.NEXT_PUBLIC_SITE_URL);
          setPages(result);
        }
      } catch (error) {
      } finally {
      }
    }
  };

  return (
    <div>
      <HeaderHeading
        description="Manage Pages Here."
        title="Pages"
        notification={false}
        home={true}
        search={false}
      />
      <MobileHeader heading="Pages" />
      <div className="flex justify-end my-4">
        <Link
          className="bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
          href="/dashboard/editor/pages/add"
        >
          Add New Page
        </Link>
      </div>
      <div className=" mt-8 max-md-tab:block hidden">
        {pages?.length > 0 && (
          <div>
            {pages.map((item, i) => (
              <div key={i} className="bg-white border-stroke p-3 rounded-lg">
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  <strong> {item?.title}</strong>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <div className=" text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                    <strong>
                      {item?.updatedAt ? "Updated on" : "Created On:"}
                    </strong>{" "}
                    {getFormattedPublishDate(
                      item?.updatedAt ? item?.updatedAt : item?.createdAt
                    )}
                  </div>
                </div>
                <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                  <Link
                    href={`/dashboard/editor/pages/${item?.handle}`}
                    className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                  >
                    Edit
                  </Link>

                  <div className="w-[1px] h-3 bg-text-secondary"></div>
                  <Link
                    target="_blank"
                    href={`/pages/${item?.handle}`}
                    className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                  >
                    View
                  </Link>
                  <div className="w-[1px] h-3 bg-text-secondary"></div>
                  <button
                    onClick={() =>
                      trashCategory(item?.handle, user?.userID, item?.id)
                    }
                    className="text-sm font-medium font-satoshi leading-6 relative   text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 mt-8 max-md-tab:hidden">
        {pages?.length > 0 && (
          <ul className="flex bg-warm p-2">
            <li className="w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              S.no
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Title
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Description
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative text-right  text-[#151516] ">
              Updated On
            </li>
          </ul>
        )}
        {pages?.length > 0 && (
          <ul className="border-x border-warm border-b">
            {pages.map((item, i) => (
              <li className={`flex p-2 ${i % 2 == 1 ? "bg-warm" : ""}`} key={i}>
                <div className="capitalize w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="capitalize text-sm font-bold font-satoshi leading-6 relative   text-[#151516]">
                    {item?.title}
                  </div>
                  <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                    <Link
                      href={`/dashboard/editor/pages/${item?.handle}`}
                      className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                    >
                      Edit
                    </Link>
                    <div className="w-[1px] h-3 bg-text-secondary"></div>
                    <Link
                      target="_blank"
                      href={`/pages/${item?.handle}`}
                      className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                    >
                      View
                    </Link>
                    <div className="w-[1px] h-3 bg-text-secondary"></div>
                    <button
                      onClick={() =>
                        trashCategory(item?.handle, user?.userID, item?.id)
                      }
                      className="text-sm font-medium font-satoshi leading-6 relative   text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]"
                  dangerouslySetInnerHTML={{
                    __html: item?.description
                      ? item?.description.slice(0, 150) + "..."
                      : "-",
                  }}
                ></div>

                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                  {getFormattedPublishDate(
                    item?.updatedAt ? item?.updatedAt : item?.createdAt
                  )}
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
