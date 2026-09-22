"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import React, { useEffect } from "react";
import CreateListingForm from "../CreateListingForm";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = ({ slug }) => {
  const title = slug.toUpperCase();
  return (
    <Wrapper>
      <HeaderHeading
        title={`Edit Video - ${title.replaceAll("-", " ")}`}
        description="Compose and publish a fresh update."
        home={true}
        notification={false}
        search={true}
      />
      <MobileHeader heading={`Edit Video`} />
      <CreateListingForm slug={slug} />
    </Wrapper>
  );
};

export default Index;
