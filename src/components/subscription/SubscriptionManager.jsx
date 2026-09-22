"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useAuth from "@/contexts/auth/AuthProvider";

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (user?.userID || user?._id) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const userId = user?.userID || user?._id;
      const response = await fetch(`/api/subscribe/status?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        setError(data.error || "Failed to load subscription");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      const userId = user?.userID || user?._id;

      const response = await fetch("/api/subscribe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          reason: "User requested cancellation",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Open YourSafe cancellation URL in new window
        if (data.cancelUrl) {
          window.open(data.cancelUrl, "_blank");
        }

        alert(data.message);
        setShowCancelModal(false);
        // Refresh subscription status
        checkSubscriptionStatus();
      } else {
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "text-green-500";
      case "pending_cancellation":
        return "text-yellow-500";
      case "cancelled":
      case "expired":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case true:
        return "Active";
      default:
        return "Inactive";
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-100 p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-100 p-6 rounded-lg">
        <div className="text-red-500">{error}</div>
        <button
          onClick={checkSubscriptionStatus}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!subscription || !subscription.type) {
    return (
      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">
          No Active Subscription
        </h3>
        <p className="text-gray-400 mb-4">
          You don&apos;t have an active subscription. Subscribe now to access
          all premium content!
        </p>
        <Link
          href="/get-access"
          className="inline-block px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Get Access Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Subscription Details
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Plan:</span>
            <span className="text-white font-medium">{subscription.type}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Status:</span>
            <span
              className={`font-medium ${getStatusColor(subscription.active)}`}
            >
              {getStatusLabel(subscription.active)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Started:</span>
            <span className="text-white">
              {formatDate(subscription.startDate)}
            </span>
          </div>

          {subscription.nextChargeDate && subscription.status === "active" && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Next Billing:</span>
              <span className="text-white">
                {formatDate(subscription.nextChargeDate)}
              </span>
            </div>
          )}

          {subscription.daysRemaining > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Days Remaining:</span>
              <span className="text-white">
                {subscription.daysRemaining} days
              </span>
            </div>
          )}

          {subscription.cancelDate && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Cancelled On:</span>
              <span className="text-white">
                {formatDate(subscription.cancelDate)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {subscription.status === "active" && (
            <>
              <Link
                href="/get-access"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Upgrade Plan
              </Link>
              <button
                onClick={() => setShowCancelModal(true)}
                className="hidden px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel Subscription
              </button>
            </>
          )}

          {(subscription.status === "cancelled" ||
            subscription.status === "expired") && (
            <Link
              href="/get-access"
              className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Renew Subscription
            </Link>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-150 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Cancel Subscription?
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You will
              continue to have access until the end of your current billing
              period.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={cancelling}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={cancelling}
              >
                {cancelling ? "Processing..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionManager;
