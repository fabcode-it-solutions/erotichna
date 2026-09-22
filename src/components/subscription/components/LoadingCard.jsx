import React from "react";

const LoadingCard = () => (
  <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-700 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-gray-700 rounded w-24"></div>
        <div className="h-10 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export default LoadingCard;
