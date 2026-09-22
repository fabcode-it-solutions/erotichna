"use client"
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import React, { useEffect } from "react";
import CreateListingForm from "../CreateListingForm";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = () => {
  return (
    <Wrapper>
      <HeaderHeading
        title="Add New Video"
        description="Compose and publish a fresh update."
        home={true}
        notification={false}
        search={true}
      />
      <MobileHeader heading='Add New Video' />
      <CreateListingForm />
    </Wrapper>
  );
};

export default Index;
