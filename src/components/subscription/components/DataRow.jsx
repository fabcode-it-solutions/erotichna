import React from "react";

const DataRow = ({ label, value, className = "" }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className={`text-white font-semibold ${className}`}>{value}</span>
  </div>
);

export default DataRow;
