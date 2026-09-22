import React, { Suspense } from "react";
import MainWrapper from "../MainWrapper";
import Index from "@/sections/(main)/verify-otp/view";

export const metadata = {
  title: "Verify OTP | Erotichna",
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
