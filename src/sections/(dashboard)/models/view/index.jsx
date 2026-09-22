/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import React, { useEffect, useState } from "react";
import ModelCard from "../modelCard";
import Pagination from "@/components/global/pagination/Pagination";
import FilterBar from "@/components/dashboard/FilterBar/FilterBar";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAuth from "@/contexts/auth/AuthProvider";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Loader from "@/components/global/Loading/Loader";

const Index = () => {
  const { user } = useAuth();
  const [filterdPosts, setFiltredPosts] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSorting] = useState("new-to-old");
  const limit = 18;
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [orderChangeInput, setOrderChangeInput] = useState(false);
  const [orderUpdate, setOrderUpdate] = useState(true);
  const filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Published",
      value: "publish",
    },
    {
      label: "Draft",
      value: "draft",
    },
  ];
  const getActiveFilter = (e) => {
    setFilterStatus(e);
  };

  const getIndex = (e) => {
    setIndex(e);
  };

  const getModels = async (e) => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `/api/admin/models/admin-sorting?sort=${e}&status=${filterStatus}&limit=${limit}&skip=${
          index * limit
        }&isModel=true`,
        {
          method: "GET",
          headers: {
            "X-TOKEN": user.userID || null,
          },
        }
      );
      const data = await response.json();
      console.log("ALLMODELS", data);
      if (data) {
        setFiltredPosts(data?.items);
        setTotalCount(data?.totalCount);
        setCount(
          data?.totalCount / limit <= 1
            ? 0
            : Math.ceil(data?.totalCount / limit)
        );
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoadingData(false);
      }, 300);
    }
  };
  useEffect(() => {
    getModels(sort);
  }, [sort, index, filterStatus, user]);
  const sorting = async (e) => {
    setSorting(e.target.value);
  };
  const updateOrderNyNumber = async (e) => {
    e.preventDefault();
    try {
      setLoader({
        active: true,
        message: "Updating Order...",
      });
      const response = await fetch("/api/admin/models/admin-sorting", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: orderChangeInput,
          sort,
        }),
      });
      const data = await response.json();
      if (!data?.error) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Order updated successfully. ",
        });
        console.log(data?.items);
        setFiltredPosts(data?.items);
        setTotalCount(data?.totalCount);
        setOrderChangeInput(false);
        setOrderUpdate(true);
        setCount(
          data?.totalCount / limit <= 1
            ? 0
            : Math.ceil(data?.totalCount / limit)
        );
      } else {
        setError({
          active: true,
          message: data.error,
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  const hasNoNewOrder = (data) => {
    return !Object.values(data).some((order) => order.newOrder !== undefined);
  };
  useEffect(() => {
    const result = hasNoNewOrder(orderChangeInput);
    setOrderUpdate(result);
  }, [orderChangeInput]);
  return (
    <div>
      {loader?.active && <Loader message={loader.message} />}
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {error?.active && (
        <ToastError
          active={error?.active}
          message={error?.message}
          setError={setError}
        />
      )}
      <HeaderHeading
        title="Models"
        home={true}
        notification={false}
        search={true}
        description="See quick data about your models."
      />
      <MobileHeader heading="Models" />
      <div className="flex items-center gap-4 !mt-[34px] max-lg-mb:flex-wrap max-lg-mb:gap-0">
        <FilterBar
          active={"all"}
          tabStyle="pl-2.5 pr-2 max-lg-mb:!justify-center"
          items={filters}
          setActiveFilter={getActiveFilter}
          className="mb-diff-tabs order-tabs max-lg-mb:!mb-4 flex-1 !mt-0 max-lg-mb:flex-none"
          wrapperStyle={"!gap-0 max-lg-mb:!gap-2 "}
          countStyle="!h-[13.71px] !w-[13.14px] !static !ml-[3px]"
        />
        <div className="flex justify-between items-center max-lg-mb:!mb-0 max-lg-mb:w-full">
          <label className="text-sm text-dark-150 font-satoshi leading-5">
            Sort by
          </label>
          <select
            onChange={(e) => {
              sorting(e);
            }}
            className="w-40 h-10 ml-2 border border-stroke rounded-lg px-4 text-sm text-dark-150 font-satoshi leading-5 tracking-[-0.14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            name="cars"
            id="cars"
          >
            <option value="new-to-old">New to old</option>
            <option value="old-to-new">Old to new</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>
      <div className="grid min-3xl:grid-cols-6 mb-2xl:grid-cols-2 gap-4.5 p-[5px] mt-6">
        {!filterdPosts &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              role="status"
              className="flex items-center justify-center relative max-w-sm bg-gray-75 rounded-lg animate-pulse "
            >
              <svg
                width="24"
                height="24"
                className="w-10 h-10 text-gray-400 absolute opacity-35"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="pb-[170.97%]  w-full flex justify-center items-center">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ))}
        {loadingData &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              role="status"
              className="flex items-center justify-center relative max-w-sm bg-gray-75 rounded-lg animate-pulse "
            >
              <svg
                width="24"
                height="24"
                className="w-10 h-10 text-gray-400 absolute opacity-35"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="pb-[170.97%]  w-full flex justify-center items-center">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ))}
        {filterdPosts.length > 0 &&
          !loadingData &&
          filterdPosts.map((model, i) => {
            return (
              <div
                className="p-2 border-dashed border-gray-400 rounded-lg border "
                key={i}
              >
                {!orderChangeInput || orderChangeInput[model._id]?.prevOrder ? (
                  <input
                    value={orderChangeInput[model._id]?.newOrder || ""}
                    placeholder={
                      model?.orderTemp
                        ? totalCount + 1 - model?.orderTemp
                        : i + 1
                    }
                    onBlur={(e) =>
                      orderChangeInput[model._id]?.newOrder
                        ? ""
                        : setOrderChangeInput(false)
                    }
                    onChange={(e) => {
                      if (totalCount >= e.target.value) {
                        setOrderChangeInput((prev) => ({
                          ...prev,
                          [model._id]: {
                            ...prev[model._id],
                            newOrder: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                            prevOrder: model?.orderTemp
                              ? model?.orderTemp
                              : limit * index + i + 1,
                          },
                        }));
                      } else {
                        setError({
                          active: true,
                          message: `The maximum allowed number is ${totalCount}. You cannot add a number greater than ${totalCount}.`,
                        });
                      }
                    }}
                    type="number"
                    className={`mt-[-19px] text-center text-xs block  ml-[-19px] w-6 h-6 rounded-full  appearance-textfield bg-white border font-bold ${
                      orderChangeInput[model._id]?.newOrder
                        ? "border-gray-800  border-solid"
                        : "border-gray-400  border-dashed"
                    }`}
                  />
                ) : (
                  <div className="mt-[-19px] text-center text-xs text-gray-200 flex items-center justify-center  ml-[-19px] w-6 h-6 rounded-full bg-white border-dashed border border-gray-200 font-bold">
                    {model?.orderTemp
                      ? totalCount + 1 - model?.orderTemp
                      : i + 1}
                  </div>
                )}
                <ModelCard model={model} status={filterStatus} />
              </div>
            );
          })}
      </div>
      {filterdPosts?.length === 0 && (
        <div className="text-center  text-[#151516] text-base font-medium font-satoshi leading-5 tracking-[-0.14px]">
          No Record Found.
        </div>
      )}
      {count > 0 && !loadingData ? (
        <div className="mt-10">
          <Pagination
            dark={true}
            count={count}
            getIndex={getIndex}
            index={index}
            visiblePages={8}
          />
        </div>
      ) : (
        ""
      )}
      {!orderUpdate && (
        <div className="sticky -bottom-6 p-2 flex justify-center  z-[999] w-full">
          <div className="bg-white py-2 p-4 rounded-xl flex gap-4 bg-opacity-20 backdrop-blur-sm border-2 border-custom-red">
            <button
              onClick={(e) => updateOrderNyNumber(e)}
              type="button"
              className="text-center min-w-[125px] py-3 max-lg-mb:mt-2 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Update Order
            </button>

            <button
              onClick={(e) => setOrderUpdate(true)}
              type="button"
              className="text-center py-3 min-w-[125px]  max-lg-mb:mt-2  max-lg-mb:ml-2 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
