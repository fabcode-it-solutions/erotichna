import React from "react";
import RoleChecker from "../../RoleChecker";
import Index from "@/sections/(dashboard)/invoices/view";

const page = () => {
  return (
    <RoleChecker>
      <Index />
    </RoleChecker>
  );
};

export default page;
