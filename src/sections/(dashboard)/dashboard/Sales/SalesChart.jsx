"use client";
import IconDots from "@/assets/icons/IconDots";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const SkeletonLoader = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Title */}
      <div className="h-5 w-32 bg-gray-200 rounded mb-6"></div>

      {/* Toggle buttons */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-[400px] bg-gray-200 rounded-lg"></div>
    </div>
  );
};

const SalesChart = () => {
  const [table, setTable] = useState({ header: ["Month"], rows: [] });
  const [visibleYears, setVisibleYears] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------
  // Fetch Data
  // ------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/dashboard/saleschart");
        const json = await res.json();
        console.log("Sales chart data  -->", json);
        if (res.ok && json?.table) {
          const now = new Date();
          const monthIdx = now.getMonth();
          const header = json.table.header || ["Month"];

          // Detect year columns
          const yearColumns = header.slice(1);

          // Set initial visibility (all enabled)
          const defaultVisibility = {};
          yearColumns.forEach((year) => {
            defaultVisibility[year] = true;
          });
          setVisibleYears(defaultVisibility);

          // Hide future months of current year
          const currentYear = String(now.getFullYear());
          const currentYearCol = header.findIndex((h) => h === currentYear);

          const rows = Array.isArray(json.table.rows)
            ? json.table.rows.map((row, i) => {
                if (currentYearCol > 0 && i > monthIdx) {
                  const next = [...row];
                  next[currentYearCol] = null;
                  return next;
                }
                return row;
              })
            : [];

          setTable({ header, rows });
        } else {
          setError(json.error || "Failed to load chart data");
        }
      } catch (e) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------------
  // Filter Visible Years
  // ------------------------------
  const getFilteredData = () => {
    const yearIndexesToHide = [];

    table.header.forEach((col, i) => {
      if (i === 0) return;
      if (!visibleYears[col]) {
        yearIndexesToHide.push(i);
      }
    });

    const filteredHeader = table.header.filter(
      (_, i) => !yearIndexesToHide.includes(i)
    );

    const filteredRows = table.rows.map((row) =>
      row.filter((_, i) => !yearIndexesToHide.includes(i))
    );

    return [filteredHeader, ...filteredRows];
  };

  // ------------------------------
  // Colors
  // ------------------------------
  const colors = ["#4285F4", "#DB4437", "#F4B400"];
  const yearColors = {};
  table.header.slice(1).forEach((year, idx) => {
    yearColors[year] = colors[idx % colors.length];
  });

  const options = {
    curveType: "function",
    legend: { position: "top" },
    colors: table.header
      .slice(1)
      .filter((y) => visibleYears[y])
      .map((y) => yearColors[y]),
    focusTarget: "category",
    chartArea: { left: 70, right: 20, top: 30, bottom: 40 },
    hAxis: { slantedText: true },
    vAxis: { format: "currency" },
  };

  const toggleYear = (year) => {
    setVisibleYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  return (
    <Wrapper className="p-5 rounded-lg border border-stroke max-w-[748px] overflow-hidden w-full">
      <Wrapper className="flex items-center justify-between mb-[21px]">
        <Wrapper className="text-heading text-xl font-medium">Sales</Wrapper>
        <button>
          <IconDots />
        </button>
      </Wrapper>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="py-4">
          <SkeletonLoader />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="text-negative text-sm mb-2">{error}</div>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <>
          {/* TOGGLE BUTTONS */}
          <div className="flex gap-3 mb-4">
            {table.header.slice(1).map((year) => (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  border flex items-center gap-2
                  ${
                    visibleYears[year]
                      ? "bg-white text-[#151516] border-[#dcdcdc] shadow-sm"
                      : "bg-[#f1f1f1] text-[#636363] border-[#f1f1f1]"
                  }
                `}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: yearColors[year] }}
                ></span>

                {year}
              </button>
            ))}
          </div>

          {/* CHART */}
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={getFilteredData()}
            options={options}
          />
        </>
      )}
    </Wrapper>
  );
};

export default SalesChart;
