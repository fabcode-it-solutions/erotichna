import React from "react";
import DashboardWrapper from "./DashboardWrapper";
import { GetSessionTrue } from "../api/auth/login/route";

const RoleChecker = async ({children}) => {
  const userloggedIN = await GetSessionTrue();
  return <DashboardWrapper userLoggedIn={userloggedIN}>{children}</DashboardWrapper>;
};

export default RoleChecker;
