"use client";
import SalesCard from "../SalesCard/SalesCard";
import React, { useEffect, useState } from "react";

const SalesCards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard/salescards");
        const json = await res.json();
        console.log("sales cards data -->", json);
        if (!json.error) setData(json);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lists = [
    {
      heading: "New users",
      money: data ? String(data.newUsers.count) : "-",
      number: data ? data.newUsers.changePercent : undefined,
      description: data ? data.newUsers.description : "",
    },
    {
      heading: "New Subscriptions",
      money: data ? String(data.newSubscriptions.count) : "-",
      // number: data ? data.newSubscriptions.changePercent : undefined,
      description: data ? data.newSubscriptions.description : "",
    },
    {
      heading: "Sales",
      money: data ? `$${Number(data.sales.total).toLocaleString()}` : "-",
      number: data ? data.sales.changePercent : undefined,
      description: data ? data.sales.description : "",
    },
  ];

  return (
    <div
      className="max-w-[1150px] max-md-tab:mt-12 mt-8 pl-4 pr-[38px] py-4 bg-white rounded-lg max-xsm-tab:mt-4
    border border-[#eaeaea] justify-start items-center flex w-full
    max-xl-dx-1:max-w-full max-xl-dx:gap-4 max-lg-tab:flex-wrap
 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white max-lg-mb:p-3
max-lg-mb:gap-3
max-xsm-tab:!pr-4 
    "
    >
      {lists &&
        lists.map((item, i) => (
          <SalesCard
            key={i}
            heading={item?.heading}
            money={loading ? "…" : item?.money}
            description={item?.description}
            number={item?.number}
            className={`max-xsm-tab:p-3 max-xsm-tab:border max-xsm-tab:border-[#EBEBEB] max-xsm-tab:rounded-lg max-xsm-tab:w-full  max-lg-tab:border-0 max-lg-tab:p-0 max-lg-tab:flex-none max-lg-tab:w-[calc(50%-10px)] ${
              i > 0 ? "pl-[30px] border-l border-stroke" : ""
            }`}
          />
        ))}
    </div>
  );
};

export default SalesCards;
