import RoleChecker from "@/app/(dashboard)/RoleChecker";
import Index from "@/sections/(dashboard)/editor/pages/2257/view";
import { getPageContent } from "@/utils/getPage";
import React from "react";
const page = async ({params}) => {
  const slug = (await params).slug
  const pageData = await getPageContent(slug);  
  
  return (
    <RoleChecker>
      <Index pageData={pageData} slug={slug} />
    </RoleChecker>
  );
};

export default page;
