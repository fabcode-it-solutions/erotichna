"use client";
import React from "react";
import SubscriptionDashboard from "@/components/subscription/SubscriptionDashboard";

const SubscriptionDashboardPage = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Subscription Dashboard
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Manage your subscription, view payment history, and access all your
            premium content in one place.
          </p>
        </div>

        <SubscriptionDashboard />
      </div>
    </div>
  );
};

export default SubscriptionDashboardPage;
