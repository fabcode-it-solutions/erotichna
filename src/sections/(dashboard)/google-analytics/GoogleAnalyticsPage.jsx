"use client";
import NewUserGroupingChart from "./NewUserGroupingChat";
import SessionGrouping from "./SessionGrouping";
import CountryChart from "./CountryChart";
import PageReportTable from "./PageReportTable";
import { useState, useEffect } from "react";
import TopFivePages from "./TopFivePages";
import MostPopular from "./MostPopular";
import GoogleConsoleComponent from "./GoogleConsoleComponent";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Loader from "@/components/global/Loading/Loader";

const GoogleAnalyticsPage = ({ data, analyticsdata }) => {
  const [loader, setLoader] = useState(false);
  const [analyticdata, setanalyticsdata] = useState(false);
  const [heading, setHeading] = useState("One day");
  const getAnalyticsdata = async (startDate) => {
    try {
      setLoader(true);
      const res = await fetch(`/api/analytics?startDate=${startDate}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (!analyticdata) {
      setanalyticsdata(analyticsdata);
    }
  }, [analyticsdata]);
  const getStartDate = (range) => {
    const today = new Date();
    let startDate = new Date();
    setHeading(range);
    switch (range) {
      case "One day":
        startDate.setDate(today.getDate() - 1);
        break;
      case "One week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "One month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return null;
    }

    return startDate.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  const getData = async (e) => {
    const range = e.target.value;
    const startDate = getStartDate(range);
    const result = await getAnalyticsdata(startDate);

    setanalyticsdata(result?.filteredData);
  };

  return (
    <div>
      {loader && <Loader message="Fetching Data..." />}
      <div className="">
        <HeaderHeading
          title="Google Analytics"
          description="Here you can see google analytics data"
          home={true}
          notification={false}
          search={false}
        />
        <MobileHeader heading="Google Analytics" />
       <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl max-md-tab:text-2xl flex justify-center font-semibold  tracking-normal text-dark-100 my-6">
          Showing Data for {heading}
        </h1>
        <select onChange={(e) => getData(e)} className=" h-10 ml-2 border border-stroke rounded-lg px-4 text-sm text-dark-150 font-satoshi leading-5 tracking-[-0.14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="One day">One Day analysis.</option>
          <option value="One week">One week analysis.</option>
          <option value="One month">One month analysis.</option>
        </select>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Users Card */}
          <div className="bg-warm rounded-lg p-8 shadow-md hover:shadow-lg transition flex flex-col items-center">
            <span
              className="text-sm font-semibold text-gray-500 text-center truncate w-full"
              title="Users"
            >
              Users
            </span>
            <span className="text-5xl font-semibold text-gray-800">
              {analyticdata.header?.totalUsers}
            </span>
          </div>

          {/* New Users Card */}
          <div className="bg-warm rounded-lg p-8 shadow-md hover:shadow-lg transition flex flex-col items-center">
            <span
              className="text-sm font-semibold text-gray-500 text-center truncate w-full"
              title="New Users"
            >
              New Users
            </span>
            <span className="text-5xl font-semibold text-gray-800">
              {analyticdata.header?.totalNewUsers}
            </span>
          </div>

          {/* Average Engagement Time Card */}
          <div className="bg-warm rounded-lg p-8 shadow-md hover:shadow-lg transition flex flex-col items-center">
            <span
              className="text-sm font-semibold text-gray-500 text-center truncate w-full"
              title="Average Engagement Time"
            >
              Average Engagement Time
            </span>
            <span className="text-5xl font-semibold text-gray-800">
              {analyticdata.header?.avgSessionDuration}
            </span>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-warm rounded-lg p-8 shadow-md hover:shadow-lg transition flex flex-col items-center">
            <span
              className="text-sm font-semibold text-gray-500 text-center truncate w-full"
              title="Total Revenue"
            >
              Total Revenue
            </span>
            <span className="text-5xl font-semibold text-gray-800">
              {analyticdata.header?.totalRevenue}
            </span>
          </div>
        </div>
        <div className="flex gap-2 max-md-tab:flex-wrap px-4 py-4 mt-[50px] pb-5 justify-between max-md-tab:flex-col bg-warm">
          <NewUserGroupingChart
            newUserGroupingValues={analyticdata.sessionDefaultChannelGrouping}
          />
          <SessionGrouping
            sessionGroupingValues={analyticdata.sessionDefaultChannelGrouping}
            heading="What are your top campaigns?"
            keyHead="Session primary channel group"
            valueHead="Sessions"
          />
        </div>
        <h2 className="text-2xl font-semibold text-dark-100 my-2 mt-6">
          Data by Country
        </h2>
        <div className="flex gap-2 max-md-tab:flex-wrap bg-warm  px-4 py-4 justify-between max-md-tab:flex-col">
          <div className="w-[65%] h-full">
            <CountryChart
              countryWiseUsers={analyticdata.activeUsersByCountry}
            />
          </div>

          <SessionGrouping
            sessionGroupingValues={analyticdata.activeUsersByCountry}
            heading="Users by Country"
            keyHead="Country"
            valueHead="Users"
          />
        </div>
        <h2 className="text-2xl font-semibold text-dark-100 my-2 mt-6">
          Data by Pages
        </h2>
        <PageReportTable values={analyticdata.pageReportPerPageCountValues} />
        <div>
          <div className="flex gap-2 max-md-tab:flex-wrap bg-warm px-4 pb-5 pt-5 mt-[40px] justify-between  mb-16 max-md-tab:flex-col">
            <TopFivePages values={analyticdata.pageReportPerPageCountValues} />
            <MostPopular
              values={analyticdata.mostVisitedPages}
              keyHead="Page Title"
              valueHead="Users"
              heading="Most Visited Pages"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-dark-100 my-2 mt-6">
            Performance
          </h2>
          <div className="bg-warm px-4 py-4">
            <GoogleConsoleComponent values={analyticdata.performance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsPage;
