import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const metrics = [
  { label: "Clicks", key: "clicks", color: "#4285F4", chartType: "Histogram" },
  {
    label: "Impressions",
    key: "impressions",
    color: "#EA4335",
    chartType: "Histogram",
  }, // Changed to Histogram
  { label: "CTR", key: "ctr", color: "#FBBC05", chartType: "Histogram" },
  {
    label: "Position",
    key: "position",
    color: "#34A853",
    chartType: "Histogram",
  },
];

const LineChart = ({ values }) => {
  const [chartData, setChartData] = useState([]);

  const rawData = values ? values?.date : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const getDataForMetric = (metricKey) => {
    const transformedData = [
      ["Date", metricKey.charAt(0).toUpperCase() + metricKey.slice(1)],
      ...rawData.map((entry) => [
        formatDate(entry.label),
        metricKey === "ctr"
          ? parseFloat(entry[metricKey].replace("%", ""))
          : entry[metricKey],
      ]),
    ];

    return transformedData;
  };

  const calculateMetricValues = () => {
    const totals = {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };

    rawData.forEach((entry) => {
      totals.clicks += entry.clicks;
      totals.impressions += entry.impressions;
      totals.ctr += parseInt(entry.ctr.replace("%", ""));
      totals.position += entry.position;
    });

    const avgCTR = totals.impressions
      ? ((totals.clicks / totals.impressions) * 100).toFixed(1)
      : 0;
    const avgPosition = rawData.length
      ? (totals.position / rawData.length).toFixed(2)
      : 0;

    return {
      clicks: { total: totals.clicks, text: "Total Clicks" },
      impressions: { total: totals.impressions, text: "Total Impressions" },
      ctr: { total: avgCTR, text: "Average CTR (%)" },
      position: { total: avgPosition, text: "Average Position" },
    };
  };

  const metricValues = calculateMetricValues();

  useEffect(() => {
    setChartData(values?.date);
  }, [values]);

  const options = (color, metricLabel, isClicks) => ({
    hAxis: {
      format: "M/d/yy",
      textStyle: {
        fontSize: 10,
      },
      gridlines: {
        count: Math.floor(rawData.length / 3),
      },
      showTextEvery: 5,
    },
    vAxis: {
      textStyle: {
        fontSize: 10,
      },
      title: metricLabel,
      titleTextStyle: {
        // Customize the Y-axis title
        fontSize: 12, // Set the font size
        color: "black", // Set the font color
        fontName: "", // Set the font family
        bold: false, // Set to true for bold text
        italic: false, // Set to true for italic text
      },
    },
    legend: { position: "none" },
    curveType: isClicks ? "none" : "function", // Change curveType based on the metric

    curveType: "function",
    animation: {
      startup: true,
      duration: 500,
      easing: "out",
    },
    colors: [color],
    explorer: {
      axis: "horizontal",
      keepInBounds: true,
      maxZoomIn: 4.0,
    },
    backgroundColor: { fill: "#f9f9f9" },
  });

  return (
    <div className="my-6 rounded-xl bg-white shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          return (
            <div
              key={metric.key}
              className="p-4 bg-gray-100 rounded-md  transition-transform transform"
            >
              <div className="flex justify-center">
                <h3 className="text-center mb-2 font-bold text-[12px]">
                  {metric.label}
                </h3>
                <div className="text-center text-[12px] px-2 mb-2">
                  {" "}
                  (<span className="">{metricValues[metric.key].text}: </span>
                  <strong className="">
                    {metricValues[metric.key].total}
                  </strong>{" "}
                  )
                </div>
              </div>

              <Chart
                chartType={metric.chartType}
                data={getDataForMetric(metric.key)}
                options={options(metric.color, metric.label, metric.key)} // Pass isClicks condition
                legendToggle
                width={"100%"}
                height={"330px"}
                className=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineChart;
