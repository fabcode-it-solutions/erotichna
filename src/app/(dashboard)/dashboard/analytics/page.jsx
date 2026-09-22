import React from "react";
import Index from "@/sections/(dashboard)/google-analytics/view";
import RoleChecker from "../../RoleChecker";

const getAnalyticsdata = async () => {
  const today = new Date();
  let startDate = new Date();

  startDate.setDate(today.getDate() - 1);
  const date = startDate.toISOString().split("T")[0];

  try {
    const res = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/analytics?startDate=${date}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
  }
};

const page = async () => {
  const getdata = await getAnalyticsdata();
  return (
    <RoleChecker>
      <Index analyticsdata={getdata} />
    </RoleChecker>
  );
};

export default page;
