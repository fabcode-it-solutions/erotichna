import React from "react";
import RoleChecker from "../../RoleChecker";
import Index from "@/sections/(dashboard)/dashboard/CustomersList/CustomersList";

export const metadata = {
  title: "Dashboard | Customers | Erotichna",
  description: "All customers list",
};

const page = () => {
  return (
    <RoleChecker>
      <Index />
    </RoleChecker>
  );
};

export default page;
