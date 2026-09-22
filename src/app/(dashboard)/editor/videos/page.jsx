import React from "react";
import Index from "@/sections/(dashboard)/editor/videos/view";
import RoleChecker from "../../RoleChecker";

export const metadata = {
  title: "Editor | Videos | Erotichna",
  description: "Videos page data editor",
};
const page = () => {
  return (
    <RoleChecker>
      <Index />
    </RoleChecker>
  );
};

export default page;
