import React from "react";
import Link from "next/link";

const NoSubscriptionCard = () => (
  <div className="bg-gray-900/50 p-12 rounded-xl border border-gray-700 text-center">
    <div className="w-20 h-20 bg-[#ff4040]/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg
        className="w-10 h-10 text-[#ff4040]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">
      No Active Subscription
    </h3>
    <p className="text-gray-300 mb-8 max-w-md mx-auto">
      You don&apos;t have an active subscription. Choose from our premium plans
      to unlock all exclusive content and features.
    </p>
    <Link
      href="/get-access"
      className="inline-flex items-center px-8 py-4 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Get Access Now
    </Link>
  </div>
);

export default NoSubscriptionCard;
