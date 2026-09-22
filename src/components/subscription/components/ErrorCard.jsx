import React from "react";

const ErrorCard = ({ error, onRetry }) => (
  <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-xl">
    <div className="text-center">
      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-6 h-6 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        Error Loading Subscription
      </h3>
      <p className="text-gray-300 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorCard;
