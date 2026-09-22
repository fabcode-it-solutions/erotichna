"use client";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "New users",
  bar: { groupWidth: "95%" },
  legend: { position: "none" },
  colors: ["#FF0000"], // All bars will be red
};

const TopFivePages = ({ values }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (values) {
      const array = [
        ["Page Title", "Sessions"],
      ];


      values.map((item, i) => {
        if (i < 5) {
          array.push([
            item?.pageTitle.length > 25 ? item?.pageTitle.slice(0, 25) + "..." : item?.pageTitle,
            parseFloat(item.sessions),
          ]);
        }
      });
      setData(array);
    }
  }, [values]);

  return (
    <div className="bg-white p-6 rounded-lg border-dark-100 mt-4 flex-[2]">
      <h2 className="text-2xl font-semibold text-dark-100 mb-2">
        Top 5 Visited Pages By Sessions
      </h2>
      <div className="bar-chart">
        <Chart
          chartType="Bar"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default TopFivePages;
