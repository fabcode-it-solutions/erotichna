import Loader from "@/components/global/Loading/Loader";
import GoogleAnalyticsPage from "../GoogleAnalyticsPage";
const Index = ({ analyticsdata }) => {
  if (analyticsdata) {
    return (
      <div className="">
        <GoogleAnalyticsPage analyticsdata={analyticsdata.filteredData} />
      </div>
    );
  }

  return (
    <div className="pt-[200px]">
      <div>No data available.</div>
    </div>
  );
};

export default Index;
