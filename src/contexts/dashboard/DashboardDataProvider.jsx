"use client";

import React, { useContext, useEffect, useState } from "react";
const DashboardDataContext = React.createContext();

export default function useDashboard() {
  return useContext(DashboardDataContext);
}

export function DashboardDataProvider({ children }) {
  const [allVideos, setAllVideos] = useState([]);
  const value = {
    allVideos, setAllVideos
  };
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}
