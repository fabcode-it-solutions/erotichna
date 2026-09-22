"use client";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const CountryChart = ({ countryWiseUsers }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (countryWiseUsers) {
      const da = [["Country", "Users"]];
      Object.keys(countryWiseUsers).forEach((item) => {
        da.push([item, countryWiseUsers[item]]);
      });
      setData(da);
    }
  }, [countryWiseUsers]);

  const options = {
    sizeAxis: false,
    colorAxis: { 
      colors: ["#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#cc0000"]
    },
    datalessRegionColor: "#dddddd",
    defaultColor: "#ffcccc"
  };

  return (
    
    <Chart
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper.getChart();
            const selection = chart.getSelection();
            if (selection.length === 0) return;
            const region = data[selection[0].row + 1];
            // You can do something with the selected region here
          },
        },
      ]}
      chartType="GeoChart"
      width="100%"
      height="550px"
      data={data}
      options={options}
    />
  );
};

export default CountryChart;
