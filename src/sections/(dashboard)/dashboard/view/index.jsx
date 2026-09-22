import React from "react";
import NewCustomersList from "../NewCustomersList/NewCustomersList";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import SalesCards from "../SalesCards/SalesCards";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Toplistings from "../Toplistings/Toplistings";
import SalesChart from "../Sales/SalesChart";
import GeoChart from "../GeoChart/GeoChart";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

const Index = () => {
  return (
    <div>
      <HeaderHeading
        description="See quick data about your videos and users."
        home={true}
        notification={false}
        search={true}
      />
      <MobileHeader heading="Home" />
      <SalesCards />
      <Wrapper className="flex gap-6 mt-6 max-md-tab:flex-wrap">
        <SalesChart />
        <Toplistings />
      </Wrapper>
      <Wrapper className="flex gap-6 mt-6 max-md-tab:flex-wrap">
        <NewCustomersList />
        {/* <GeoChart /> */}
      </Wrapper>
    </div>
  );
};

export default Index;
