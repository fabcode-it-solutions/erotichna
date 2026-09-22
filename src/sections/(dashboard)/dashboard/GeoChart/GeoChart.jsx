"use client";
import IconDots from '@/assets/icons/IconDots';
import Wrapper from '@/components/ui/wrapper/Wrapper';
import React from 'react'
import { Chart } from "react-google-charts";

export const data = [
    ["Country", "Active user:"],
    ["Germany", 57],
    ["United States", 315],
    ["Brazil", 150],
    ["Canada", 69],
    ["France", 169],
    ["RU", 101],
  ];
  const options = {
    sizeAxis:false,
      colorAxis: { colors: ["#3a3a3a", "#242424", "#000"] },
    datalessRegionColor: "#dddddd",
    defaultColor: "#000",
  };
const GeoChart = () => {
  return (
    <Wrapper className="p-5 rounded-lg border border-stroke max-w-[748px] overflow-hidden w-full max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
           <Wrapper className="flex items-center justify-between py-[1px] mb-[21px] max-lg-mb:mb-6 max-lg-mb:p-0">
        <Wrapper className="text-heading text-xl font-medium font-satoshi leading-[27px] max-lg-mb:leading-[22px] max-lg-mb:text-base">
          Active Users
        </Wrapper>
        <button>
          <IconDots />
        </button>
      </Wrapper>
       <Chart   
      chartType="GeoChart"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
    </Wrapper>
  )
}

export default GeoChart
