import React from "react";
import RoleChecker from "../../RoleChecker";
import Index from "@/sections/(dashboard)/payments/view";

const page = () => {
  return (
    <RoleChecker>
      <Index />
    </RoleChecker>
  );
};

export default page;
