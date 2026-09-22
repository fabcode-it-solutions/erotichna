"use client";
import { useState, useEffect } from "react";
import GooglePagination from "./GoogleAnalyricts";
import Pagination from "@/components/global/pagination/Pagination";

const PageReportTable = ({ values }) => {
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(0);
  const [allValues, setValues] = useState([]);
  const limit = 10;

  useEffect(() => {
    if (values) {
      setCount(Math.ceil(values.length / limit));
      setValues(values.slice(start * limit, (start + 1) * limit));
    }
  }, [start, values]);

  const handlePageChange = (e) => {
    setStart(e);
  };

  return (
    <div className=" p-6 rounded-lg border border-gray-200 mt-4 bg-warm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Views by Pages
      </h2>
      <div className="keyword-response overflow-auto ">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">Sr.no</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Page Title</th>
              <th className="border border-gray-200 px-4 py-2">Country</th>
              <th className="border border-gray-200 px-4 py-2">Screen Page Views</th>
              <th className="border border-gray-200 px-4 py-2">Users</th>
              <th className="border border-gray-200 px-4 py-2">New Users</th>
              <th className="border border-gray-200 px-4 py-2">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {allValues.map((item, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-2">
                  {start > 0 ? i + 1 + limit * start : i + 1}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  <a
                    href={item?.pagePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-semibold hover:underline break-all"
                  >
                    {item?.pageTitle !== "" ? item?.pageTitle : "(not set)"}
                  </a>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item?.country}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item?.screenPageViews}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item?.users}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item?.newUsers}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item?.sessions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination count={count} getIndex={handlePageChange} index={start} dark={true} />
        </div>
      </div>
    </div>
  );
};

export default PageReportTable;
