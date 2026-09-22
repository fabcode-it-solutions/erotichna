import RoleChecker from "@/app/(dashboard)/RoleChecker";
import Index from "@/sections/(dashboard)/editor/pages";
import { getPages } from "@/utils/getPage";
import React from "react";
const pages = await getPages(process.env.SITE_URL);

const page = () => {
  return (
    <RoleChecker>
      <Index data={pages} />
    </RoleChecker>
  );
};
export default page;
