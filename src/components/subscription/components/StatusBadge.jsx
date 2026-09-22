import React from "react";

const StatusBadge = ({ status, active }) => {
  const getStatusConfig = () => {
    if (active === true && status === "active") {
      return {
        text: "Active",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    }
    if (status === "pending_cancellation") {
      return {
        text: "Pending Cancellation",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    }
    if (status === "cancelled" || status === "expired") {
      return {
        text: "Inactive",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    }
    return {
      text: "Inactive",
      className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          config.text === "Active"
            ? "bg-green-400"
            : config.text === "Pending Cancellation"
            ? "bg-yellow-400"
            : "bg-red-400"
        }`}
      ></div>
      {config.text}
    </span>
  );
};

export default StatusBadge;
