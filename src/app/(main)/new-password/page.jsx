import React, { Suspense } from "react";
import MainWrapper from "../MainWrapper";
import Index from "@/sections/(main)/new-password/view";

export const metadata = {
  title: "New Password | Erotichna",
  description: "",
};
const page = () => {
  return (
    <MainWrapper>
      <Suspense>
        <Index />
      </Suspense>
    </MainWrapper>
  );
};

export default page;
